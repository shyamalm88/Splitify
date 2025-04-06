import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
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

// Menu item data
const menuItems = [
  {
    id: "1",
    title: "Personal Info",
    icon: "person-outline",
    route: "PersonalInfo",
  },
  {
    id: "2",
    title: "Notification",
    icon: "notifications-none",
    route: "Notification",
  },
  {
    id: "3",
    title: "Account & Security",
    icon: "security",
    route: "AccountSecurity",
  },
  {
    id: "4",
    title: "Payment Methods",
    icon: "credit-card",
    route: "PaymentMethods",
  },
  {
    id: "5",
    title: "Billing & Subscriptions",
    icon: "receipt-long",
    route: "BillingSubscriptions",
  },
  {
    id: "6",
    title: "Linked Accounts",
    icon: "link",
    route: "LinkedAccounts",
  },
  {
    id: "7",
    title: "App Appearance",
    icon: "palette",
    route: "AppAppearance",
  },
  {
    id: "8",
    title: "Data & Analytics",
    icon: "bar-chart",
    route: "DataAnalytics",
  },
  {
    id: "9",
    title: "Help & Support",
    icon: "help-outline",
    route: "HelpSupport",
  },
];

const ProfileScreen = ({ navigation }) => {
  const handleMenuItemPress = (route) => {
    console.log(`Navigating to ${route}`);
    navigation.navigate(route);
  };

  const handleLogout = () => {
    console.log("Opening logout confirmation");
    navigation.navigate("LogoutConfirm");
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity style={styles.qrButton}>
          <MaterialIcons name="qr-code" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Andrew Ainsley</Text>
            <Text style={styles.profileEmail}>andrew.ainsley@gmail.com</Text>
          </View>
        </View>

        {/* Upgrade Banner */}
        <TouchableOpacity style={styles.upgradeBanner}>
          <View style={styles.upgradeIconContainer}>
            <MaterialIcons name="star" size={22} color={colors.white} />
          </View>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>
              Upgrade Plan to Unlock More!
            </Text>
            <Text style={styles.upgradeSubtitle}>
              Enjoy all the benefits and explore more possibilities
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.black}
          />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <View style={styles.menuIconContainer}>
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={colors.gray800}
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={colors.gray500}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
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
    backgroundColor: colors.white,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  qrButton: {
    padding: spacing.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  profileImageText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  upgradeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  upgradeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  upgradeContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  upgradeTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.black,
    marginBottom: spacing.xs / 2,
  },
  upgradeSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.gray700,
  },
  menuContainer: {
    paddingHorizontal: spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    marginLeft: spacing.md,
  },
});

export default ProfileScreen;
