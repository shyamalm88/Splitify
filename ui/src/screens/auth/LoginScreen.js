import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, ButtonPlain, TextField, Header } from "../../components";
import { colors, typography, spacing } from "../../theme/theme";
import { AuthContext } from "../../navigation/RootNavigator";
import { phoneAuth } from "../../config/firebase";

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (number) => {
    // Simple validation for phone number
    if (!number) {
      setPhoneNumberError("Phone number is required");
      return false;
    } else if (!/^\d{10}$/.test(number.replace(/\D/g, ""))) {
      setPhoneNumberError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneNumberError("");
    return true;
  };

  const handleLogin = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      try {
        setLoading(true);

        // Format phone number with country code (using +1 for US)
        const formattedPhone = `+1${phoneNumber.replace(/\D/g, "")}`;

        // Send verification code
        const result = await phoneAuth.sendVerificationCode(formattedPhone);

        setLoading(false);

        if (result.success) {
          // Navigate to OTP screen with the phone number and confirmation result
          navigation.navigate("OTPVerification", {
            phoneNumber: formattedPhone,
            confirmation: result.confirmation,
          });
        } else {
          Alert.alert(
            "Error",
            result.error ||
              "Failed to send verification code. Please try again."
          );
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Something went wrong. Please try again later.");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Log In"
        leftIcon={<Text style={styles.backButton}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to continue
          </Text>

          <View style={styles.form}>
            <TextField
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              error={phoneNumberError}
              keyboardType="phone-pad"
              disabled={loading}
            />
          </View>

          {/* Invisible reCAPTCHA container for Firebase Web Auth */}
          <View id="recaptcha-container" style={styles.recaptchaContainer} />

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : (
            <ButtonPlain
              title="Continue"
              onPress={handleLogin}
              fullWidth
              style={styles.button}
            />
          )}

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
  signupLink: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  loader: {
    marginBottom: spacing.xl,
  },
  recaptchaContainer: {
    height: 0,
    width: 0,
  },
});

export default LoginScreen;
