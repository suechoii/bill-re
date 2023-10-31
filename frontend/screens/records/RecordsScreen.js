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
import LentRecordsScreen from "./LentRecordsScreen";
import BorrowRecordsScreen from "./BorrowRecordsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const RecordsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Records</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SelectFriends")}
          >
            <Ionicons name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.recordDetailsContainer}>
        <View style={styles.recordDetail}>
          <Text style={styles.recordTitle}>Bond Lent</Text>
          <Text style={styles.recordTotalAmount}>8,000 HKD</Text>
        </View>
        <View style={styles.recordDetail}>
          <Text style={styles.recordTitle}>Bond Borrowed</Text>
          <Text style={styles.recordTotalAmount}>5,000 HKD</Text>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "black",
          tabBarIndicatorStyle: { backgroundColor: "black" },
        })}
      >
        <Tab.Screen name="Lent" component={LentRecordsScreen} />
        <Tab.Screen name="Borrow" component={BorrowRecordsScreen} />
      </Tab.Navigator>
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
});
