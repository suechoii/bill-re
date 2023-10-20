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
import InputForm from "../../components/inpuForm";
import BackButton from "../../components/backButton";
import { useDispatch, useSelector } from "react-redux";
import { setPassword, resetPassword } from "../../redux/auth/resetPwdSlice";

const EmailScreen = ({ navigation }) => {
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const dispatch = useDispatch();
  const { email, password } = useSelector((state) => state.resetPwd);

  useEffect(() => {
    setIsButtonDisabled(!password);
  }, [password]);

  const handleScreenTouch = () => {
    Keyboard.dismiss();
  };

  const handlePasswordChange = (text) => {
    dispatch(setPassword(text));
  };

  const handleResetPassword = async () => {
    const response = await dispatch(
      resetPassword({ email, new_password: password })
    );
    if (response.payload.status === "Successfully updated password") {
      navigation.navigate("SignIn");
      setErrorMsgVisible(false);
    } else {
      setErrorMsgVisible(true);
      if (response.payload[0].msg) {
        setErrorMessage(response.payload[0].msg);
      } else {
        setErrorMessage(response.payload);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <View style={styles.container}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <BackButton navigation={navigation} />
          <View style={styles.logo}>
            <Text style={styles.logoText}>Please enter your new password.</Text>
            <Text
              style={[
                styles.logoText,
                { fontSize: 15, marginTop: 10, opacity: 0.5 },
              ]}
            >
              Needs to be at least 6 characters.
            </Text>
          </View>
          <View style={styles.form}>
            <View>
              <InputForm
                title={"Password"}
                value={password}
                placeholder={"Password"}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
              />
              {errorMsgVisible ? (
                <Text style={styles.errorMsg}>{errorMessage}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={[
                styles.signInButton,
                { opacity: isButtonDisabled ? 0.5 : 1 },
              ]}
              onPress={handleResetPassword}
            >
              <Text style={styles.signInButtonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  logo: {
    flex: 1.5,
    justifyContent: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "400",
  },
  form: {
    flex: 5,
    justifyContent: "space-between",
  },
  signInText: {
    fontSize: 20,
    fontWeight: "400",
  },
  errorMsg: {
    opacity: 0.5,
    marginTop: 8,
  },
  bottom: {
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  signInButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
});
