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

const DataAnalyticsScreen = ({ navigation }) => {
  const [dataUsage, setDataUsage] = useState(true);
  const [personalization, setPersonalization] = useState(false);
  const [advertising, setAdvertising] = useState(true);

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
        <Text style={styles.title}>Data & Analytics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Data Usage */}
        <TouchableOpacity style={styles.settingSection}>
          <View>
            <Text style={styles.settingTitle}>Data Usage</Text>
            <Text style={styles.settingDescription}>
              Optimize app performance, prioritize content based on your
              preferences
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.gray600}
          />
        </TouchableOpacity>

        {/* All Preferences */}
        <TouchableOpacity style={styles.settingSection}>
          <View>
            <Text style={styles.settingTitle}>All Preferences</Text>
            <Text style={styles.settingDescription}>
              Manage your privacy settings, regulate data collection, and more
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.gray600}
          />
        </TouchableOpacity>

        {/* Download My Data */}
        <TouchableOpacity style={styles.settingSection}>
          <View>
            <Text style={styles.settingTitle}>Download My Data</Text>
            <Text style={styles.settingDescription}>
              Request a copy of your data. Your information is delivered
              securely
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.gray600}
          />
        </TouchableOpacity>

        {/* Personalization */}
        <View style={styles.toggleSection}>
          <View>
            <Text style={styles.toggleTitle}>Personalization</Text>
            <Text style={styles.toggleDescription}>
              Allow us to customize your experience in-app
            </Text>
          </View>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={personalization ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() =>
              toggleSwitch(personalization, setPersonalization)
            }
            value={personalization}
          />
        </View>

        {/* Advertising */}
        <View style={styles.toggleSection}>
          <View>
            <Text style={styles.toggleTitle}>Advertising</Text>
            <Text style={styles.toggleDescription}>
              Allow us to use your data for better ad targeting
            </Text>
          </View>
          <Switch
            trackColor={{ false: colors.gray300, true: colors.secondaryLight }}
            thumbColor={advertising ? colors.primary : colors.white}
            ios_backgroundColor={colors.gray300}
            onValueChange={() => toggleSwitch(advertising, setAdvertising)}
            value={advertising}
          />
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            We value your privacy and are committed to ensuring the security of
            your data. You can request a copy of all your personal data or
            delete it entirely at any time.
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
  settingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: typography.fontSize.md * 1.3,
    maxWidth: "90%",
  },
  toggleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  toggleTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  toggleDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: typography.fontSize.md * 1.3,
    maxWidth: "90%",
  },
  infoContainer: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: typography.fontSize.md * 1.4,
    textAlign: "center",
  },
});

export default DataAnalyticsScreen;
