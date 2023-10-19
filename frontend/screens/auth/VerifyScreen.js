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
import { useDispatch, useSelector } from "react-redux";
import InputForm from "../../components/inpuForm";
import BackButton from "../../components/backButton";
import { setCode, verifyCode } from "../../redux/auth/signUpSlice";
import { Snackbar } from "react-native-paper";

export default Verify = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const { code, email } = useSelector((state) => state.signUp);

  useEffect(() => {
    setIsButtonDisabled(!code);
  }, [code]);

  const handleScreenTouch = () => {
    Keyboard.dismiss();
  };

  const handleCodeChange = (text) => {
    dispatch(setCode(text));
  };

  const handleVerifyCode = async () => {
    const response = await dispatch(verifyCode({ email, code }));
    console.log(response);
    if (response.payload.status === "code successfully verified") {
      navigation.navigate("SignIn");
    } else if (response.error) {
      setSnackbarVisible(true);
      setErrorMessage(response.payload);
    }
  };

  const verifyData = [
    {
      id: 1,
      title: "Enter your Verification Code",
      placeholder: "verification code",
      value: code,
      onChangeText: handleCodeChange,
      secureTextEntry: false,
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={handleScreenTouch}>
      <View style={styles.container}>
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
            <View>
              {verifyData.map((item) => (
                <InputForm
                  key={item.id}
                  title={item.title}
                  value={item.value}
                  placeholder={item.placeholder}
                  onChangeText={item.onChangeText}
                  secureTextEntry={item.secureTextEntry}
                />
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.signInButton,
                { opacity: isButtonDisabled ? 0.5 : 1 },
              ]}
              onPress={handleVerifyCode}
            >
              <Text style={styles.signInButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 50,
    fontWeight: "600",
  },
  form: {
    flex: 5,
    justifyContent: "space-between",
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
