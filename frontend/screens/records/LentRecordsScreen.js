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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  getLentRecord,
  setSelectedLentRecord,
} from "../../redux/records/recordsSlice";

const Tab = createMaterialTopTabNavigator();

const LentRecordsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    completedLentRecord,
    unCompletedLentRecord,
    totalUnCompletedLentRecord,
    totalCompletedLentRecord,
    lentReceivedAmount,
    lentRemainingAmount,
  } = useSelector((state) => state.records);

  useEffect(() => {
    dispatch(getLentRecord());
  }, []);

  const handleRecordTouch = (record) => {
    dispatch(setSelectedLentRecord(record));
    navigation.navigate("LentRecordDetail");
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
                  {totalUnCompletedLentRecord}
                </Text>
              </Text>
              <Text style={styles.money}>{lentRemainingAmount} HKD</Text>
            </View>
            {unCompletedLentRecord.map((item) => (
              <TouchableOpacity
                onPress={() => handleRecordTouch(item)}
                key={item.borrow_id}
              >
                <View style={styles.recordBox}>
                  <View style={styles.recordBoxLeft}>
                    <Text style={styles.topText}>
                      {item.friends[0].friend_username}
                    </Text>
                    <Text style={styles.bottomText}>
                      and {item.friends.length} more
                    </Text>
                  </View>
                  <View style={styles.recordBoxRight}>
                    <Text style={styles.topText}>{item.total_amount} HKD</Text>
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
                  {totalCompletedLentRecord}
                </Text>
              </Text>
              <Text style={styles.money}>{lentReceivedAmount} HKD</Text>
            </View>
            {completedLentRecord.map((item) => (
              <TouchableOpacity
                onPress={() => handleRecordTouch(item)}
                key={item.borrow_id}
              >
                <View style={styles.recordBox}>
                  <View style={styles.recordBoxLeft}>
                    <Text style={styles.topText}>
                      {item.friends[0].friend_username}
                    </Text>
                    <Text style={styles.bottomText}>
                      and {item.friends.length} more
                    </Text>
                  </View>
                  <View style={styles.recordBoxRight}>
                    <Text style={styles.topText}>{item.total_amount} HKD</Text>
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

export default LentRecordsScreen;

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
