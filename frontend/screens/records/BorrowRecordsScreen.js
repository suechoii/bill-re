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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getBorrowRecord,
  setSelectedBorrowRecord,
} from "../../redux/records/recordsSlice";
import { useSelector, useDispatch } from "react-redux";
import { BlurView } from "expo-blur";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const BorrowRecordsScreen = () => {
  const dispatch = useDispatch();
  const {
    completedBorrowRecord,
    unCompletedBorrowRecord,
    totalUnCompletedBorrowRecord,
    totalCompletedBorrowRecord,
    borrowReceivedAmount,
    borrowRemainingAmount,
  } = useSelector((state) => state.records);

  useEffect(() => {
    dispatch(getBorrowRecord());
  }, []);

  const handleRecordTouch = (record) => {
    dispatch(setSelectedBorrowRecord(record));
    navigation.navigate("BorrowRecordDetail");
    console.log(record);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.recordContainer}>
          <View>
            <View style={styles.header}>
              <Text style={{ fontWeight: "600", fontSize: 13 }}>
                In Progress{" "}
                <Text style={{ color: "red" }}>
                  {totalUnCompletedBorrowRecord}
                </Text>
              </Text>
              <Text style={styles.money}>{borrowRemainingAmount} HKD</Text>
            </View>
            {unCompletedBorrowRecord.map((item) => (
              <TouchableOpacity
                onPress={() => handleRecordTouch(item)}
                key={item.borrow_id}
              >
                <View style={styles.recordBox}>
                  <View style={styles.recordBoxLeft}>
                    <Text style={styles.topText}>{item.username}</Text>
                    <Text style={styles.bottomText}>waiting for payment</Text>
                  </View>
                  <View style={styles.recordBoxRight}>
                    <Text style={styles.topText}>
                      {item.friends[0].amount} HKD
                    </Text>
                    <Text style={styles.bottomText}>{item.created_at}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <View style={{ ...styles.header, marginTop: 35 }}>
              <Text style={{ fontWeight: "600", fontSize: 13 }}>
                Completed{" "}
                <Text style={{ color: "blue" }}>
                  {totalCompletedBorrowRecord}
                </Text>
              </Text>
              <Text style={styles.money}>{borrowReceivedAmount} HKD</Text>
            </View>
            {completedBorrowRecord.map((item) => (
              <TouchableOpacity
                onPress={() => handleRecordTouch(item)}
                key={item.borrow_id}
              >
                <View style={styles.recordBox}>
                  <View style={styles.recordBoxLeft}>
                    <Text style={styles.topText}>{item.username}</Text>
                    <Text style={styles.bottomText}>confirmed</Text>
                  </View>
                  <View style={styles.recordBoxRight}>
                    <Text style={styles.topText}>
                      {item.friends[0].amount} HKD
                    </Text>
                    <Text style={styles.bottomText}>{item.created_at}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BorrowRecordsScreen;

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
  scrollContainer: {
    paddingHorizontal: 20,
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
});
