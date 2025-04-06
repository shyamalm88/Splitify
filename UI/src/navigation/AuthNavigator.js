import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  WalkthroughScreen,
  WelcomeScreen,
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  OTPVerificationScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
