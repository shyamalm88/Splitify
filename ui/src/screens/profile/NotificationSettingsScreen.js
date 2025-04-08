import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const NotificationSettingsScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [groupInvitations, setGroupInvitations] = useState(true);
  const [paymentRequests, setPaymentRequests] = useState(true);
  const [securityUpdates, setSecurityUpdates] = useState(false);
  const [billingSubscriptions, setBillingSubscriptions] = useState(true);

  const toggleSwitch = (setting, setSetting) => {
    setSetting((previousState) => !previousState);
  };

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
        <Text style={styles.title}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Push Notifications */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={pushNotifications ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(pushNotifications, setPushNotifications)
            }
            value={pushNotifications}
          />
        </View>

        {/* Group Invitations */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Group Invitations</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={groupInvitations ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(groupInvitations, setGroupInvitations)
            }
            value={groupInvitations}
          />
        </View>

        {/* Payment Requests */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Payment Request</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={paymentRequests ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(paymentRequests, setPaymentRequests)
            }
            value={paymentRequests}
          />
        </View>

        {/* Security Updates */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Security Updates</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={securityUpdates ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(securityUpdates, setSecurityUpdates)
            }
            value={securityUpdates}
          />
        </View>

        {/* Billing & Subscriptions */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Billing & Subscriptions</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={billingSubscriptions ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(billingSubscriptions, setBillingSubscriptions)
            }
            value={billingSubscriptions}
          />
        </View>
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
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  scrollContainer: {
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
  settingText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
});

export default NotificationSettingsScreen;
