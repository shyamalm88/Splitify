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

const LinkedAccountsScreen = ({ navigation }) => {
  const accounts = [
    {
      id: "1",
      name: "Google",
      iconName: "mail",
      color: "#DB4437",
      status: "connected",
    },
    {
      id: "2",
      name: "Apple",
      iconName: "laptop-mac",
      color: "#000000",
      status: "connected",
    },
    {
      id: "3",
      name: "Facebook",
      iconName: "facebook",
      color: "#3b5998",
      status: "connect",
    },
    {
      id: "4",
      name: "Twitter",
      iconName: "chat",
      color: "#1DA1F2",
      status: "connect",
    },
  ];

  const handleConnect = (id) => {
    console.log(`Connect to account ${id}`);
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
        <Text style={styles.title}>Linked Accounts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {accounts.map((account) => (
          <View key={account.id} style={styles.accountItem}>
            <View style={styles.accountInfo}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: account.color + "20" },
                ]}
              >
                <MaterialIcons
                  name={account.iconName}
                  size={24}
                  color={account.color}
                />
              </View>
              <Text style={styles.accountName}>{account.name}</Text>
            </View>

            {account.status === "connected" ? (
              <Text style={styles.connectedText}>Connected</Text>
            ) : (
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnect(account.id)}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Why link accounts?</Text>
          <Text style={styles.infoText}>
            Linking your accounts allows for easier login and account recovery.
            We will never post to your social media accounts without your
            permission.
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
    padding: spacing.lg,
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  accountName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  connectedText: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
  connectButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  connectButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  infoContainer: {
    marginTop: spacing.xl,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: typography.fontSize.md * 1.4,
  },
});

export default LinkedAccountsScreen;
