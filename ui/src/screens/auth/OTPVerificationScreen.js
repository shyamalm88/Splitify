import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber, sessionInfo, inDevMode } = route.params || {};
  const { login } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Timer for resend button
  useEffect(() => {
    if (timer > 0 && resendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
  }, [timer, resendDisabled]);

  // Show development mode OTP if in dev mode
  useEffect(() => {
    if (inDevMode) {
      Alert.alert("Dev Mode", `Use OTP: 123456 for development`);
    }
  }, [inDevMode]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber,
        code: otpCode,
        sessionInfo,
      });

      if (response.data.success) {
        // Store auth tokens
        await AsyncStorage.setItem("token", response.data.token);
        if (response.data.firebaseToken) {
          await AsyncStorage.setItem(
            "firebaseToken",
            response.data.firebaseToken
          );
        }

        // Update auth context
        login(response.data.user, response.data.token);

        // Navigate to home screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        setErrorMessage(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, {
        phoneNumber,
      });

      if (response.data.success) {
        // Reset timer and disable resend button
        setTimer(60);
        setResendDisabled(true);

        // Update session info from response
        const newSessionInfo = response.data.sessionInfo;
        route.params.sessionInfo = newSessionInfo;

        Alert.alert("Success", "OTP has been resent to your phone");

        if (response.data.inDevMode) {
          Alert.alert("Dev Mode", `Use OTP: 123456 for development`);
        }
      } else {
        setErrorMessage(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.heading}>Verify Your Phone</Text>
          <Text style={styles.subheading}>Enter the 6-digit code sent to</Text>
          <Text style={styles.phoneText}>{phoneNumber}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={verifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            {resendDisabled ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={resendOtp} disabled={loading}>
                <Text style={styles.resendButton}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.changeNumber}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.changeNumberText}>Change Phone Number</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  phoneText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 20,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#5465ff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#5465ff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: 24,
    alignItems: "center",
  },
  resendText: {
    color: "#666",
    fontSize: 14,
  },
  timerText: {
    color: "#999",
    fontSize: 14,
  },
  resendButton: {
    color: "#5465ff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  changeNumber: {
    marginTop: 40,
  },
  changeNumberText: {
    color: "#5465ff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default OtpVerificationScreen;
