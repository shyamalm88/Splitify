import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import expoAuth from "../../config/expo-firebase";
import { useAuth } from "../../context/AuthContext";
import NavigationService from "../../components/NavigationService";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";

const OTPVerificationScreen = () => {
  const route = useRoute();
  const { login } = useAuth();

  // Get params passed from LoginScreen
  const { phoneNumber, sessionInfo, inDevMode } = route.params || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpPreFilled, setOtpPreFilled] = useState(false);

  // Create refs for each OTP input
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-populate OTP for dev mode - only if explicitly enabled and not already prefilled
    if (inDevMode === true && !otpPreFilled) {
      const devOtp = "123456";
      setOtp(devOtp.split(""));
      setOtpPreFilled(true);
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [inDevMode, otpPreFilled]);

  const handleOtpChange = (value, index) => {
    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error message when typing
    if (errorMessage) {
      setErrorMessage("");
    }

    // Auto-focus next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    // Handle backspace - move to previous input
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await expoAuth.verifyOTP(otpCode);

      if (result.success) {
        // Call login function from AuthContext with user data and token
        await login(result.user, result.token);
      } else {
        setErrorMessage(result.error || "Invalid verification code");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    // Clear previous OTP fields when requesting a new code
    setOtp(["", "", "", "", "", ""]);
    // Reset prefilled flag so dev mode can autofill again if needed
    setOtpPreFilled(false);

    try {
      const result = await expoAuth.sendOTP(phoneNumber);

      if (result.success) {
        // Reset timer
        setTimeLeft(60);
      } else {
        setErrorMessage(result.error || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setErrorMessage("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = useCallback(() => {
    NavigationService.goBack();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent
      />
      <ImageBackground
        source={{ uri: "https://placehold.co/FEBA17/FFFFFF/png" }}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Verify Your Number</Text>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <Text style={styles.subheading}>
            Enter the 6-digit code sent to {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleOtpKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {timeLeft > 0
                ? `Resend code in ${timeLeft}s`
                : "Didn't receive the code?"}
            </Text>
            {timeLeft === 0 && (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  headerBackground: {
    width: "100%",
    height: 120,
    marginTop: -1, // Fix for Android to ensure no gap at the top
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: 40,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    flex: 1,
    textAlign: "center",
    marginRight: 24, // To offset the back button width and center the text
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    alignItems: "center",
  },
  subheading: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    textAlign: "center",
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.md,
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  resendText: {
    color: colors.gray600,
    fontSize: typography.fontSize.md,
  },
  resendLink: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  backButton: {
    padding: spacing.sm,
  },
});

export default OTPVerificationScreen;
