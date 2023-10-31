import React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Checkbox from "expo-checkbox";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedFriends,
  createRecord,
} from "../../redux/records/recordsSlice";

const SettlePaymentScreen = ({ navigation }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [friendAmounts, setFriendAmounts] = useState({});
  const [selectedInput, setSelectedInput] = useState(null);

  const dispatch = useDispatch();
  const { selectedFriends } = useSelector((state) => state.records);

  useEffect(() => {
    setIsButtonDisabled(
      !(Object.keys(friendAmounts).length === selectedFriends.length)
    );
  }, [friendAmounts]);

  const handleFocus = (friendUsername) => {
    setSelectedInput(friendUsername);
  };

  const handleBlur = () => {
    setSelectedInput(null);
  };

  const inputStyle = (friendUsername) => [
    styles.inputForm,
    selectedInput === friendUsername ? styles.inputFormFocused : null,
  ];

  const handlBack = () => {
    setFriendAmounts({});
    setTotalAmount(0);
    navigation.navigate("SelectFriends");
  };

  const handleAmountChange = (amount) => {
    const updatedFriendAmounts = {
      ...friendAmounts,
      [selectedInput]: amount,
    };

    if (amount === "") {
      delete updatedFriendAmounts[selectedInput];
    }

    setFriendAmounts(updatedFriendAmounts);

    const total = Object.values(updatedFriendAmounts)
      .filter((value) => value !== "")
      .reduce((acc, value) => acc + parseFloat(value), 0);

    const roundedTotal = total.toFixed(2);
    setTotalAmount(roundedTotal);
  };

  const handleConfirm = async () => {
    await dispatch(createRecord(friendAmounts));
    dispatch(setSelectedFriends([]));
    setFriendAmounts({});
    setTotalAmount(0);

    console.log("Created record: ", friendAmounts);
    navigation.navigate("Records");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handlBack} style={{ flex: 1 }}>
          <Ionicons name="chevron-back-sharp" size={34} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={styles.topBarText}>Settle Payment</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>{totalAmount} HKD</Text>
      </View>
      <ScrollView>
        <View style={styles.friendContainer}>
          {selectedFriends.map((friend, idx) => (
            <View key={idx} style={styles.friendRowContainer}>
              <View style={styles.friend}>
                <Ionicons
                  name="person-circle-outline"
                  size={50}
                  color="black"
                />
                <Text style={styles.friendName}>{friend}</Text>
              </View>
              <View>
                <TextInput
                  placeholder="Enter Amount"
                  value={friendAmounts[friend] || ""}
                  onChangeText={handleAmountChange}
                  style={inputStyle(friend)}
                  onFocus={() => handleFocus(friend)}
                  onBlur={handleBlur}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity
          style={[
            styles.button,
            { opacity: isButtonDisabled ? 0.5 : 1 }, // Set opacity based on button disabled state
          ]}
          onPress={handleConfirm}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettlePaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
  },
  topBarText: {
    fontSize: 19,
    fontWeight: "600",
  },
  detailContainer: {
    paddingHorizontal: 5,
    marginTop: 40,
  },
  detailText: {
    fontSize: 40,
    fontWeight: "600",
  },
  friendContainer: {
    marginTop: 40,
    paddingHorizontal: 5,
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
  inputForm: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    fontSize: 16,
    paddingVertical: 8,
    color: "#000",
  },
  inputFormFocused: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginTop: 30,
    marginBottom: 10,
  },
});
