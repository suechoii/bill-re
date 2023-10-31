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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllFriends } from "../../redux/friends/friendsSlice";
import { setSelectedFriends } from "../../redux/records/recordsSlice";

const SelectFriendsScreen = ({ navigation }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(getAllFriends());
  }, []);

  useEffect(() => {
    setIsButtonDisabled(!(selected.length !== 0));
  }, [selected]);

  const handleClose = () => {
    setSelected([]);
    navigation.navigate("Records");
  };

  const handleFriendSelection = (friendUsername) => {
    if (selected.includes(friendUsername)) {
      setSelected(selected.filter((name) => name !== friendUsername));
    } else {
      setSelected([...selected, friendUsername]);
    }
  };

  const handleSettlePayment = () => {
    dispatch(setSelectedFriends(selected));
    console.log("Selected friends for payment", selected);
    navigation.navigate("SettlePayment");
    setSelected([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleClose} style={{ flex: 1 }}>
          <Ionicons name="close" size={34} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>
          Please confirm the friend {"\n"}you wish to settle the payment with.
        </Text>
      </View>
      <ScrollView>
        <View style={styles.friendContainer}>
          {friends.map((friend, idx) => (
            <View key={idx} style={styles.friendRowContainer}>
              <View style={styles.friend}>
                <Ionicons
                  name="person-circle-outline"
                  size={50}
                  color="black"
                />
                <Text style={styles.friendName}>{friend.friend_username}</Text>
              </View>
              <View>
                <Checkbox
                  value={selected.includes(friend.friend_username)}
                  onValueChange={() =>
                    handleFriendSelection(friend.friend_username)
                  }
                  color="black"
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
          onPress={handleSettlePayment}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Settle Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectFriendsScreen;

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
    fontSize: 18,
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
});
