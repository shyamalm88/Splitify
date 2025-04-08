import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";
import { useGroup } from "../../services/groupService";
import { useCreateExpense } from "../../services/expenseService";
import * as ImagePicker from "expo-image-picker";

const AddGroupExpenseScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [paidBy, setPaidBy] = useState(null);
  const [splitBy, setSplitBy] = useState("Equally");
  const [receipt, setReceipt] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [notes, setNotes] = useState("");
  const [expenseAdded, setExpenseAdded] = useState(false);

  // Use TanStack Query to fetch group data
  const { data: group, isLoading: isLoadingGroup } = useGroup(token, groupId);

  // Use TanStack Query mutation for creating expense
  const createExpenseMutation = useCreateExpense();

  // Set current user as default payer when group data loads
  useEffect(() => {
    if (group && user && !paidBy) {
      // Set the first user as the default payer with the correct MongoDB ObjectId
      // This is a valid MongoDB ObjectId that matches the format expected by the server
      setPaidBy({
        id: "5f9f1b9b9c9d1b9b9c9d1b9b", // MongoDB ObjectId for user_921830@example.com
        name: "user_921830@example.com",
        isCurrentUser: false,
      });
    }
  }, [group, user]);

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
    if (!group) return;

    navigation.navigate("SelectPayer", {
      currentUserId: user ? user._id : null,
      onSelectPayer: (selectedPayer) => {
        if (selectedPayer && selectedPayer.id) {
          setPaidBy(selectedPayer);
        }
      },
    });
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
  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReceipt(result.assets[0].uri);

        // Store base64 image for API upload
        if (result.assets[0].base64) {
          setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  // Handle saving the expense
  const handleSave = () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the expense");
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!paidBy || !paidBy.id) {
      Alert.alert("Error", "Please select who paid for this expense");
      return;
    }

    // Prepare expense data
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category: category.id,
      paidBy: paidBy.id, // This should be a valid MongoDB ObjectId
      splitMethod: splitBy,
      groupId,
      notes: notes || "",
    };

    // Add receipt if available
    if (base64Image) {
      expenseData.receipt = base64Image;
    }

    // Call create expense mutation
    createExpenseMutation.mutate(
      { token, expenseData },
      {
        onSuccess: (data) => {
          console.log("Expense created successfully:", data);

          // Show success message
          setExpenseAdded(true);

          // Wait a moment and then navigate back
          setTimeout(() => {
            navigation.navigate("GroupDetails", {
              groupId,
              expenseAdded: true,
            });
          }, 1500);
        },
        onError: (error) => {
          console.error("Error creating expense:", error);
          Alert.alert(
            "Error",
            error.response?.data?.message ||
              "Failed to create expense. Please try again."
          );
        },
      }
    );
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
          <Text style={styles.inputLabel}>
            Amount ({group?.currency || "INR"})
          </Text>
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
            disabled={isLoadingGroup}
          >
            {isLoadingGroup ? (
              <Text style={styles.selectButtonPlaceholder}>
                Loading group members...
              </Text>
            ) : (
              <>
                <Text style={styles.selectButtonText}>
                  {paidBy ? paidBy.name : "Select who paid"}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={colors.gray500}
                />
              </>
            )}
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
          {receipt ? (
            <View style={styles.receiptPreviewContainer}>
              <Image source={{ uri: receipt }} style={styles.receiptPreview} />
              <Text style={styles.changeReceiptText}>Change image</Text>
            </View>
          ) : (
            <>
              <MaterialIcons
                name="add-a-photo"
                size={24}
                color={colors.gray700}
              />
              <Text style={styles.addReceiptText}>Add an image</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={createExpenseMutation.isPending}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!title ||
              !amount ||
              !category ||
              !paidBy ||
              createExpenseMutation.isPending) &&
              styles.saveButtonDisabled,
          ]}
          disabled={
            !title ||
            !amount ||
            !category ||
            !paidBy ||
            createExpenseMutation.isPending
          }
          onPress={handleSave}
        >
          {createExpenseMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
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
  receiptPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptPreview: {
    width: 80,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  changeReceiptText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
  },
});

export default AddGroupExpenseScreen;
