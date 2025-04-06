import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
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

// Mock data for requests
const requestData = [
  {
    id: "1",
    name: "Maryland Winkles",
    group: "Expense",
    amount: 642.5,
    date: "Today",
  },
  {
    id: "2",
    name: "Andrew Ainsley",
    group: "Dinner",
    amount: 142.5,
    date: "Today",
  },
  {
    id: "3",
    name: "Damon Kulowski",
    amount: 208.4,
    date: "Yesterday",
  },
  {
    id: "4",
    name: "Andrew Ainsley",
    group: "Trip",
    amount: 534.75,
    date: "Yesterday",
  },
];

const RequestScreen = ({ navigation }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notes, setNotes] = useState("");

  // Get unique dates from request data
  const getUniqueDates = () => {
    const dates = requestData.map((item) => item.date);
    return [...new Set(dates)];
  };

  // Handle request button press
  const handleRequestPress = (item) => {
    setSelectedRequest(item);
    setShowConfirmModal(true);
  };

  // Handle confirm request
  const handleConfirmRequest = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  // Handle modal close
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setSelectedRequest(null);
    setNotes("");
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["right", "left", "top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Request</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Request List */}
      <ScrollView style={styles.requestsContainer}>
        {getUniqueDates().map((date) => (
          <View key={date}>
            {/* Date Header */}
            <View style={styles.dateHeaderContainer}>
              <Text style={styles.dateHeader}>{date}</Text>
            </View>

            {/* Request Items for this date */}
            {requestData
              .filter((item) => item.date === date)
              .map((item) => (
                <View key={item.id} style={styles.requestItem}>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{item.name}</Text>
                    {item.group && (
                      <Text style={styles.requestGroup}>{item.group}</Text>
                    )}
                  </View>
                  <View style={styles.requestAmount}>
                    <Text style={styles.amountText}>
                      ${item.amount.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={styles.requestButton}
                      onPress={() => handleRequestPress(item)}
                    >
                      <Text style={styles.requestButtonText}>Request</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* Request Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
          <View style={styles.modalContainer}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.modalTitle}>Request</Text>

              <View style={styles.amountContainer}>
                <Text style={styles.modalLabel}>Amount</Text>
                <Text style={styles.modalAmount}>
                  ${selectedRequest?.amount.toFixed(2)}
                </Text>
                <Text style={styles.modalSubtext}>
                  Your available balance: $9,567.50
                </Text>
              </View>

              <View style={styles.requestFromContainer}>
                <Text style={styles.modalLabel}>Request From</Text>
                <View style={styles.userContainer}>
                  <View style={styles.userAvatarContainer}>
                    <Text style={styles.userAvatarText}>
                      {selectedRequest?.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{selectedRequest?.name}</Text>
                    <Text style={styles.userEmail}>
                      {selectedRequest?.name.toLowerCase().replace(" ", "") +
                        "@gmail.com"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.notesContainer}>
                <Text style={styles.modalLabel}>Notes (optional)</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Request Expense Explorers Group Payment"
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
                  onPress={handleConfirmRequest}
                >
                  <Text style={styles.confirmButtonText}>Request Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Request Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={false}
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <View style={{ flex: 1 }}>
          <SafeAreaView
            style={styles.successModalContainer}
            edges={["top", "right", "left", "bottom"]}
          >
            <View style={styles.successHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseSuccess}
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                activeOpacity={0.6}
              >
                <MaterialIcons name="close" size={28} color={colors.black} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.successScrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.successContentContainer}
            >
              <View style={styles.successIconContainer}>
                <MaterialIcons name="check" size={40} color={colors.white} />
              </View>

              <Text style={styles.successAmount}>
                ${selectedRequest?.amount.toFixed(2)}
              </Text>

              <Text style={styles.successMessage}>Request Has Been Sent!</Text>

              <Text style={styles.successDetail}>
                Your request for money has been sent to {selectedRequest?.name}.
              </Text>

              <View style={styles.receiptContainer}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>You requested</Text>
                  <Text style={styles.receiptValue}>
                    ${selectedRequest?.amount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>From</Text>
                  <Text style={styles.receiptValue}>
                    {selectedRequest?.name}
                  </Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Email</Text>
                  <Text style={styles.receiptValue}>
                    {selectedRequest?.name.toLowerCase().replace(" ", "") +
                      "@gmail.com"}
                  </Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Notes</Text>
                  <Text style={styles.receiptValue}>
                    {notes || "Request Expense Explorers Group Payment"}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Share Request</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
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
  requestsContainer: {
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
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  requestGroup: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginTop: 2,
  },
  requestAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  requestButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    width: 80,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  requestButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
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
  requestFromContainer: {
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
    padding: spacing.lg,
    zIndex: 10,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  successScrollContainer: {
    flex: 1,
  },
  successContentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  successAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  successDetail: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    textAlign: "center",
  },
  receiptContainer: {
    marginBottom: spacing.lg,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  receiptLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  receiptValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
  },
  shareButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
});

export default RequestScreen;
