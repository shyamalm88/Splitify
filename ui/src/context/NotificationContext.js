import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../config/firebase";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Notification settings
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Load notifications and settings from storage on mount
  useEffect(() => {
    loadNotifications();
    loadNotificationSettings();
    setupNotificationListener();
  }, []);

  // Load notification settings from AsyncStorage
  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("notificationSettings");
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setPushNotificationsEnabled(
          parsedSettings.pushNotificationsEnabled ?? true
        );
        setEmailNotificationsEnabled(
          parsedSettings.emailNotificationsEnabled ?? true
        );
        setSoundEnabled(parsedSettings.soundEnabled ?? true);
        setVibrationEnabled(parsedSettings.vibrationEnabled ?? true);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  // Save notification settings to AsyncStorage
  const saveNotificationSettings = async () => {
    try {
      const settings = {
        pushNotificationsEnabled,
        emailNotificationsEnabled,
        soundEnabled,
        vibrationEnabled,
      };
      await AsyncStorage.setItem(
        "notificationSettings",
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  // Toggle functions for notification settings
  const togglePushNotifications = async (value) => {
    setPushNotificationsEnabled(value);
    await saveNotificationSettings();
  };

  const toggleEmailNotifications = async (value) => {
    setEmailNotificationsEnabled(value);
    await saveNotificationSettings();
  };

  const toggleSound = async (value) => {
    setSoundEnabled(value);
    await saveNotificationSettings();
  };

  const toggleVibration = async (value) => {
    setVibrationEnabled(value);
    await saveNotificationSettings();
  };

  // Load notifications from AsyncStorage
  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
        updateUnreadCount(parsedNotifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  // Setup Firebase notification listener
  const setupNotificationListener = () => {
    try {
      if (
        !firebase ||
        !firebase.messaging ||
        !firebase.messaging.isSupported()
      ) {
        console.warn("Firebase messaging is not supported in this environment");
        return;
      }

      const messaging = firebase.messaging();

      // Handle foreground messages
      messaging.onMessage((payload) => {
        console.log("Message received in foreground:", payload);
        const { title, body, data } = payload.notification;

        // Create new notification object
        const newNotification = {
          id: Date.now().toString(),
          title,
          description: body,
          icon: data?.icon || "notifications",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          hasAlert: true,
          data: data || {},
          timestamp: Date.now(),
        };

        // Add to notifications list
        addNotification(newNotification);
      });
    } catch (error) {
      console.error("Error setting up notification listener:", error);
    }
  };

  // Add a new notification
  const addNotification = async (notification) => {
    try {
      const updatedNotifications = [notification, ...notifications];
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, hasAlert: false }
          : notification
      );
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        hasAlert: false,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      await AsyncStorage.removeItem("notifications");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  // Update unread count
  const updateUnreadCount = (notificationsList) => {
    const count = notificationsList.filter(
      (notification) => notification.hasAlert
    ).length;
    setUnreadCount(count);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    // Add notification settings to the context
    pushNotificationsEnabled,
    emailNotificationsEnabled,
    soundEnabled,
    vibrationEnabled,
    togglePushNotifications,
    toggleEmailNotifications,
    toggleSound,
    toggleVibration,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
