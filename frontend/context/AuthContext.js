import { createContext, useReducer, useMemo, useContext } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();
const AuthDispatchContext = createContext();
const AuthState = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuth);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, data, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          });

          const jwtToken = response.data.access_token;
          const userEmail = response.data.email;
          const payMeLink = response.data.payme_link;
          const userName = response.data.username;

          await SecureStore.setItemAsync("token", jwtToken);
          await SecureStore.setItemAsync("email", userEmail);
          await SecureStore.setItemAsync("payMeLink", payMeLink);
          await SecureStore.setItemAsync("userName", userName);

          dispatch({ type: "SIGN_IN", token: jwtToken });
          return "True";
        } catch (error) {
          console.log(error.response.data.detail);
          return error.response.data.detail;
        }
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <AuthState.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        <AuthContext.Provider value={authContext}>
          {children}
        </AuthContext.Provider>
      </AuthDispatchContext.Provider>
    </AuthState.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}

export function useAuthState() {
  return useContext(AuthState);
}

function authReducer(prevState, action) {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    default: {
      throw Error("Unkown action: " + action.type);
    }
  }
}

const initialAuth = {
  isLoading: false,
  isSignout: false,
  userToken: null,
};
