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
import { useDispatch, useSelector } from "react-redux";
import {
  updateLentRecord,
  getLentRecord,
  setSelectedLentRecord,
} from "../../redux/records/recordsSlice";
import { notifyBorrower } from "../../redux/friends/friendsSlice";

const Tab = createMaterialTopTabNavigator();

const UnpaidScreen = ({ navigation }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();
  const { selectedLentRecord } = useSelector((state) => state.records);

  useEffect(() => {
    setIsButtonDisabled(!(selected.length !== 0));
  }, [selected]);

  const handleFriendSelection = (friendRecordId) => {
    if (selected.includes(friendRecordId)) {
      setSelected(selected.filter((id) => id !== friendRecordId));
    } else {
      setSelected([...selected, friendRecordId]);
    }
  };

  const handleConfirmPayment = async () => {
    await dispatch(
      updateLentRecord({
        recordIds: selected,
        borrowId: selectedLentRecord.borrow_id,
      })
    );
    await dispatch(getLentRecord());

    console.log("Selected friends for payment", selected);
    setSelected([]);
  };

  const handleNotify = async (friendRecordId) => {
    await dispatch(notifyBorrower(friendRecordId));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.recordContainer}>
          <View style={styles.header}>
            <Text style={{ fontWeight: "500", fontSize: 13, opacity: 0.8 }}>
              Unpaid
            </Text>
          </View>
          <View style={styles.friendContainer}>
            {selectedLentRecord.friends &&
              Object.values(selectedLentRecord.friends).map(
                (friend) =>
                  friend.status === false && (
                    <View
                      style={styles.friendRowContainer}
                      key={friend.record_id}
                    >
                      <View style={styles.friend}>
                        <Ionicons
                          name="person-circle-outline"
                          size={50}
                          color="black"
                        />
                        <Text style={styles.friendName}>
                          {friend.friend_username}
                        </Text>
                      </View>
                      <View style={styles.iconContainer}>
                        <Checkbox
                          value={selected.includes(friend.record_id)}
                          onValueChange={() =>
                            handleFriendSelection(friend.record_id)
                          }
                          color="black"
                          style={{ marginRight: 13 }}
                        />
                        <TouchableOpacity
                          onPress={() => handleNotify(friend.record_id)}
                        >
                          <Ionicons
                            name="notifications-outline"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
              )}
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 12 }}>
        <TouchableOpacity
          style={[
            styles.button,
            { opacity: isButtonDisabled ? 0.5 : 1 }, // Set opacity based on button disabled state
          ]}
          onPress={handleConfirmPayment}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
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
  button: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
});
