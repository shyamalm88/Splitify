import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../../theme/theme";
import { useNotifications } from "../../context/NotificationContext";
import axios from "axios";
import { API_URL } from "../../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerDeviceToken } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { firebase, requestNotificationPermission } from "../../config/firebase";
import * as Notifications from "expo-notifications";

const NotificationSettingsScreen = ({ navigation }) => {
  const {
    pushNotificationsEnabled,
    emailNotificationsEnabled,
    soundEnabled,
    vibrationEnabled,
    togglePushNotifications,
    toggleEmailNotifications,
    toggleSound,
    toggleVibration,
    addNotification,
  } = useNotifications();

  const { isAuthenticated } = useAuth();
  const [fcmToken, setFcmToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundEnabledState, setSoundEnabledState] = useState(true);
  const [vibrationEnabledState, setVibrationEnabledState] = useState(true);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  useEffect(() => {
    // Get FCM token from storage and request permissions if needed
    const initializeNotifications = async () => {
      try {
        setLoading(true);

        // First check if we already have a token
        const storedToken = await AsyncStorage.getItem("fcmToken");
        if (storedToken) {
          setFcmToken(storedToken);
          // Verify the token is still valid
          if (Platform.OS !== "web") {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== "granted") {
              // Token exists but permissions were revoked
              await AsyncStorage.removeItem("fcmToken");
              setFcmToken(null);
              console.warn("Notification permissions were revoked");
              return;
            }
          }
          return;
        }

        // If no token, request permission and get new token
        const result = await requestNotificationPermission();
        console.log("Notification permission result:", result);

        if (result.success) {
          const token = result.token;
          setFcmToken(token);
          await AsyncStorage.setItem("fcmToken", token);

          // Register the token with our server if user is authenticated
          if (isAuthenticated) {
            try {
              await registerDeviceToken(token);
              console.log("Device token registered successfully");
            } catch (error) {
              console.error("Error registering device token:", error);
            }
          }
        } else {
          console.warn("Failed to get notification permission:", result.error);
          Alert.alert(
            "Notification Permission",
            "Please enable notifications in your device settings to receive important updates."
          );
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
        Alert.alert(
          "Error",
          "Failed to initialize notifications. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      initializeNotifications();
    }
  }, [isAuthenticated]);

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const result = await requestNotificationPermission();
      console.log("Permission request result:", result);

      if (result.success) {
        setFcmToken(result.token);
        await AsyncStorage.setItem("fcmToken", result.token);

        // Register the token with our server if user is authenticated
        if (isAuthenticated) {
          await registerDeviceToken(result.token);
        }

        Alert.alert("Success", "Push notifications enabled successfully!");
        // Refresh notification settings
        togglePushNotifications(true);
      } else {
        Alert.alert(
          "Error",
          "Failed to enable push notifications. Please check your device settings."
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      Alert.alert(
        "Error",
        "Failed to enable push notifications. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    console.log("==== SEND TEST NOTIFICATION FLOW ====");
    console.log("Checking authentication state:", isAuthenticated);

    if (!isAuthenticated) {
      const isLoggedIn = await checkLoginState();
      console.log("Rechecked login state:", isLoggedIn);

      if (!isLoggedIn) {
        Alert.alert(
          "Authentication Required",
          "Please log in to send test notifications."
        );
        return;
      }
    }

    if (!fcmToken) {
      console.log("No FCM token available");
      Alert.alert(
        "Notifications Disabled",
        "Would you like to enable push notifications?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Enable", onPress: handleRequestPermission },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      console.log("Starting test notification process...");

      // Get auth token from storage
      const authToken = await AsyncStorage.getItem("auth_token");
      console.log("Auth token retrieved:", authToken);
      console.log("Auth token length:", authToken ? authToken.length : 0);

      if (!authToken) {
        throw new Error("No auth token found. Please log in first.");
      }

      // First register the device token
      console.log("Registering device token:", fcmToken);
      console.log(
        "Making request to:",
        `${API_URL}/notifications/register-device`
      );
      console.log("With headers:", { Authorization: `Bearer ${authToken}` });

      const registerResponse = await axios.post(
        `${API_URL}/notifications/register-device`,
        { token: fcmToken, platform: Platform.OS },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("Register response:", registerResponse.data);

      // Then send the test notification
      console.log(
        "Sending test notification request to:",
        `${API_URL}/notifications/send-test`
      );
      const response = await axios.post(
        `${API_URL}/notifications/send-test`,
        { token: fcmToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Test notification response:", response.data);
      if (response.data.success) {
        // Add the test notification to the app's internal notification list
        const newNotification = {
          id: Date.now().toString(),
          title: "Test Notification",
          description: "This is a test notification from Splitify",
          icon: "notifications",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          hasAlert: true,
          data: {
            type: "test",
            timestamp: Date.now(),
            source: "test-notification",
          },
          timestamp: Date.now(),
        };

        // Add to notifications context
        await addNotification(newNotification);

        Alert.alert("Success", "Test notification sent successfully!");
      } else {
        throw new Error(
          response.data.message || "Failed to send test notification"
        );
      }
    } catch (error) {
      console.error("Error sending test notification:", error);

      // More detailed error info
      if (error.response) {
        // Server responded with an error status
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
        Alert.alert(
          "Server Error",
          `Status: ${error.response.status}. ${error.response.data?.message || "Unknown server error"}`
        );
      } else if (error.request) {
        // Request was made but no response
        console.error("Network error - no response received");
        Alert.alert(
          "Network Error",
          "Could not connect to the server. Please check your internet connection and server status."
        );
      } else {
        // Other errors
        Alert.alert(
          "Error",
          error.message || "Failed to send test notification. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const showCurrentToken = async () => {
    try {
      const token = await AsyncStorage.getItem("fcmToken");
      if (token) {
        Alert.alert("Push Token", token, [
          {
            text: "Copy",
            onPress: () => {
              Clipboard.setString(token);
              Alert.alert("Success", "Token copied to clipboard!");
            },
          },
          { text: "OK" },
        ]);
      } else {
        Alert.alert(
          "No Token",
          "Push notification token not found. Please enable notifications first."
        );
      }
    } catch (error) {
      console.error("Error showing token:", error);
    }
  };

  // Add function to check login state
  const checkLoginState = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const userData = await AsyncStorage.getItem("user_data");

      console.log("Auth check - Token exists:", !!token);
      console.log("Auth check - User data exists:", !!userData);

      setIsAuthenticatedState(!!token && !!userData);

      return !!token && !!userData;
    } catch (error) {
      console.error("Error checking login state:", error);
      return false;
    }
  };

  // Modified useEffect to check login state
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Check if the user is logged in
        const isLoggedIn = await checkLoginState();
        console.log("User is logged in:", isLoggedIn);

        // Get current FCM token
        const token = await getFcmToken();
        setFcmToken(token);
        console.log("FCM Token:", token);

        // Other settings can be loaded here...
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    };

    loadSettings();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Settings List */}
      <ScrollView style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications about your expenses and activities
            </Text>
          </View>
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={togglePushNotifications}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Email Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive email updates about your account
            </Text>
          </View>
          <Switch
            value={emailNotificationsEnabled}
            onValueChange={toggleEmailNotifications}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Sound</Text>
            <Text style={styles.settingDescription}>
              Play sound when receiving notifications
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Vibration</Text>
            <Text style={styles.settingDescription}>
              Vibrate when receiving notifications
            </Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={toggleVibration}
            trackColor={{ false: colors.gray300, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {/* Test Notification Button */}
        <View style={styles.testButtonContainer}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleSendTestNotification}
          >
            <MaterialIcons
              name="notifications"
              size={24}
              color={colors.white}
            />
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={showCurrentToken}>
          <Text style={styles.buttonText}>Show Push Token</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  settingsContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  testButtonContainer: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    width: "100%",
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  testButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.sm,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotificationSettingsScreen;
