import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";

const LogoutConfirmScreen = ({ navigation }) => {
  const { logout } = useAuth();

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Close the modal first
        navigation.goBack();
        // Let the auth state change trigger the navigation
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.confirmText}>Are you sure want to log out?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Yes, Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  confirmText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
  },
});

export default LogoutConfirmScreen;
