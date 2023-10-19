import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill-Re</Text>
      </View>
      <View style={styles.auth}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            marginTop: 15,
            backgroundColor: "#121212",
          }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 80,
    fontWeight: "600",
    color: "white",
  },
  auth: {
    flex: 1,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
