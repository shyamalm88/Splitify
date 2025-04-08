import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";
import { useGroup } from "../../services/groupService";

const AddExpenseScreen = ({ navigation, route }) => {
  const { groupId, onSave } = route.params;
  const { token, user } = useAuth();

  // Fetch group data to get members and categories
  const { data: groupData, isLoading: isLoadingGroup } = useGroup(
    token,
    groupId
  );

  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dropdown state
  const [openCategory, setOpenCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  // Split state
  const [splits, setSplits] = useState([]);
  const [splitMode, setSplitMode] = useState("equal"); // equal, percentage, custom

  // Prepare category data for dropdown
  useEffect(() => {
    if (groupData?.categories) {
      const categoryOptions = groupData.categories.map((cat) => ({
        label: cat,
        value: cat,
      }));
      if (categoryOptions.length > 0) {
        setCategories([
          ...categoryOptions,
          { label: "Uncategorized", value: "Uncategorized" },
        ]);
      } else {
        setCategories([
          { label: "Food", value: "Food" },
          { label: "Transportation", value: "Transportation" },
          { label: "Housing", value: "Housing" },
          { label: "Entertainment", value: "Entertainment" },
          { label: "Other", value: "Other" },
          { label: "Uncategorized", value: "Uncategorized" },
        ]);
      }
    }
  }, [groupData]);

  // Initialize splits based on group members
  useEffect(() => {
    if (groupData?.members) {
      // Set up initial equal splits
      const memberSplits = groupData.members.map((member) => ({
        user: member.id,
        name: member.name,
        amount: 0, // Will be calculated
      }));
      setSplits(memberSplits);
    }
  }, [groupData]);

  // Calculate splits whenever amount or split mode changes
  useEffect(() => {
    if (!amount || !splits.length) return;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return;

    let newSplits = [...splits];

    if (splitMode === "equal") {
      // Equal split among all members
      const perPersonAmount = numericAmount / newSplits.length;
      newSplits = newSplits.map((split) => ({
        ...split,
        amount: parseFloat(perPersonAmount.toFixed(2)),
      }));
    } else if (splitMode === "percentage") {
      // Keep current percentages but update amounts
      // This is handled separately as users can adjust percentages manually
    } else if (splitMode === "custom") {
      // Keep custom amounts as they are
    }

    setSplits(newSplits);
  }, [amount, splitMode, groupData?.members?.length]);

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // Handle save
  const handleSave = () => {
    // Validate input
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the expense");
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    // Validate that splits add up to total amount
    const totalSplits = splits.reduce((sum, split) => sum + split.amount, 0);
    const numericAmount = parseFloat(amount);

    // Allow a small tolerance for floating point errors
    if (Math.abs(totalSplits - numericAmount) > 0.01) {
      Alert.alert(
        "Error",
        `The splits don't add up to the total amount. Total: ${numericAmount}, Splits: ${totalSplits.toFixed(2)}`
      );
      return;
    }

    // Prepare expense data
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category: category || "Uncategorized",
      date,
      notes,
      splits: splits.map((split) => ({
        user: split.user,
        amount: split.amount,
      })),
    };

    // Call the onSave callback from route params
    if (onSave) {
      onSave(expenseData);
      navigation.goBack();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };

  // Toggle split mode
  const toggleSplitMode = () => {
    const modes = ["equal", "percentage", "custom"];
    const currentIndex = modes.indexOf(splitMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setSplitMode(modes[nextIndex]);
  };

  // Update a specific split
  const updateSplit = (index, amount) => {
    const newSplits = [...splits];
    newSplits[index] = {
      ...newSplits[index],
      amount: parseFloat(amount) || 0,
    };
    setSplits(newSplits);
  };

  if (isLoadingGroup) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading group data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="What was this expense for?"
              placeholderTextColor={colors.gray400}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>
                {groupData?.currency || "$"}
              </Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.gray400}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Category Dropdown */}
          <View style={[styles.inputGroup, { zIndex: 1000 }]}>
            <Text style={styles.label}>Category</Text>
            <DropDownPicker
              open={openCategory}
              value={category}
              items={categories}
              setOpen={setOpenCategory}
              setValue={setCategory}
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainerStyle}
              placeholder="Select a category"
            />
          </View>

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={colors.gray700}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about this expense"
              placeholderTextColor={colors.gray400}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Split Section */}
          <View style={styles.splitSection}>
            <View style={styles.splitHeader}>
              <Text style={styles.splitTitle}>Split Details</Text>
              <TouchableOpacity onPress={toggleSplitMode}>
                <Text style={styles.splitModeButton}>
                  {splitMode === "equal"
                    ? "Equal Split"
                    : splitMode === "percentage"
                      ? "Percentage Split"
                      : "Custom Split"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.splitsContainer}>
              {splits.map((split, index) => (
                <View key={split.user} style={styles.splitItem}>
                  <Text style={styles.splitName}>{split.name}</Text>
                  {splitMode === "equal" ? (
                    <Text style={styles.splitAmount}>
                      {groupData?.currency || "$"}
                      {split.amount.toFixed(2)}
                    </Text>
                  ) : (
                    <TextInput
                      style={styles.splitAmountInput}
                      value={split.amount.toString()}
                      onChangeText={(value) => updateSplit(index, value)}
                      keyboardType="decimal-pad"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  cancelButton: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
  saveButton: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  formContainer: {
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  currencySymbol: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  dropdownStyle: {
    borderColor: colors.gray300,
    height: 48,
  },
  dropdownContainerStyle: {
    borderColor: colors.gray300,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  dateText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: spacing.sm,
  },
  splitSection: {
    marginTop: spacing.md,
  },
  splitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  splitTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  splitModeButton: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  splitsContainer: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  splitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  splitName: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
  },
  splitAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
  },
  splitAmountInput: {
    width: 80,
    height: 36,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    textAlign: "right",
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
});

export default AddExpenseScreen;
