import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";

const Tab = createMaterialTopTabNavigator();

const RecordsScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});

  const { totalLent, totalBorrowed } = useSelector((state) => state.records);

  const retrieveUserInfo = async () => {
    try {
      const name = await SecureStore.getItemAsync("userName");
      const email = await SecureStore.getItemAsync("email");
      const payMe = await SecureStore.getItemAsync("payMeLink");

      setUserInfo({ name, email, payMe });
    } catch (error) {
      console.log("Error retrieving username:", error);
    }
  };

  const userData = [
    {
      title: "Username",
      data: userInfo?.name,
      to: "",
    },
    {
      title: "Email",
      data: userInfo?.email,
      to: "",
    },
    {
      title: "PayMe",
      data: userInfo?.payMe,
      to: "",
    },
    {
      title: "Password",
      data: "********",
      to: "",
    },
  ];

  useEffect(() => {
    retrieveUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Bill-Re Account</Text>
        <View style={{ flexDirection: "row" }}></View>
      </View>
      <View style={styles.accountContainer}>
        <Ionicons name="person-circle-outline" size={120} color="black" />
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Basic Information</Text>
        </View>
        {userData.map((item, idx) => (
          <View key={idx} style={styles.nameContainer}>
            <View style={styles.nameTextContainer}>
              <View>
                <Text style={styles.nameTitle}>{item.title}</Text>
                <Text style={styles.name}>{item.data}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity>
                  <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.line}></View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecordsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  topBarText: {
    fontSize: 25,
    fontWeight: "700",
  },
  accountContainer: {
    marginTop: 10,
    paddingLeft: 20,
  },
  infoContainer: {
    marginTop: 30,
  },
  infoText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  recordDetailsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  recordDetail: {
    alignItems: "flex-start",
    flex: 1,
    marginTop: 40,
    marginBottom: 30,
  },
  recordTitle: {
    fontWeight: "500",
  },
  recordTotalAmount: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 3,
  },
  nameContainer: { marginTop: 20 },
  nameTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameTitle: { fontSize: 16, fontWeight: "500" },
  name: { fontSize: 17, opacity: 0.5, marginTop: 5 },
  line: {
    borderBottomWidth: 1.5,
    borderBottomColor: "black",
    opacity: 0.1,
    marginTop: 17,
  },
  iconContainer: {
    paddingRight: 25,
  },
});
