import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import FlatButton from "./FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../styles/styles";
import { RootStackParamList } from "../../navigation/AppNavigator";

interface AuthContentProps {
  isLogin: boolean;
  onAuthenticate: (credentials: { email: string; password: string }) => void;
}
/**
 * AuthContent Component
 * Handles authentication (login/signup) and form submission.
 */
const AuthContent: React.FC<AuthContentProps> = ({
  isLogin,
  onAuthenticate,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  /**
   * Switches between login and signup screens
   */
  const switchAuthModeHandler = () => {
    if (isLogin) {
      navigation.navigate("SignUp");
    } else {
      navigation.navigate("Login");
    }
  };

  /**
   * Submits the authentication form
   * @param credentials - User credentials including email and password
   */
  const submitHandler = (credentials: {
    email: string;
    confirmEmail?: string;
    password: string;
    confirmPassword?: string;
  }) => {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 5;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      if (!passwordIsValid) {
        Alert.alert("The password must contain at least 6 characters!");
      } else {
        Alert.alert("Invalid input", "Please check your entered credentials.");
      }
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  };

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Create a new user" : "Log in instead"}
        </FlatButton>
      </View>
    </View>
  );
};

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
