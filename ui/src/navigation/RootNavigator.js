import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth Screens
import SplashScreen from "../screens/auth/SplashScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import OtpVerificationScreen from "../screens/auth/OTPVerificationScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import WalkthroughScreen from "../screens/walkthrough/WalkthroughScreen";

// Import AppNavigator for main navigation flow
import AppNavigator from "./AppNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authState, setAuthState] = useState(null);
  const [hasCompletedWalkthrough, setHasCompletedWalkthrough] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      setAuthState(authenticated);

      try {
        const walkthroughCompleted = await AsyncStorage.getItem(
          "walkthrough_completed"
        );
        setHasCompletedWalkthrough(walkthroughCompleted === "true");
      } catch (error) {
        console.error("Error checking walkthrough status:", error);
        setHasCompletedWalkthrough(false);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  if (loading || hasCompletedWalkthrough === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FEBA17" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {authState ? (
        <Stack.Screen
          name="Main"
          component={AppNavigator}
          options={{
            gestureEnabled: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          {!hasCompletedWalkthrough && (
            <Stack.Screen
              name="Walkthrough"
              component={WalkthroughScreen}
              options={{
                gestureEnabled: false,
              }}
            />
          )}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="OtpVerification"
            component={OtpVerificationScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              gestureEnabled: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
