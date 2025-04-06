import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

// Create AuthContext to manage authentication state
export const AuthContext = createContext();

const RootNavigator = () => {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to track if the app is loading
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication state
  const checkAuthState = async () => {
    // In a real app, you would check if the user is logged in
    // For example, by checking if there's a token in AsyncStorage

    // Simulate a delay
    setTimeout(() => {
      // For demo, we'll default to not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 1000);
  };

  // For demo purposes, let's simulate a login check
  useEffect(() => {
    checkAuthState();
  }, []);

  // Authentication context values
  const authContext = {
    signIn: () => {
      setIsAuthenticated(true);
    },
    signOut: () => {
      setIsAuthenticated(false);
    },
    checkAuthState: checkAuthState,
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : !isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="App" component={AppNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default RootNavigator;
