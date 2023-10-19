import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";

const inpuForm = ({
  title,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}) => {
  return (
    <>
      <Text style={styles.inputTitle}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.inputForm}
      />
    </>
  );
};

export default inpuForm;

const styles = StyleSheet.create({
  inputForm: {
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    fontSize: 16,
    paddingVertical: 8,
    color: "#000",
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginTop: 30,
    marginBottom: 10,
  },
});
