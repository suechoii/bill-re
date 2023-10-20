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
} from "react-native";
import { useAuthContext } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setPassword, setUsername } from "../../redux/auth/signInSlice";
import InputForm from "../../components/inpuForm";
import BackButton from "../../components/backButton";

export default SignIn = ({ navigation }) => {
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const dispatch = useDispatch();
  const { username, password } = useSelector((state) => state.signIn);
  const { signIn } = useAuthContext();

  useEffect(() => {
    setIsButtonDisabled(!(username && password));
  }, [username, password]);

  const handleScreenTouch = () => {
    Keyboard.dismiss();
  };

  const handleUsernameChange = (text) => {
    dispatch(setUsername(text));
  };

  const handlePasswordChange = (text) => {
    dispatch(setPassword(text));
  };

  const handleSignIn = async () => {
    const msg = await signIn({ username, password });
    if (msg !== "True") {
      setErrorMsgVisible(true);
      setErrorMessage(msg);
    } else {
      dispatch(setUsername(""));
      dispatch(setPassword(""));
      setErrorMsgVisible(false);
    }
  };

  const signInData = [
    {
      id: 1,
      title: "Username",
      placeholder: "Username",
      value: username,
      onChangeText: handleUsernameChange,
      secureTextEntry: false,
    },
    {
      id: 2,
      title: "Password",
      placeholder: "Password",
      value: password,
      onChangeText: handlePasswordChange,
      secureTextEntry: true,
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <StatusBar style="auto" />

          <BackButton navigation={navigation} />
          <View style={styles.logo}>
            <Text style={styles.logoText}>Bill-Re</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.signInText}>Sign In</Text>
            {signInData.map((item) => (
              <InputForm
                key={item.id}
                title={item.title}
                value={item.value}
                placeholder={item.placeholder}
                onChangeText={item.onChangeText}
                secureTextEntry={item.secureTextEntry}
              />
            ))}
            {errorMsgVisible ? (
              <Text style={styles.errorMsg}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity
              style={[
                styles.signInButton,
                { opacity: isButtonDisabled ? 0.5 : 1 }, // Set opacity based on button disabled state
              ]}
              onPress={handleSignIn}
              disabled={isButtonDisabled}
            >
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
            <View style={styles.bottom}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setUsername(""));
                  dispatch(setPassword(""));
                  navigation.navigate("Email");
                }}
              >
                <Text style={{ color: "#CFCFCF" }}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setUsername(""));
                  dispatch(setPassword(""));
                  navigation.navigate("SignUp");
                }}
              >
                <Text style={{ color: "#CFCFCF" }}>
                  Don't have an account?
                  <Text style={{ color: "black" }}> Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  logo: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 50,
    fontWeight: "600",
  },
  form: {
    flex: 5,
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
