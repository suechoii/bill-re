import React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
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
import CloseButton from "../../components/closeButton";
import InputForm from "../../components/inpuForm";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setFriendUserName,
  searchFriend,
  addFriend,
  addNewFriend,
  getAllFriends,
} from "../../redux/friends/friendsSlice";

const SelectFriendsScreen = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [isFriend, setIsFriend] = useState(false);
  const [friendId, setFriendId] = useState(null);

  const dispatch = useDispatch();
  const { friendUserName } = useSelector((state) => state.friends);

  const handleScreenTouch = () => {
    Keyboard.dismiss();
  };

  const handleFriendUserNameChange = (text) => {
    dispatch(setFriendUserName(text));
  };

  const handleSubmit = async () => {
    const response = await dispatch(searchFriend(friendUserName));
    if (response.meta.requestStatus === "rejected") {
      setErrorMsg(response.payload);
      setName("");
      setIsFriend(false);
      setFriendId(null);
    } else {
      setName(response.payload.username);
      setFriendId(response.payload.id);
      if (response.payload.msg === "") {
        setIsFriend(false);
      } else {
        setIsFriend(true);
      }
      setErrorMsg("");
    }
  };

  const handleAddFriend = async () => {
    const response = await dispatch(
      addFriend({ friend_id: friendId, friend_username: name })
    );
    console.log(response.payload);
    await dispatch(addNewFriend(response.payload));
    await dispatch(getAllFriends());
    await dispatch(setFriendUserName(""));
    setIsFriend(false);
    setFriendId(null);
    setName("");
    navigation.navigate("Friends");
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ flex: "1" }}
          >
            <Ionicons name="close" size={34} color="black" />
          </TouchableOpacity>
          <View>
            <Text style={styles.topBarText}>Add By ID</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <View
          style={{
            paddingHorizontal: 5,
          }}
        >
          <InputForm
            title=""
            value={friendUserName}
            placeholder="Friend Bill-Re ID"
            onChangeText={handleFriendUserNameChange}
            secureTextEntry={false}
            onSubmit={handleSubmit}
          />
        </View>
        {name && (
          <View style={styles.friendContainer}>
            <Ionicons name="person-circle-outline" size={95} color="black" />
            <Text style={{ fontSize: 18 }}>{name}</Text>
            {isFriend ? (
              <Text style={styles.isFriendText}>Already Friend.</Text>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
                <Text style={styles.buttonText}>Add Friend</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  friendContainer: {
    backgroundColor: "#F8F8F8",
    marginTop: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  isFriendText: {
    fontSize: 15,
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  errorContainer: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    opacity: 0.5,
    fontSize: 15,
  },
});
