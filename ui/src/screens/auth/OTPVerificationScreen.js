import React, { useState, useContext, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { ButtonPlain, Header } from "../../components";
import { colors, typography, spacing } from "../../theme/theme";
import { AuthContext } from "../../navigation/RootNavigator";

const OTPVerificationScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const { signIn } = useContext(AuthContext);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    // Auto focus on first input
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text, index) => {
    // Make sure input is numeric
    if (!/^\d*$/.test(text)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-move to next input if this one is filled
    if (text !== "" && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    // Clear error when user types
    if (error) setError("");
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace/delete
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const verifyOtp = () => {
    const otpString = otp.join("");

    // Check if OTP is complete
    if (otpString.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    // In a real app, you would verify this OTP with a backend service
    // For demo purposes, we'll accept any 4-digit code
    if (otpString.length === 4) {
      // Sign in the user
      signIn();
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const resendOtp = () => {
    if (!canResend) return;

    // Reset the OTP fields
    setOtp(["", "", "", ""]);
    setError("");

    // Reset timer
    setTimer(60);
    setCanResend(false);

    // Auto focus on first input
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }

    // In a real app, you would call an API to resend the OTP
    // For demo, just restart the timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    return phone;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Verify Phone"
        leftIcon={<Text style={styles.backButton}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to {formatPhoneNumber(phoneNumber)}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={`otp-${index}`}
                ref={inputRefs[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <ButtonPlain
            title="Verify & Continue"
            onPress={verifyOtp}
            fullWidth
            style={styles.button}
          />

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={resendOtp}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
            )}
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: colors.gray50,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  button: {
    marginBottom: spacing.xl,
  },
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  timerText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
});

export default OTPVerificationScreen;
