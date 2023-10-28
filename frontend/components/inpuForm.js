import React, { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";

const InputForm = ({
  title,
  placeholder,
  value,
  onChangeText,
  onSubmit,
  secureTextEntry,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputStyle = [
    styles.inputForm,
    isFocused ? styles.inputFormFocused : null,
  ];

  return (
    <>
      <Text style={styles.inputTitle}>{title}</Text>
      {title === "" ? (
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
        />
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </>
  );
};

export default InputForm;

const styles = StyleSheet.create({
  inputForm: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    fontSize: 16,
    paddingVertical: 8,
    color: "#000",
  },
  inputFormFocused: {
    borderBottomColor: "black", // Change the focus color here
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "400",
    marginTop: 30,
    marginBottom: 10,
  },
});
