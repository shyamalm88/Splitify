import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import {
  firebase,
  requestNotificationPermission,
  setupMessageListener,
} from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config/constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Function to register device token with the server
export const registerDeviceToken = async (token) => {
  try {
    // Get auth token from storage
    const authToken = await AsyncStorage.getItem("auth_token");
    if (!authToken) {
      throw new Error("No auth token found. Please log in first.");
    }

    const response = await axios.post(
      `${API_URL}/notifications/register-device`,
      {
        token,
        platform: Platform.OS,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering device token:", error);
    throw error;
  }
};

const NotificationManager = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize notifications when component mounts
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Function to initialize notifications
  const initializeNotifications = async () => {
    try {
      if (Platform.OS === "web") {
        // Web platform initialization
        if (
          !firebase ||
          !firebase.messaging ||
          !firebase.messaging.isSupported()
        ) {
          setError("Firebase messaging is not supported in this browser");
          return;
        }
        setupMessageListener();
      } else {
        // Mobile platform initialization
        if (!Device.isDevice) {
          setError(
            "Push notifications are not supported in the simulator/emulator"
          );
          return;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          setError("Failed to get push token for push notification!");
          return;
        }

        // Get the token
        const token = await Notifications.getExpoPushTokenAsync();
        setFcmToken(token.data);
        await AsyncStorage.setItem("fcmToken", token.data);

        // Register with server
        try {
          await registerDeviceToken(token.data);
        } catch (serverError) {
          console.error("Error registering token with server:", serverError);
        }
      }

      // Get the stored token
      const storedToken = await AsyncStorage.getItem("fcmToken");
      if (storedToken) {
        setFcmToken(storedToken);
      }
    } catch (error) {
      console.error("Error initializing notifications:", error);
      setError(`Error initializing notifications: ${error.message}`);
    }
  };

  // Function to request notification permission and get FCM token
  const requestPermission = async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === "web") {
        // Web platform permission request
        if (
          !firebase ||
          !firebase.messaging ||
          !firebase.messaging.isSupported()
        ) {
          setError("Firebase messaging is not supported in this browser");
          return;
        }

        const result = await requestNotificationPermission();
        if (result.success) {
          const token = result.token;
          setFcmToken(token);
          await AsyncStorage.setItem("fcmToken", token);
          await registerDeviceToken(token);
          Alert.alert("Success", "Notification permission granted!");
        } else {
          setError(result.error || "Failed to get notification permission");
        }
      } else {
        // Mobile platform permission request
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          const token = await Notifications.getExpoPushTokenAsync();
          setFcmToken(token.data);
          await AsyncStorage.setItem("fcmToken", token.data);
          await registerDeviceToken(token.data);
          Alert.alert("Success", "Notification permission granted!");
        } else {
          setError("Failed to get push token for push notification!");
        }
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      setError(`Error requesting permission: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to subscribe to a topic
  const subscribeToTopic = async (topic) => {
    if (!fcmToken) {
      setError("No FCM token available. Request permission first.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users/subscribe-topic`, {
        token: fcmToken,
        topic,
      });

      if (response.data.success) {
        Alert.alert("Success", `Subscribed to topic: ${topic}`);
      } else {
        setError(
          response.data.error || `Failed to subscribe to topic: ${topic}`
        );
      }
    } catch (error) {
      console.error("Error subscribing to topic:", error);
      setError(`Error subscribing to topic: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to send a test notification
  const sendTestNotification = async () => {
    if (!fcmToken) {
      setError("No FCM token available. Request permission first.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/notifications/send-test`, {
        token: fcmToken,
      });

      if (response.data.success) {
        Alert.alert("Success", "Test notification sent!");
      } else {
        setError(response.data.error || "Failed to send test notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      setError(`Error sending test notification: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Only render on web platform
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Manager</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {fcmToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>FCM Token:</Text>
          <Text style={styles.tokenText}>
            {fcmToken.substring(0, 20)}...
            {fcmToken.substring(fcmToken.length - 20)}
          </Text>
        </View>
      ) : (
        <Text style={styles.info}>No notification permission yet.</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={fcmToken ? "Refresh Permission" : "Request Permission"}
          onPress={requestPermission}
          disabled={loading}
        />
      </View>

      {fcmToken && (
        <>
          <View style={styles.buttonContainer}>
            <Button
              title="Subscribe to Updates"
              onPress={() => subscribeToTopic("app_updates")}
              disabled={loading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Send Test Notification"
              onPress={sendTestNotification}
              disabled={loading}
            />
          </View>
        </>
      )}

      {loading && <Text style={styles.loading}>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  info: {
    marginVertical: 8,
    color: "#666",
  },
  error: {
    color: "red",
    marginVertical: 8,
  },
  loading: {
    marginTop: 8,
    color: "#666",
    fontStyle: "italic",
  },
  tokenContainer: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  tokenLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default NotificationManager;
