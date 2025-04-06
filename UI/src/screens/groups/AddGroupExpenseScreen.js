import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const AddGroupExpenseScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [paidBy, setPaidBy] = useState("You");
  const [splitBy, setSplitBy] = useState("Equally");
  const [receipt, setReceipt] = useState(null);
  const [notes, setNotes] = useState("");
  const [expenseAdded, setExpenseAdded] = useState(false);

  // Mock group members for the "Paid By" selection
  const groupMembers = [
    { id: "1", name: "You (Andrew Ainsley)" },
    { id: "2", name: "Charlotte Hanlin" },
    { id: "3", name: "Darren Kahminski" },
    { id: "4", name: "Kevin Wilson" },
    { id: "5", name: "Joseph Thames" },
  ];

  // Handle category selection
  const handleSelectCategory = () => {
    navigation.navigate("SelectCategory", {
      onSelectCategory: (selectedCategory) => {
        setCategory(selectedCategory);
      },
      currentCategory: category,
    });
  };

  // Handle paid by selection
  const handleSelectPaidBy = () => {
    // In a real app, this would navigate to a selection screen
    // For now, we'll just toggle between two options
    setPaidBy(paidBy === "You" ? "Charlotte Hanlin" : "You");
  };

  // Handle split by selection
  const handleSelectSplitBy = () => {
    navigation.navigate("SplitBy", {
      groupId,
      amount: parseFloat(amount) || 0,
      onSelectSplitMethod: (method) => {
        setSplitBy(method);
      },
      currentSplitMethod: splitBy,
    });
  };

  // Handle adding an image/receipt
  const handleAddImage = () => {
    // In a real app, this would use image picker
    // For now, we'll just set a mock receipt image
    setReceipt("https://example.com/mock-receipt.jpg");
  };

  // Handle saving the expense
  const handleSave = () => {
    // Show success message
    setExpenseAdded(true);

    // Wait a moment and then navigate back
    setTimeout(() => {
      navigation.navigate("GroupDetail", {
        groupId,
        expenseAdded: true,
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Expense</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.formContainer}>
        {/* Title */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Japanese Grocery Shopping"
            placeholderTextColor={colors.gray400}
          />
        </View>

        {/* Amount */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount (USD $)</Text>
          <TextInput
            style={styles.textInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.gray400}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Category */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectCategory}
          >
            <View style={styles.selectButtonContent}>
              {category ? (
                <>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <MaterialIcons
                      name={category.icon || "category"}
                      size={20}
                      color={colors.black}
                    />
                  </View>
                  <Text style={styles.selectButtonText}>{category.name}</Text>
                </>
              ) : (
                <Text style={styles.selectButtonPlaceholder}>
                  Select a Category
                </Text>
              )}
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray500}
            />
          </TouchableOpacity>
        </View>

        {/* Paid By */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Paid by</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectPaidBy}
          >
            <Text style={styles.selectButtonText}>{paidBy}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray500}
            />
          </TouchableOpacity>
        </View>

        {/* Split By */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Split by</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectSplitBy}
          >
            <Text style={styles.selectButtonText}>{splitBy}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray500}
            />
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes..."
            placeholderTextColor={colors.gray400}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Add Receipt */}
        <TouchableOpacity
          style={styles.addReceiptButton}
          onPress={handleAddImage}
        >
          <MaterialIcons name="add-a-photo" size={24} color={colors.gray700} />
          <Text style={styles.addReceiptText}>Add an image</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!title || !amount) && styles.saveButtonDisabled,
          ]}
          disabled={!title || !amount}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Success Toast */}
      {expenseAdded && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>New Expense Added!</Text>
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
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  formContainer: {
    flex: 1,
    padding: spacing.lg,
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
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: spacing.sm,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  selectButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  selectButtonPlaceholder: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
  addReceiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  addReceiptText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.full,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  saveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  saveButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  toastContainer: {
    position: "absolute",
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  toastText: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
});

export default AddGroupExpenseScreen;
