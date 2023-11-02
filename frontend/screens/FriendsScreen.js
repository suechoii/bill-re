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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { getAllFriends } from "../redux/friends/friendsSlice";

const FriendsScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const { friends, loading, error, numberOfFriends } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFriends());
    retrieveUserName();
  }, [dispatch, retrieveUserName, numberOfFriends]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const retrieveUserName = async () => {
    try {
      const name = await SecureStore.getItemAsync("userName");
      setUserName(name);
    } catch (error) {
      console.log("Error retrieving username:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Friends</Text>
        <View style={{ flexDirection: "row" }}>
          {/* <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.navigate("AddFriend")}>
            <Ionicons name="person-add-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.user}>
          <Ionicons name="person-circle-outline" size={70} color="black" />
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.line}></View>
        <View style={{ marginTop: 10, marginBottom: 7 }}>
          <Text style={{ opacity: 0.5, fontWeight: "600" }}>
            Friends {numberOfFriends}
          </Text>
        </View>
        <>
          {friends.map((friend, idx) => (
            <View key={idx} style={styles.friend}>
              <Ionicons name="person-circle-outline" size={50} color="black" />
              <Text style={styles.friendName}>{friend.friend_username}</Text>
            </View>
          ))}
        </>
      </ScrollView>
    </View>
  );
};

export default FriendsScreen;

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
  user: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  userName: { marginLeft: 7, fontWeight: "600", fontSize: 15 },
  friend: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  friendName: { marginLeft: 7, fontWeight: "500", fontSize: 15 },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    opacity: 0.2,
  },
});
