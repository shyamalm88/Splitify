import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";

// Mock data for payments
const paymentData = [
  {
    id: "1",
    name: "Andrew Ainsley",
    group: "Dinner",
    amount: 365.5,
    date: "Today",
  },
  {
    id: "2",
    name: "Allison Schuster",
    amount: 142.5,
    date: "Today",
  },
  {
    id: "3",
    name: "Andrew Ainsley",
    group: "Trip",
    amount: 534.75,
    date: "Yesterday",
  },
  {
    id: "4",
    name: "Geoffrey Mart",
    amount: 167.5,
    date: "Yesterday",
  },
];

const PayScreen = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notes, setNotes] = useState("");

  // Get unique dates from payment data
  const getUniqueDates = () => {
    const dates = paymentData.map((item) => item.date);
    return [...new Set(dates)];
  };

  // Handle pay button press
  const handlePayPress = (item) => {
    setSelectedPayment(item);
    setShowConfirmModal(true);
  };

  // Handle confirm payment
  const handleConfirmPayment = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  // Handle modal close
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setSelectedPayment(null);
    setNotes("");
    navigation.goBack();
  };

  // Format current date
  const getCurrentDate = () => {
    const date = new Date();
    return `Dec ${date.getDate()}, ${date.getFullYear()} · ${date.getHours()}:${date.getMinutes()} AM`;
  };

  // Generate random transaction ID
  const generateTransactionId = () => {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Pay</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Payment List */}
      <ScrollView style={styles.paymentsContainer}>
        {getUniqueDates().map((date) => (
          <View key={date}>
            {/* Date Header */}
            <View style={styles.dateHeaderContainer}>
              <Text style={styles.dateHeader}>{date}</Text>
            </View>

            {/* Payment Items for this date */}
            {paymentData
              .filter((item) => item.date === date)
              .map((item) => (
                <View key={item.id} style={styles.paymentItem}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{item.name}</Text>
                    {item.group && (
                      <Text style={styles.paymentGroup}>{item.group}</Text>
                    )}
                  </View>
                  <View style={styles.paymentAmount}>
                    <Text style={styles.amountText}>
                      ${item.amount.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={() => handlePayPress(item)}
                    >
                      <Text style={styles.payButtonText}>Pay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Pay</Text>

            <View style={styles.amountContainer}>
              <Text style={styles.modalLabel}>Amount</Text>
              <Text style={styles.modalAmount}>
                ${selectedPayment?.amount.toFixed(2)}
              </Text>
              <Text style={styles.modalSubtext}>
                Your available balance: $9,567.50
              </Text>
            </View>

            <View style={styles.payToContainer}>
              <Text style={styles.modalLabel}>Pay To</Text>
              <View style={styles.userContainer}>
                <View style={styles.userAvatarContainer}>
                  <Text style={styles.userAvatarText}>
                    {selectedPayment?.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{selectedPayment?.name}</Text>
                  <Text style={styles.userEmail}>
                    {selectedPayment?.name.toLowerCase().replace(" ", "") +
                      "@gmail.com"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.notesContainer}>
              <Text style={styles.modalLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Dinner Delights Group Payments"
                placeholderTextColor={colors.gray500}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.confirmButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={false}
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <SafeAreaView
          style={styles.successModalContainer}
          edges={["top", "right", "left", "bottom"]}
        >
          <View style={styles.successHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseSuccess}
              activeOpacity={0.6}
            >
              <MaterialIcons name="close" size={28} color={colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.receiptScrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.receiptContentContainer}
          >
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check" size={40} color={colors.white} />
            </View>

            <Text style={styles.successAmount}>
              ${selectedPayment?.amount.toFixed(2)}
            </Text>

            <Text style={styles.paidToText}>
              Paid to {selectedPayment?.name}
            </Text>
            <Text style={styles.emailText}>
              {selectedPayment?.name.toLowerCase().replace(" ", "") +
                "@gmail.com"}
            </Text>

            <View style={styles.receiptContainer}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>You have paid</Text>
                <Text style={styles.receiptValue}>
                  ${selectedPayment?.amount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>To</Text>
                <Text style={styles.receiptValue}>{selectedPayment?.name}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Email</Text>
                <Text style={styles.receiptValue}>
                  {selectedPayment?.name.toLowerCase().replace(" ", "") +
                    "@gmail.com"}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date</Text>
                <Text style={styles.receiptValue}>{getCurrentDate()}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Transaction ID</Text>
                <View style={styles.idContainer}>
                  <Text style={styles.receiptValue}>
                    {generateTransactionId()}
                  </Text>
                  <MaterialIcons
                    name="content-copy"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Reference ID</Text>
                <View style={styles.idContainer}>
                  <Text style={styles.receiptValue}>H37SKC9V</Text>
                  <MaterialIcons
                    name="content-copy"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Notes</Text>
                <Text style={styles.receiptValue}>
                  {notes || "Dinner Delights Group Payments"}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Download Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.messageFab}>
          <MaterialIcons name="chat" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addFab}>
          <MaterialIcons name="add" size={24} color={colors.white} />
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  paymentsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  dateHeaderContainer: {
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  dateHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  paymentGroup: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginTop: 2,
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  payButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    width: 80,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  payButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  fabContainer: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  messageFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    ...shadows.md,
  },
  addFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  modalAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  modalSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  payToContainer: {
    marginBottom: spacing.lg,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  userAvatarText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  notesContainer: {
    marginBottom: spacing.xl,
  },
  notesInput: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray800,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
  },
  confirmButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  successModalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  successHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    padding: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: borderRadius.full,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: spacing.xl,
  },
  successAmount: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  paidToText: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    textAlign: "center",
  },
  emailText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  receiptScrollContainer: {
    flex: 1,
    marginBottom: spacing.md,
  },
  receiptContentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  receiptContainer: {
    marginBottom: spacing.md,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  receiptLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  receiptValue: {
    fontSize: typography.fontSize.sm,
    color: colors.gray900,
    fontWeight: typography.fontWeight.medium,
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingTop: 0,
  },
  downloadButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  downloadButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
  },
  shareButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
});

export default PayScreen;
