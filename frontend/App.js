import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthProvider } from "./context/AuthContext";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Home from "./screens/HomeScreen";
import { Snackbar } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";

import * as Notifications from 'expo-notifications'

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <Home />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </Provider>
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
