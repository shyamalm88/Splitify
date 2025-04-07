import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const ContactDeletedScreen = ({ navigation }) => {
  // Automatically return to contacts screen after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Contacts");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <MaterialIcons name="check" size={36} color={colors.white} />
        </View>
        <Text style={styles.successText}>Contact deleted</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    alignItems: "center",
    padding: spacing.xl,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
  },
});

export default ContactDeletedScreen;
