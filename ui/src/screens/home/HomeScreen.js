import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityList, registerDeviceToken } from "../../components";
import * as Notifications from "expo-notifications";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";
import { useNotifications } from "../../context/NotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config/constants";
import { useAuth } from "../../context/AuthContext";

// Function to generate random valid sentences for notifications
const generateRandomDescription = () => {
  const subjects = [
    "Your payment",
    "Your transaction",
    "Your request",
    "The transfer",
    "The expense",
    "The bill",
    "Your split",
    "The settlement",
    "Your reimbursement",
    "The payment request",
  ];

  const verbs = [
    "has been processed",
    "was approved",
    "was completed",
    "has been sent",
    "has been received",
    "was accepted",
    "was declined",
    "is pending",
    "has been updated",
    "is waiting for confirmation",
  ];

  const objects = [
    "successfully",
    "immediately",
    "with no issues",
    "as requested",
    "for the full amount",
    "and will be processed shortly",
    "by all members of the group",
    "and will be reflected in your balance",
    "after verification",
    "with a receipt sent to your email",
  ];

  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomObject = objects[Math.floor(Math.random() * objects.length)];

  return `${randomSubject} ${randomVerb} ${randomObject}.`;
};

// Mock data structure with relationship types
const activityData = [
  {
    id: "1",
    relationship: "debt",
    group: "Lunch Group",
    amount: 54.25,
    type: "pay",
    date: "Today",
    time: "10:35 AM",
    description: "You owe John Doe",
  },
  {
    id: "2",
    relationship: "credit",
    group: "Apartment 4B",
    amount: 128.75,
    type: "request",
    date: "Today",
    time: "08:15 AM",
    description: "Sarah Wilson owes you",
  },
  {
    id: "5",
    relationship: "settled",
    group: "Weekend Getaway",
    amount: 0,
    type: "none",
    date: "Today",
    time: "11:52 AM",
    description: "Lisa Baker - All settled up",
  },
  {
    id: "3",
    relationship: "thirdParty",
    group: "Road Trip",
    amount: 87.5,
    type: "request",
    date: "Yesterday",
    time: "03:45 PM",
    description: "Michael Brown owes Alex Smith",
  },
  {
    id: "4",
    relationship: "debt",
    group: "Movie Night",
    amount: 32.4,
    type: "pay",
    date: "Yesterday",
    time: "11:20 AM",
    description: "You owe Emily Johnson",
  },
];

// Action buttons data
const actionButtons = [
  {
    id: "1",
    icon: "send",
    label: "Pay",
    color: "#FEBA17",
  },
  {
    id: "2",
    icon: "account-balance-wallet",
    label: "Request",
    color: "#00BA88",
  },
  {
    id: "3",
    icon: "add",
    label: "Topup",
    color: "#2F80ED",
  },
  {
    id: "4",
    icon: "payments",
    label: "Withdraw",
    color: "#F4C83E",
  },
];

// Stats data
const statsData = [
  {
    id: "1",
    title: "Total Spent",
    amount: "$752.80",
    icon: "trending-down",
    color: colors.error,
    percent: "+12.5%",
    isUp: false,
  },
  {
    id: "2",
    title: "Total Received",
    amount: "$1,257.95",
    icon: "trending-up",
    color: colors.success,
    percent: "+23.7%",
    isUp: true,
  },
];

