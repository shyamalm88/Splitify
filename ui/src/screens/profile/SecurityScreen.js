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

const SecurityScreen = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [safeAuthenticator, setSafeAuthenticator] = useState(false);
  const [googleAuthenticator, setGoogleAuthenticator] = useState(false);

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
        <Text style={styles.title}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Remember me */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Remember me</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={rememberMe ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() => toggleSwitch(rememberMe, setRememberMe)}
            value={rememberMe}
          />
        </View>

        {/* Face ID */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Face ID</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={faceId ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() => toggleSwitch(faceId, setFaceId)}
            value={faceId}
          />
        </View>

        {/* 2-Step Verification */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>2FA Authenticator</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={twoFactorAuth ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() => toggleSwitch(twoFactorAuth, setTwoFactorAuth)}
            value={twoFactorAuth}
          />
        </View>

        {/* Safe Authenticator */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Safe Authenticator</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={safeAuthenticator ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(safeAuthenticator, setSafeAuthenticator)
            }
            value={safeAuthenticator}
          />
        </View>

        {/* Google Authenticator */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Google Authenticator</Text>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={googleAuthenticator ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(googleAuthenticator, setGoogleAuthenticator)
            }
            value={googleAuthenticator}
          />
        </View>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Change Password")}
        >
          <Text style={styles.menuText}>Change Password</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.gray600}
          />
        </TouchableOpacity>

        {/* Device Management */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Device Management")}
        >
          <Text style={styles.menuText}>Device Management</Text>
          <View style={styles.menuDetail}>
            <Text style={styles.menuDetailText}>
              Manage devices with access to your account
            </Text>
            <MaterialIcons
              name="arrow-forward-ios"
              size={16}
              color={colors.gray600}
            />
          </View>
        </TouchableOpacity>

        {/* Deactivate Account */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Deactivate Account")}
        >
          <Text style={styles.menuText}>Deactivate Account</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.gray600}
          />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={[styles.menuItem, styles.dangerItem]}
          onPress={() => console.log("Delete Account")}
        >
          <Text style={styles.dangerText}>Delete Account</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.error}
          />
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
  menuItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  menuText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  menuDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuDetailText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    flex: 1,
    paddingRight: spacing.md,
  },
  dangerItem: {
    marginTop: spacing.md,
  },
  dangerText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
  },
});

export default SecurityScreen;
