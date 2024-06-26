import React from "react";
import AuthContent from "../components/Auth/AuthContent";
import { useDispatch } from "react-redux";
import { createUser } from "../utils/authService";
import { setAuth } from "../store/authSlice";
import { Alert } from "react-native";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  /**
   * Handles user authentication
   * @param credentials
   */
  const handleAuthenticate = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const { email, password } = credentials;
      const { token, userId } = await createUser(email, password);
      dispatch(setAuth({ token, userId }));
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  return <AuthContent isLogin={false} onAuthenticate={handleAuthenticate} />;
};

export default Signup;
