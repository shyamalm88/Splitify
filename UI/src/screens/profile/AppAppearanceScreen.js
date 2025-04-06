import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const AppAppearanceScreen = ({ navigation }) => {
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
        <Text style={styles.title}>App Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Theme Option */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate("Theme")}
        >
          <Text style={styles.optionText}>Theme</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>Light</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </View>
        </TouchableOpacity>

        {/* App Language Option */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate("AppLanguage")}
        >
          <Text style={styles.optionText}>App Language</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>English (US)</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </View>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingTop: spacing.md,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  optionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
    marginRight: spacing.xs,
  },
});

export default AppAppearanceScreen;
