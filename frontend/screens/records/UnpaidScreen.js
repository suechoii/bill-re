import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import Checkbox from "expo-checkbox";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const UnpaidScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.recordContainer}>
          <View style={styles.header}>
            <Text style={{ fontWeight: "500", fontSize: 13, opacity: 0.8 }}>
              Total 80 HKD
            </Text>
          </View>
          <View style={styles.friendContainer}>
            <View style={styles.friendRowContainer}>
              <View style={styles.friend}>
                <Ionicons
                  name="person-circle-outline"
                  size={50}
                  color="black"
                />
                <Text style={styles.friendName}>John</Text>
              </View>
              <View style={styles.iconContainer}>
                <Checkbox
                  //   value={selected.includes(friend.friend_username)}
                  //   onValueChange={() =>
                  //     handleFriendSelection(friend.friend_username)
                  //   }
                  color="black"
                  style={{ marginRight: 13 }}
                />
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UnpaidScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  recordContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  money: {
    fontWeight: "600",
    fontSize: 13,
    opacity: 0.5,
  },
  recordBox: {
    backgroundColor: "whitesmoke",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 12,
  },
  recordBoxLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  recordBoxRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  topText: { fontWeight: "400" },
  bottomText: {
    fontSize: 10,
    marginTop: 5,
  },
  friendContainer: {
    marginTop: 15,
  },
  friendRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friend: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  friendName: { marginLeft: 7, fontWeight: "500", fontSize: 15 },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
