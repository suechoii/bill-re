import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "./auth/SignInScreen";
import AuthScreen from "./auth/AuthScreen";
import SignUpScreen from "./auth/SignUpScreen";
import VerifyScreen from "./auth/VerifyScreen";
import { useContext } from "react";
import { useAuthState, useAuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = useAuthContext();

  return (
    <View>
      <Text>Signed in!</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App({ navigation }) {
  const state = useAuthState();

  return (
    <Stack.Navigator>
      {state.isLoading ? (
        // We haven't finished checking for the token yet
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : state.userToken == null ? (
        <>
          <Stack.Screen
            name="Autentication"
            component={AuthScreen}
            options={{
              headerShown: false,
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? "pop" : "push",
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Verify"
            component={VerifyScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
