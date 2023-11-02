import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "./auth/SignInScreen";
import AuthScreen from "./auth/AuthScreen";
import SignUpScreen from "./auth/SignUpScreen";
import VerifyScreen from "./auth/VerifyScreen";
import EmailScreen from "./auth/EmailScreen";
import PwdVerifyScreen from "./auth/PwdVerifyScreen";
import ResetPwdScreen from "./auth/ResetPwdScreen";
import FriendsScreen from "./FriendsScreen";
import RecordsScreen from "./records/RecordsScreen";
import SettingsScreen from "./SettingsScreen";
import AddFriendScreen from "./AddFriendScreen";
import SelectFriendsScreen from "./records/SelectFriendsScreen";
import SettlePaymentScreen from "./records/SettlePaymentScreen";
import LentRecordDetailScreen from "./records/LentRecordDetailScreen";
import { useContext } from "react";
import { useAuthState, useAuthContext } from "../context/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
    <>
      {state.isLoading ? (
        // We haven't finished checking for the token yet
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : state.userToken == null ? (
        <Stack.Navigator>
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
          <Stack.Screen
            name="Email"
            component={EmailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PwdVerify"
            component={PwdVerifyScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ResetPwd"
            component={ResetPwdScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          initialRouteName="Friends"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              if (rn === "Friends") {
                iconName = focused ? "person" : "person-outline";
              } else if (rn === "Records") {
                iconName = focused ? "list" : "list-outline";
              } else if (rn === "Settings") {
                iconName = focused ? "settings" : "settings-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarButton: [
              "AddFriend",
              "SelectFriends",
              "SettlePayment",
              "LentRecordDetail",
            ].includes(route.name)
              ? () => {
                  return null;
                }
              : undefined,

            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "grey",
            // tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
            tabBarStyle: {
              borderTopWidth: 2,
              padding: 5,
            },
          })}
        >
          <Tab.Screen
            name="Friends"
            component={FriendsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Records"
            component={RecordsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="AddFriend"
            component={AddFriendScreen}
            options={{
              headerShown: false,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tab.Screen
            name="SelectFriends"
            component={SelectFriendsScreen}
            options={{
              headerShown: false,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tab.Screen
            name="SettlePayment"
            component={SettlePaymentScreen}
            options={{
              headerShown: false,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tab.Screen
            name="LentRecordDetail"
            component={LentRecordDetailScreen}
            options={{
              headerShown: false,
              tabBarStyle: { display: "none" },
            }}
          />
        </Tab.Navigator>
      )}
    </>
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
