import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import { NotificationProvider } from "./src/context/NotificationContext";
import RootNavigator from "./src/navigation/RootNavigator";
import {
  StatusBar,
  LogBox,
  View,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { navigationRef } from "./src/navigation/navigationRef";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "./src/config/firebase";
import { registerRootComponent } from "expo";
import { QueryProvider } from "./src/services/queryProvider";

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyC1xLhbGBeg7pCJNM-ON5aMCT_1RY5560I",
    authDomain: "splitify-cd256.firebaseapp.com",
    projectId: "splitify-cd256",
    storageBucket: "splitify-cd256.firebasestorage.app",
    messagingSenderId: "1056124364476",
    appId: "1:1234567890:web:321abc456def7890",
  };

  firebase.initializeApp(firebaseConfig);
}

// Ignore specific warnings that might be related to navigation
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered",
  "Non-serializable values were found in the navigation state",
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
]);

// Define linking configuration for deep links
const linking = {
  prefixes: ["splitify://", "https://splitify.app", "http://splitify.app"],
  config: {
    screens: {
      Main: {
        screens: {
          Home: {
            screens: {
              HomeMain: "home",
              Pay: "pay",
              Request: "request",
              Activity: "activity",
              Notification: "notifications",
            },
          },
          Groups: {
            screens: {
              GroupsMain: "groups",
              GroupDetail: {
                path: "group/:groupId",
                parse: {
                  groupId: (groupId) => groupId,
                },
              },
            },
          },
          Profile: {
            screens: {
              ProfileMain: "profile",
            },
          },
        },
      },
      Splash: "splash",
      Welcome: "welcome",
      Login: "login",
      OtpVerification: "verify",
      SignUp: "signup",
    },
  },
  // Error handling for failed navigation
  getStateFromPath: (path, options) => {
    try {
      return options.getStateFromPath(path, options);
    } catch (error) {
      console.warn("Navigation error:", error);
      // Return a default state that won't crash the app
      return {
        routes: [{ name: "Splash" }],
      };
    }
  },
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotifications();

    // Set up notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Received notification:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      if (!Device.isDevice) {
        Alert.alert(
          "Error",
          "Push notifications do not work in the simulator!"
        );
        return;
      }

      // Check if we already have permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      console.log("Existing permission status:", existingStatus);

      let finalStatus = existingStatus;

      // If we don't have permission, request it
      if (existingStatus !== "granted") {
        console.log("Requesting permission...");
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("New permission status:", status);
      }

      if (finalStatus !== "granted") {
        Alert.alert("Error", "Failed to get push token for push notification!");
        return;
      }

      // Get the token using getDevicePushTokenAsync instead
      // This doesn't require a project ID or experience ID
      const expoPushToken = await Notifications.getDevicePushTokenAsync();
      console.log("Expo push token:", expoPushToken);

      // Store the token
      await AsyncStorage.setItem("fcmToken", expoPushToken.data);

      // Set up notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <QueryProvider>
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            fallback={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#FEBA17" />
              </View>
            }
            onStateChange={(state) => {
              // Log navigation state changes for debugging
              console.log("New nav state:", state?.routes?.[0]?.name);
            }}
          >
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <RootNavigator />
          </NavigationContainer>
        </QueryProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

// Register the main component
registerRootComponent(App);
