import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import { Button, TextField, Header } from "../../components";
import { colors, typography, spacing } from "../../theme/theme";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = () => {
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      setIsSubmitted(true);
      // In a real app, here you would call an API to send the reset email
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reset Password"
        leftIcon={<Text style={styles.backButton}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {!isSubmitted ? (
            <>
              <Text style={styles.title}>Forgot your password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your
                password
              </Text>

              <View style={styles.form}>
                <TextField
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  error={emailError}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                size="large"
                fullWidth
                style={styles.button}
              />
            </>
          ) : (
            <>
              <View style={styles.successContainer}>
                <Text style={styles.title}>Check your inbox</Text>
                <Text style={styles.subtitle}>
                  We've sent a password reset link to {email}
                </Text>

                <Text style={styles.instructionText}>
                  If you don't see the email in your inbox, please check your
                  spam folder.
                </Text>
              </View>

              <Button
                title="Back to Login"
                onPress={handleBackToLogin}
                size="large"
                fullWidth
                style={styles.button}
              />
            </>
          )}
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
  backButton: {
    fontSize: 24,
    color: colors.gray800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray600,
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.xl,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: spacing.xl * 2,
  },
  instructionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    marginTop: spacing.lg,
  },
});

export default ForgotPasswordScreen;
