import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const AppLanguageScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");

  const languages = [
    {
      id: "1",
      name: "English (US)",
      code: "en-US",
      flag: "🇺🇸",
    },
    {
      id: "2",
      name: "English (UK)",
      code: "en-GB",
      flag: "🇬🇧",
    },
    {
      id: "3",
      name: "Mandarin",
      code: "zh",
      flag: "🇨🇳",
    },
    {
      id: "4",
      name: "Spanish",
      code: "es",
      flag: "🇪🇸",
    },
    {
      id: "5",
      name: "Hindi",
      code: "hi",
      flag: "🇮🇳",
    },
    {
      id: "6",
      name: "French",
      code: "fr",
      flag: "🇫🇷",
    },
    {
      id: "7",
      name: "Arabic",
      code: "ar",
      flag: "🇦🇪",
    },
    {
      id: "8",
      name: "Russian",
      code: "ru",
      flag: "🇷🇺",
    },
    {
      id: "9",
      name: "Japanese",
      code: "ja",
      flag: "🇯🇵",
    },
  ];

  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language);
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
        <Text style={styles.title}>App Language</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.id}
            style={styles.languageOption}
            onPress={() => handleLanguageSelection(language.name)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.flag}>{language.flag}</Text>
              <Text style={styles.languageName}>{language.name}</Text>
            </View>
            {selectedLanguage === language.name && (
              <MaterialIcons name="check" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
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
  content: {
    flex: 1,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
});

export default AppLanguageScreen;
