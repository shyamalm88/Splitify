import React, { useState } from "react";
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

const ContactDetailScreen = ({ navigation, route }) => {
  const { contact } = route.params;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteContact = () => {
    navigation.navigate("DeleteContactConfirm", { contact });
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
        <Text style={styles.title}>Contact</Text>
        <TouchableOpacity>
          {contact.isFavorite ? (
            <MaterialIcons name="star" size={24} color={colors.primary} />
          ) : (
            <MaterialIcons
              name="star-outline"
              size={24}
              color={colors.gray700}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Contact Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
          </View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactEmail}>{contact.email}</Text>
          <Text style={styles.splitifyStatus}>Splitify Account</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteContact}
          >
            <Text style={styles.deleteButtonText}>Delete Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Request/Pay Buttons */}
        <View style={styles.requestPayContainer}>
          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyActivityContainer}>
            <Text style={styles.emptyActivityText}>
              No recent activity with this contact
            </Text>
          </View>
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
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  contentContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  contactName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  contactEmail: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  splitifyStatus: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  actionButtons: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  deleteButton: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  requestPayContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  requestButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  requestButtonText: {
    color: colors.gray900,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  payButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  payButtonText: {
    color: colors.black,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  activitySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  emptyActivityContainer: {
    paddingVertical: spacing.xl * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyActivityText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
    textAlign: "center",
  },
});

export default ContactDetailScreen;
