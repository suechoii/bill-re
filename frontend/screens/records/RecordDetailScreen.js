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
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UnpaidScreen from "./UnpaidScreen";
import PaidScreen from "./PaidScreen";
import BorrowRecordsScreen from "./BorrowRecordsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const RecordDetailScreen = ({ navigation }) => {
  const handlBack = () => {
    navigation.navigate("Records");
  };

  const handleOpenApp = () => {
    Linking.openURL("https://payme.hsbc/suechoii").catch((err) => {
      console.log("Error opening app:", err);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handlBack} style={{ flex: 1 }}>
          <Ionicons name="chevron-back-sharp" size={34} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.recordDetailsContainer}>
        <View style={styles.recordDetail}>
          <Text style={styles.recordTitle}>John and 2 more</Text>
          <Text style={styles.recordTotalAmount}>8,000 HKD</Text>
          <Text style={styles.recordDate}>
            Request Date 2023.10.31(Tue) 18:12
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleOpenApp}>
          <Text style={styles.buttonText}>Open PayMe</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "black",
          tabBarIndicatorStyle: { backgroundColor: "black" },
        })}
      >
        <Tab.Screen name="UnPaid" component={UnpaidScreen} />
        <Tab.Screen name="Paid" component={PaidScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default RecordDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 10,
  },
  topBarText: {
    fontSize: 25,
    fontWeight: "700",
  },
  recordDetailsContainer: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginTop: 20,
  },
  recordDetail: {
    alignItems: "flex-start",
    flex: 1,
    marginBottom: 30,
  },
  recordTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  recordTotalAmount: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 3,
  },
  recordDate: {
    fontSize: 12,
    marginTop: 3,
    opacity: 0.4,
  },
  buttonContainer: {
    paddingHorizontal: 25,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    opacity: 0.6,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
  },
});
