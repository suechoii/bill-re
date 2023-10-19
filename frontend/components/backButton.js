import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";

const backButton = ({ navigation }) => {
  return (
    <View style={styles.backButtonBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <SimpleLineIcons
          name="arrow-left"
          size={15}
          color="black"
          style={{ fontWeight: "bold" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default backButton;

const styles = StyleSheet.create({
  backButtonBar: {
    flexDirection: "row",
  },
  backButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
