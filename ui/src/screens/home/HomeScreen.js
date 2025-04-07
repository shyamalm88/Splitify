import React, { useState } from "react";
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
import { ActivityList } from "../../components";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";

// Mock data for activity
const activityData = [
  {
    id: "1",
    description: "You owe John Doe",
    relationship: "debt",
    group: "Lunch Group",
    amount: 54.25,
    type: "pay",
    date: "Today",
    time: "10:35 AM",
  },
  {
    id: "2",
    description: "Sarah Wilson owes you",
    relationship: "credit",
    group: "Apartment 4B",
    amount: 128.75,
    type: "request",
    date: "Today",
    time: "08:15 AM",
  },
  {
    id: "5",
    description: "Lisa Baker - All settled up",
    relationship: "settled",
    group: "Weekend Getaway",
    amount: 0,
    type: "none",
    date: "Today",
    time: "11:52 AM",
  },
  {
    id: "3",
    description: "Michael Brown owes Alex Smith",
    relationship: "thirdParty",
    group: "Road Trip",
    amount: 87.5,
    type: "request",
    date: "Yesterday",
    time: "03:45 PM",
  },
  {
    id: "4",
    description: "You owe Emily Johnson",
    relationship: "debt",
    group: "Movie Night",
    amount: 32.4,
    type: "pay",
    date: "Yesterday",
    time: "11:20 AM",
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
  // State to track refresh loading state
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Add state for activity filter
  const [activityFilter, setActivityFilter] = useState("all");

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulate data refresh with timeout
    setTimeout(() => {
      console.log("App data refreshed");
      setIsRefreshing(false);
    }, 1500);
  };

  // Handle activity item press
  const handleActivityItemPress = (item) => {
    console.log("Activity item pressed:", item.id);
    // Add navigation or other actions here
  };

  // Filter activity data based on the selected filter
  const filteredActivityData = activityData.filter((item) => {
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
                    styles.actionIconContainer,
                    { backgroundColor: button.color },
                  ]}
                >
                  <MaterialIcons
                    name={button.icon}
                    size={24}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.actionLabel}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Stats Overview</Text>
          <View style={styles.statsCardContainer}>
            {statsData.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <Text style={styles.statCardTitle}>{stat.title}</Text>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color + "20" },
                    ]}
                  >
                    <MaterialIcons
                      name={stat.icon}
                      size={18}
                      color={stat.color}
                    />
                  </View>
                </View>
                <Text style={styles.statCardAmount}>{stat.amount}</Text>
                <View style={styles.statCardFooter}>
                  <MaterialIcons
                    name={stat.isUp ? "arrow-upward" : "arrow-downward"}
                    size={14}
                    color={stat.isUp ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.statCardPercent,
                      { color: stat.isUp ? colors.success : colors.error },
                    ]}
                  >
                    {stat.percent}
                  </Text>
                  <Text style={styles.statCardPeriod}>this month</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <View style={styles.activityHeaderLeft}>
              <MaterialIcons name="history" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigation.navigate("Activity")}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={12}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Activity Quick Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.activityFilterContainer}
            contentContainerStyle={styles.activityFilterContent}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                activityFilter === "all" && styles.filterChipActive,
              ]}
              onPress={() => setActivityFilter("all")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activityFilter === "all" && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activityFilter === "debt" && styles.filterChipActive,
              ]}
              onPress={() => setActivityFilter("debt")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activityFilter === "debt" && styles.filterChipTextActive,
                ]}
              >
                You owe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activityFilter === "credit" && styles.filterChipActive,
              ]}
              onPress={() => setActivityFilter("credit")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activityFilter === "credit" && styles.filterChipTextActive,
                ]}
              >
                Owed to you
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activityFilter === "settled" && styles.filterChipActive,
              ]}
              onPress={() => setActivityFilter("settled")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activityFilter === "settled" && styles.filterChipTextActive,
                ]}
              >
                Settled
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Activity List */}
          <View style={styles.customActivityList}>
            {filteredActivityData.slice(0, 4).map((item) => (
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
                      <Text style={styles.activityItemGroup}>{item.group}</Text>
                      <Text style={styles.activityItemTime}>
                        {item.time} • {item.date}
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
                              : colors.success,
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
      </ScrollView>

      {/* Tab Bar Placeholder */}
      <SafeAreaView style={styles.tabBar} edges={["bottom"]}>
        {/* This will be handled by the navigation component */}
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  headerBackground: {
    width: "100%",
    height: 280,
    marginTop: -1, // Fix for Android to ensure no gap at the top
  },
  header: {
    paddingBottom: spacing.lg,
    backgroundColor: "rgba(254, 186, 23, 0.85)", // Golden overlay matching FEBA17 with transparency
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    opacity: 0.9,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  headerIconsContainer: {
    flexDirection: "row",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  balanceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: -spacing["3xl"],
    ...shadows.md,
    zIndex: 1,
  },
  balanceCardContent: {
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
  },
  balanceCents: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.normal,
  },
  balanceStatusContainer: {
    alignItems: "flex-end",
  },
  balanceStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs / 2,
  },
  balanceStatusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.success,
    marginLeft: 2,
  },
  balanceStatusPeriod: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  actionButtonsSection: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  actionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
  },
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginLeft: spacing.sm,
  },
  statsCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  statCard: {
    flex: 0.48,
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
  statCardTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statCardAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  statCardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  statCardPercent: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginLeft: 2,
    marginRight: spacing.xs,
  },
  statCardPeriod: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  activitySection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  activityHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
  },
  seeAllText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.xs / 2,
  },
  activityFilterContainer: {
    marginBottom: spacing.md,
  },
  activityFilterContent: {
    paddingBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray800,
    fontWeight: typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  customActivityList: {
    marginTop: spacing.xs,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  activityItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  activityIconDebt: {
    backgroundColor: colors.error,
  },
  activityIconCredit: {
    backgroundColor: colors.success,
  },
  activityIconSettled: {
    backgroundColor: colors.info,
  },
  activityItemContent: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: 2,
  },
  activityItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  activityItemGroup: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    marginRight: spacing.xs,
  },
  activityItemTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  activityItemRight: {
    alignItems: "flex-end",
  },
  activityItemAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  amountDebt: {
    color: colors.error,
  },
  amountCredit: {
    color: colors.success,
  },
  amountSettled: {
    color: colors.info,
  },
  activityActionButton: {
    width: 80,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
    alignItems: "center",
  },
  activityActionButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
  },
  tabBar: {
    height: 60,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});

export default HomeScreen;
