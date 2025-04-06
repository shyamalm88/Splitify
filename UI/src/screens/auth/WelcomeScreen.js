import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { Button, ButtonPlain } from "../../components";
import { colors, typography, spacing } from "../../theme/theme";

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>Splitify</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to Splitify</Text>
          <Text style={styles.subtitle}>
            The easiest way to split bills with friends and family
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.illustrationPlaceholder}>
            <Text style={styles.illustrationText}>
              Splitify makes splitting expenses simple!
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <ButtonPlain
          title="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
          style={styles.button}
          fullWidth
        />

        <ButtonPlain
          title="Log In"
          onPress={() => navigation.navigate("Login")}
          style={[
            styles.button,
            {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: colors.primary,
            },
          ]}
          textStyle={{ color: colors.primary }}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginTop: spacing.xl * 2,
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  titleContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray600,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  illustrationPlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: colors.gray200,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  illustrationText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray700,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});

export default WelcomeScreen;
