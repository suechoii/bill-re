import { createContext, useReducer, useMemo, useContext } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const AuthContext = createContext();
const AuthDispatchContext = createContext();
const AuthState = createContext();

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuth);

  const registerForPushNotification = async (isFirst) => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (isFirst) {
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification");
        }

        //if (existingStatus !== "granted") return;

        //  deviceToken = await Notifications.getDevicePushTokenAsync();
        //  console.log(deviceToken);
        //  const getTokenOptions = {
        //    experienceId: "@suechoii/frontend",
        //    devicePushToken: deviceToken,
        //  };
        const token = await Notifications.getExpoPushTokenAsync();

        console.log(token);
        await SecureStore.setItemAsync("pushToken", token.data);
        console.log(token.data);
      }
    } else {
      alert("실기기에서 이용해주세요.");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  /**
   * 사용자의 고유 notification token을 DB에 저장하는 api
   */
  const registerNotificationToken = async (token) => {
    try {
      const user_id = await SecureStore.getItemAsync("user_id");
      const response = await axios.post(
        `${API_URL}/notification/token`,
        { token },
        { params: { user_id } }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

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
          const user_id = String(response.data.user_id);

          await SecureStore.setItemAsync("token", jwtToken);
          await SecureStore.setItemAsync("email", userEmail);
          await SecureStore.setItemAsync("payMeLink", payMeLink);
          await SecureStore.setItemAsync("userName", userName);
          await SecureStore.setItemAsync("user_id", user_id);

          await registerForPushNotification(true);
          const getToken = await SecureStore.getItemAsync("pushToken");

          console.log("getToKen", getToken);

          const postToken = await registerNotificationToken(getToken);
          console.log("posttoken", postToken);

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
