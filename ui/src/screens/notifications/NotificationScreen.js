import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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

// Mock data for notifications
const notificationsData = [
  {
    id: "1",
    title: "New Update Available",
    description:
      "Update the Splitify and enjoy new features for a better split bill experience.",
    icon: "system-update",
    date: "Today",
    time: "09:32 AM",
    hasAlert: true,
  },
  {
    id: "2",
    title: "Enable 2FA for Security!",
    description:
      "Use two-factor authentication for extra security on your account.",
    icon: "security",
    date: "Today",
    time: "08:12 AM",
    hasAlert: true,
  },
  {
    id: "3",
    title: "Multiple Payments Support",
    description:
      "Now you can use multiple cards. Go to Account > Payment methods to add one.",
    icon: "credit-card",
    date: "Yesterday",
    time: "14:25 PM",
    hasAlert: false,
  },
  {
    id: "4",
    title: "Christmas and New Year Event!",
    description:
      "Big offer a special event for you on the special day of Christmas.",
    icon: "celebration",
    date: "Yesterday",
    time: "10:40 AM",
    hasAlert: false,
  },
  {
    id: "5",
    title: "Premium Features Unlocked!",
    description:
      "Upgrade to Splitify Premium and unlock more features for free.",
    icon: "stars",
    date: "Dec 18, 2023",
    time: "16:45 PM",
    hasAlert: false,
  },
  {
    id: "6",
    title: "Group Invitation",
    description: "John invited you to join 'Team Lunch' group",
    icon: "group-add",
    date: "Dec 18, 2023",
    time: "11:10 AM",
    hasAlert: false,
  },
];

const NotificationScreen = ({ navigation }) => {
  // Get unique dates from notifications data
  const getUniqueDates = () => {
    const dates = notificationsData.map((item) => item.date);
    return [...new Set(dates)];
  };

  // Handle notification item press
  const handleNotificationPress = (item) => {
    console.log("Notification pressed:", item.id);
    // Add navigation or other actions here
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
        <Text style={styles.title}>Notification</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("NotificationSettings")}
        >
          <MaterialIcons name="settings" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsContainer}>
        {getUniqueDates().map((date) => (
          <View key={date}>
            {/* Date Header */}
            <View style={styles.dateHeaderContainer}>
              <Text style={styles.dateHeader}>{date}</Text>
            </View>

            {/* Notification Items for this date */}
            {notificationsData
              .filter((item) => item.date === date)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.notificationItem}
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
                      <Text style={styles.notificationTitle}>{item.title}</Text>
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
        ))}
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
  settingsButton: {
    padding: spacing.xs,
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
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