const HomeScreen = ({ navigation }) => {
  const { unreadCount } = useNotifications();
  const { isAuthenticated } = useAuth();
  // State to track refresh loading state
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Add state for activity filter
  const [activityFilter, setActivityFilter] = useState("all");
  // Add state for activity data
  const [activities, setActivities] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);

  // Helper function to show in-app notifications
  const showNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // null means show immediately
    });
  };

  // Set up notifications configuration
  useEffect(() => {
    // Configuration for how the notifications appear while app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted");
      }
    };

    requestNotificationPermissions();
  }, []);

  // Load activity data when component mounts
  useEffect(() => {
    // Simulate loading data from an API
    const loadActivityData = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setActivities(activityData);
      }, 500);
    };

    loadActivityData();

    // Get FCM token from storage
    const getFcmToken = async () => {
      try {
        const token = await AsyncStorage.getItem("fcmToken");
        if (token) {
          setFcmToken(token);
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    getFcmToken();
  }, []);

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulate data refresh with timeout
    setTimeout(() => {
      console.log("App data refreshed");

      setActivities(activityData);
      setIsRefreshing(false);
    }, 1500);
  };

  // Handle activity item press
  const handleActivityItemPress = (item) => {
    console.log("Activity item pressed:", item.id);
    // Add navigation or other actions here
  };

  // Handle test notification
  const handleSendTestNotification = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        showNotification(
          "Authentication Required",
          "Please log in to send test notifications."
        );
        return;
      }

      const token = fcmToken || (await AsyncStorage.getItem("fcmToken"));
      if (token) {
        await registerDeviceToken(token);
        const response = await axios.post(`${API_URL}/notifications/test`, {
          token: token,
        });
        if (response.data.success) {
          showNotification("Success", generateRandomDescription());
        } else {
          throw new Error("Failed to send test notification");
        }
      } else {
        showNotification(
          "Error",
          "No FCM token found. Please enable push notifications first."
        );
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      showNotification(
        "Error",
        "Failed to send test notification. Please try again."
      );
    }
  };

  // Filter activity data based on the selected filter
  const filteredActivityData = activities.filter((item) => {
    if (activityFilter === "all") return true;
    if (activityFilter === "debt" && item.relationship === "debt") return true;
    if (activityFilter === "credit" && item.relationship === "credit")
      return true;
    if (activityFilter === "settled" && item.relationship === "settled")
      return true;
    return false;
  });

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FEBA17"
        translucent
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ImageBackground
          source={{ uri: "https://placehold.co/FEBA17/FFFFFF/png" }}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.header} edges={["top"]}>
            <View style={styles.headerContent}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Hello, Alex</Text>
                <Text style={styles.title}>Splitify</Text>
              </View>
              <View style={styles.headerIconsContainer}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <MaterialIcons name="sync" size={22} color={colors.white} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => navigation.navigate("Notification")}
                >
                  <MaterialIcons
                    name="notifications-none"
                    size={22}
                    color={colors.white}
                  />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSendTestNotification}
                >
                  <MaterialIcons
                    name="notifications"
                    size={22}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceCardContent}>
                <View>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <Text style={styles.balanceAmount}>
                    $9,567<Text style={styles.balanceCents}>.50</Text>
                  </Text>
                </View>
                <View style={styles.balanceStatusContainer}>
                  <View style={styles.balanceStatusIndicator}>
                    <MaterialIcons
                      name="arrow-upward"
                      size={16}
                      color={colors.success}
                    />
                    <Text style={styles.balanceStatusText}>+15.3%</Text>
                  </View>
                  <Text style={styles.balanceStatusPeriod}>This month</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* Action Buttons */}
        <View style={styles.actionButtonsSection}>
          <View style={styles.actionButtonsContainer}>
            {actionButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.actionButton}
                onPress={() => {
                  if (button.label === "Pay") {
                    navigation.navigate("Pay");
                  } else if (button.label === "Request") {
                    navigation.navigate("Request");
                  } else {
                    console.log(`${button.label} button pressed`);
                  }
                }}
              >
                <View
                  style={[
                    styles.actionButtonIconContainer,
                    { backgroundColor: button.color },
                  ]}
                >
                  <MaterialIcons
                    name={button.icon}
                    size={20}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.actionButtonLabel}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            {statsData.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <MaterialIcons
                    name={stat.icon}
                    size={20}
                    color={stat.color}
                  />
                </View>
                <Text style={styles.statAmount}>{stat.amount}</Text>
                <View style={styles.statFooter}>
                  <MaterialIcons
                    name={stat.isUp ? "arrow-upward" : "arrow-downward"}
                    size={16}
                    color={stat.isUp ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.statPercent,
                      {
                        color: stat.isUp ? colors.success : colors.error,
                      },
                    ]}
                  >
                    {stat.percent}
                  </Text>
                  <Text style={styles.statPeriod}>This month</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Activity")}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Filter */}
          <View style={styles.activityFilterContainer}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activityFilter === "all" && styles.activeFilterTab,
              ]}
              onPress={() => setActivityFilter("all")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activityFilter === "all" && styles.activeFilterTabText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activityFilter === "debt" && styles.activeFilterTab,
              ]}
              onPress={() => setActivityFilter("debt")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activityFilter === "debt" && styles.activeFilterTabText,
                ]}
              >
                You Owe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activityFilter === "credit" && styles.activeFilterTab,
              ]}
              onPress={() => setActivityFilter("credit")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activityFilter === "credit" && styles.activeFilterTabText,
                ]}
              >
                Owed to You
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activityFilter === "settled" && styles.activeFilterTab,
              ]}
              onPress={() => setActivityFilter("settled")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activityFilter === "settled" && styles.activeFilterTabText,
                ]}
              >
                Settled
              </Text>
            </TouchableOpacity>
          </View>

          {/* Activity List - Redesigned to match ActivityScreen */}
          <View style={styles.activitiesWrapper}>
            {filteredActivityData.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <MaterialIcons
                  name="search-off"
                  size={48}
                  color={colors.gray400}
                />
                <Text style={styles.noResultsText}>No activities found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try adjusting your filters
                </Text>
              </View>
            ) : (
              // Group activities by date
              (() => {
                // Get unique dates from filtered activity data (limit to 3 dates for home screen)
                const uniqueDates = [
                  ...new Set(filteredActivityData.map((item) => item.date)),
                ].slice(0, 3);

                return uniqueDates.map((date) => (
                  <View key={date} style={styles.dateSection}>
                    {/* Date Header */}
                    <View style={styles.dateHeaderContainer}>
                      <Text style={styles.dateHeader}>{date}</Text>
                    </View>

                    {/* Activity Items for this date */}
                    <View style={styles.activitiesContainer}>
                      {filteredActivityData
                        .filter((item) => item.date === date)
                        .slice(0, 3) // Limit to 3 items per date for home screen
                        .map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.activityItem}
                            onPress={() => handleActivityItemPress(item)}
                          >
                            <View style={styles.activityItemLeft}>
                              <View
                                style={[
                                  styles.activityIcon,
                                  item.relationship === "debt"
                                    ? styles.activityIconDebt
                                    : item.relationship === "credit"
                                      ? styles.activityIconCredit
                                      : styles.activityIconSettled,
                                ]}
                              >
                                <MaterialIcons
                                  name={
                                    item.relationship === "debt"
                                      ? "arrow-downward"
                                      : item.relationship === "credit"
                                        ? "arrow-upward"
                                        : "check"
                                  }
                                  size={16}
                                  color={colors.white}
                                />
                              </View>
                              <View style={styles.activityItemContent}>
                                <Text style={styles.activityItemTitle}>
                                  {item.description}
                                </Text>
                                <View style={styles.activityItemMeta}>
                                  <Text style={styles.activityItemGroup}>
                                    {item.group}
                                  </Text>
                                  <Text style={styles.activityItemTime}>
                                    {item.time}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View style={styles.activityItemRight}>
                              <Text
                                style={[
                                  styles.activityItemAmount,
                                  item.relationship === "debt"
                                    ? styles.amountDebt
                                    : item.relationship === "credit"
                                      ? styles.amountCredit
                                      : styles.amountSettled,
                                ]}
                              >
                                {item.relationship === "settled"
                                  ? "Settled"
                                  : `$${item.amount.toFixed(2)}`}
                              </Text>
                              {item.type !== "none" && (
                                <TouchableOpacity
                                  style={[
                                    styles.activityActionButton,
                                    {
                                      backgroundColor:
                                        item.type === "pay"
                                          ? colors.primary
                                          : "#00BA88",
                                    },
                                  ]}
                                  onPress={() => {
                                    if (item.type === "pay") {
                                      navigation.navigate("Pay");
                                    } else if (item.type === "request") {
                                      navigation.navigate("Request");
                                    }
                                  }}
                                >
                                  <Text style={styles.activityActionButtonText}>
                                    {item.type === "pay" ? "Pay" : "Request"}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                ));
              })()
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.xl,
  },
  header: {
    backgroundColor: "transparent",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  headerIconsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    zIndex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  balanceCard: {
    margin: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  balanceCardContent: {
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
  },
  balanceCents: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
  },
  balanceStatusContainer: {
    alignItems: "flex-end",
  },
  balanceStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  balanceStatusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.success,
    marginLeft: spacing.xs,
  },
  balanceStatusPeriod: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
  },
  actionButtonsSection: {
    marginTop: -spacing["2xl"],
    paddingHorizontal: spacing.lg,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  actionButtonLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray900,
  },
  statsSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  statAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  statFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  statPercent: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
  statPeriod: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
  },
  activitySection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  viewAllButton: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  activityFilterContainer: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  activeFilterTabText: {
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  activitiesWrapper: {
    flex: 1,
  },
  dateSection: {
    marginBottom: spacing.xl,
  },
  dateHeaderContainer: {
    marginBottom: spacing.sm,
  },
  dateHeader: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  activitiesContainer: {
    backgroundColor: colors.white,
    flexDirection: "column",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  activityItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    maxWidth: "65%",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  activityIconDebt: {
    backgroundColor: colors.error,
  },
  activityIconCredit: {
    backgroundColor: colors.success,
  },
  activityIconSettled: {
    backgroundColor: colors.gray400,
  },
  activityItemContent: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  activityItemMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityItemGroup: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    marginRight: spacing.sm,
  },
  activityItemTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
  },
  activityItemRight: {
    alignItems: "flex-end",
    minWidth: "35%",
  },
  activityItemAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  amountDebt: {
    color: colors.error,
  },
  amountCredit: {
    color: colors.success,
  },
  amountSettled: {
    color: colors.gray400,
  },
  activityActionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  activityActionButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  noResultsSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});

export default HomeScreen;
