import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const BillingSubscriptionsScreen = ({ navigation }) => {
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
        <Text style={styles.title}>Billing & Subscriptions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Premium Plan */}
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>Splitify Premium</Text>
          <Text style={styles.planPrice}>
            $49.99 <Text style={styles.periodLabel}>/year</Text>
          </Text>

          {/* Plan Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="check" size={20} color={colors.primary} />
              <Text style={styles.featureText}>
                24 months subscription benefits
              </Text>
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="check" size={20} color={colors.primary} />
              <Text style={styles.featureText}>
                Exclusive access to latest features
              </Text>
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="check" size={20} color={colors.primary} />
              <Text style={styles.featureText}>
                Premium customer support options
              </Text>
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="check" size={20} color={colors.primary} />
              <Text style={styles.featureText}>
                Special offers and discounts from partner brands
              </Text>
            </View>
          </View>

          {/* Current Plan Info */}
          <View style={styles.currentPlanContainer}>
            <Text style={styles.currentPlanLabel}>Your current plan</Text>
            <Text style={styles.currentPlanText}>
              Your subscription will expire on Dec 31, 2024. Renew or update
              your subscription.
            </Text>
          </View>

          {/* Delete Account Button */}
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => console.log("Delete Account")}
          >
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={styles.dangerText}>
            Permanently delete your account and all of your data. This cannot be
            undone.
          </Text>
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
  },
  planContainer: {
    padding: spacing.lg,
  },
  planTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  planPrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    marginBottom: spacing.xl,
  },
  periodLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
    color: colors.gray700,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray800,
    marginLeft: spacing.sm,
    flex: 1,
  },
  currentPlanContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  currentPlanLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  currentPlanText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray800,
    lineHeight: typography.fontSize.md * 1.4,
  },
  dangerButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  dangerButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.error,
  },
  dangerText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    textAlign: "center",
  },
});

export default BillingSubscriptionsScreen;
