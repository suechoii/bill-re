import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setFriendUserName,
  getAllFriends,
} from "../redux/friends/friendsSlice";

const closeButton = ({ setName, setIsFriend, setFriendId, navigation }) => {
  const dispatch = useDispatch();

  const handleClose = async () => {
    setName("");
    setIsFriend(false);
    setFriendId(null);
    await dispatch(setFriendUserName(""));
    await dispatch(getAllFriends());

    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleClose} style={{ flex: "1" }}>
      <Ionicons name="close" size={34} color="black" />
    </TouchableOpacity>
  );
};

export default closeButton;

const styles = StyleSheet.create({});
