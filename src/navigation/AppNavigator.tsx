import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AppTabs from "./AppTabs";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import { Colors } from "../styles/styles";

// Define the parameter list for the root stack navigator
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  Auth: undefined;
};

// Create a stack navigator with the defined parameter list
const Stack = createStackNavigator<RootStackParamList>();

// Define a stack navigator for authentication screens
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        cardStyle: { backgroundColor: Colors.primary600 },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

// Main navigator component that switches between authentication and main app based on the token
const AppNavigator: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
