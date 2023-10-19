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
import {
  setEmail,
  setPayMeLink,
  setPassword,
  setUsername,
  registerAndSendCode,
  verifyCode,
} from "../../redux/auth/signUpSlice";
import { Snackbar } from "react-native-paper";

const SignUpScreen = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const { email, username, password, payme_link } = useSelector(
    (state) => state.signUp
  );

  useEffect(() => {
    setIsButtonDisabled(!(username && password));
  }, [username, password, email, payme_link]);

  const handleScreenTouch = () => {
    Keyboard.dismiss();
  };

  const handleEmailChange = (text) => {
    dispatch(setEmail(text));
  };

  const handleUsernameChange = (text) => {
    dispatch(setUsername(text));
  };

  const handlePasswordChange = (text) => {
    dispatch(setPassword(text));
  };

  const handlePayMeLinkChange = (text) => {
    dispatch(setPayMeLink(text));
  };

  const handleSendVerificationCode = async () => {
    const response = await dispatch(
      registerAndSendCode({ email, username, password, payme_link })
    );
    if (response.payload.status === "email successfully sent") {
      navigation.navigate("Verify");
    } else if (response.error) {
      setSnackbarVisible(true);
      setErrorMessage(response.payload);
    }
  };

  const signUpData = [
    {
      id: 1,
      title: "Email",
      placeholder: "example@gmail.com",
      value: email,
      onChangeText: handleEmailChange,
      secureTextEntry: false,
    },
    {
      id: 2,
      title: "Username",
      placeholder: "Username",
      value: username,
      onChangeText: handleUsernameChange,
      secureTextEntry: false,
    },
    {
      id: 3,
      title: "Password",
      placeholder: "Password",
      value: password,
      onChangeText: handlePasswordChange,
      secureTextEntry: true,
    },
    {
      id: 4,
      title: "Payme Link",
      placeholder: "https://payme.hsbc/username",
      value: payme_link,
      onChangeText: handlePayMeLinkChange,
      secureTextEntry: false,
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={230}
      >
        <View style={styles.container}>
          <StatusBar style="auto" />
          <BackButton navigation={navigation} />
          <View style={styles.logo}>
            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={Snackbar.LENGTH_LONG}
              wrapperStyle={{ top: 0 }}
              action={{
                label: "Close",
                onPress: () => setSnackbarVisible(false),
              }}
            >
              {errorMessage}
            </Snackbar>
          </View>
          <View style={styles.form}>
            <Text style={styles.signInText}>Create Account</Text>
            {signUpData.map((item) => (
              <InputForm
                key={item.id}
                title={item.title}
                value={item.value}
                placeholder={item.placeholder}
                onChangeText={item.onChangeText}
                secureTextEntry={item.secureTextEntry}
              />
            ))}
            <TouchableOpacity
              style={[
                styles.signInButton,
                { opacity: isButtonDisabled ? 0.5 : 1 },
              ]}
              onPress={handleSendVerificationCode}
              disabled={isButtonDisabled}
            >
              <Text style={styles.signInButtonText}>
                Send Verification Code
              </Text>
            </TouchableOpacity>
            <View style={styles.bottom}>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text style={{ color: "#CFCFCF" }}>
                  Already have an account?
                  <Text style={{ color: "black" }}> Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  logo: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "600",
  },
  form: {
    flex: 5,
  },
  signInText: {
    fontSize: 20,
    fontWeight: "400",
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
