import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";
import { useNotifications } from "../../context/NotificationContext";

const NotificationScreen = ({ navigation }) => {
  const { notifications, markAsRead, markAllAsRead, clearAllNotifications } =
    useNotifications();

  // Get unique dates from notifications data
  const getUniqueDates = () => {
    const dates = notifications.map((item) => item.date);
    return [...new Set(dates)];
  };

  // Handle notification item press
  const handleNotificationPress = (item) => {
    // Mark as read if it has an alert
    if (item.hasAlert) {
      markAsRead(item.id);
    }

    // Handle navigation based on notification data
    if (item.data?.route) {
      navigation.navigate(item.data.route, item.data.params);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    Alert.alert(
      "Mark All as Read",
      "Are you sure you want to mark all notifications as read?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Mark All",
          onPress: markAllAsRead,
        },
      ]
    );
  };

  // Handle clear all notifications
  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearAllNotifications,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleMarkAllAsRead}
          >
            <MaterialIcons name="done-all" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearAll}
          >
            <MaterialIcons name="delete-sweep" size={24} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("NotificationSettings")}
          >
            <MaterialIcons name="settings" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsContainer}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="notifications-off"
              size={48}
              color={colors.gray400}
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          getUniqueDates().map((date) => (
            <View key={date}>
              {/* Date Header */}
              <View style={styles.dateHeaderContainer}>
                <Text style={styles.dateHeader}>{date}</Text>
              </View>

              {/* Notification Items for this date */}
              {notifications
                .filter((item) => item.date === date)
                .map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.notificationItem,
                      item.hasAlert && styles.unreadNotification,
                    ]}
                    onPress={() => handleNotificationPress(item)}
                  >
                    <View style={styles.iconContainer}>
                      <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={colors.gray800}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>
                          {item.title}
                        </Text>
                        {item.hasAlert && <View style={styles.alertDot} />}
                      </View>
                      <Text style={styles.notificationDescription}>
                        {item.description}
                      </Text>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={colors.gray400}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          ))
        )}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
    marginTop: spacing.md,
  },
  dateHeaderContainer: {
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  dateHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  unreadNotification: {
    backgroundColor: colors.gray50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs / 2,
  },
  notificationTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginRight: spacing.xs,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
});

export default NotificationScreen;
