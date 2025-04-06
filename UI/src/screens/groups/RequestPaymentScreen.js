import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const RequestPaymentScreen = ({ navigation, route }) => {
  const { memberId, memberName, amount } = route.params;
  const [requestAmount, setRequestAmount] = useState(amount.replace("$", ""));
  const [note, setNote] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    // In a real app, this would send the request to the server
    setRequestSent(true);

    // Navigate back after a short delay
    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["right", "left", "top", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Request Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.memberName}>Requesting from: {memberName}</Text>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount to request</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={requestAmount}
              onChangeText={setRequestAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.gray400}
            />
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            placeholderTextColor={colors.gray400}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <MaterialIcons
                name="account-balance"
                size={24}
                color={colors.gray800}
              />
              <Text style={styles.paymentMethodText}>Bank Transfer</Text>
            </View>
            <MaterialIcons
              name="check-circle"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <MaterialIcons name="payment" size={24} color={colors.gray800} />
              <Text style={styles.paymentMethodText}>Credit Card</Text>
            </View>
            <MaterialIcons
              name="radio-button-unchecked"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <MaterialIcons
                name="smartphone"
                size={24}
                color={colors.gray800}
              />
              <Text style={styles.paymentMethodText}>Mobile Payment</Text>
            </View>
            <MaterialIcons
              name="radio-button-unchecked"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!requestAmount || parseFloat(requestAmount) <= 0) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSendRequest}
          disabled={!requestAmount || parseFloat(requestAmount) <= 0}
        >
          <Text style={styles.sendButtonText}>Send Request</Text>
        </TouchableOpacity>
      </View>

      {/* Success Toast */}
      {requestSent && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Payment Request Sent!</Text>
          <TouchableOpacity
            style={styles.closeToastButton}
            onPress={() => setRequestSent(false)}
          >
            <MaterialIcons name="close" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>
      )}
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
    padding: spacing.lg,
  },
  memberName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  currencySymbol: {
    fontSize: typography.fontSize.lg,
    color: colors.gray900,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    paddingVertical: spacing.md,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 100,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  paymentMethodsContainer: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginLeft: spacing.md,
  },
  bottomContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  sendButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  toastContainer: {
    position: "absolute",
    bottom: 120,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toastText: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  closeToastButton: {
    padding: spacing.xs,
  },
});

export default RequestPaymentScreen;
