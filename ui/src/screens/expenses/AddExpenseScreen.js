import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, TextField, Header, Avatar } from "../../components";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const CATEGORIES = [
  { id: "1", name: "Food & Drink", icon: "🍔" },
  { id: "2", name: "Entertainment", icon: "🎬" },
  { id: "3", name: "Transportation", icon: "🚗" },
  { id: "4", name: "Shopping", icon: "🛍️" },
  { id: "5", name: "Utilities", icon: "💡" },
  { id: "6", name: "Travel", icon: "✈️" },
  { id: "7", name: "Home", icon: "🏠" },
  { id: "8", name: "Other", icon: "📦" },
];

const FRIENDS = [
  { id: "1", name: "Jane Smith" },
  { id: "2", name: "Mike Johnson" },
  { id: "3", name: "Sarah Williams" },
  { id: "4", name: "David Brown" },
  { id: "5", name: "Emily Davis" },
];

const AddExpenseScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [splitEqually, setSplitEqually] = useState(true);
  const [customSplits, setCustomSplits] = useState({});

  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [friendsError, setFriendsError] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryError("");
  };

  const handleFriendToggle = (friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.some((f) => f.id === friend.id);
      if (isSelected) {
        const updated = prev.filter((f) => f.id !== friend.id);
        // Remove custom split for this friend if exists
        const newCustomSplits = { ...customSplits };
        delete newCustomSplits[friend.id];
        setCustomSplits(newCustomSplits);
        return updated;
      } else {
        return [...prev, friend];
      }
    });
    setFriendsError("");
  };

  const handleSplitTypeToggle = () => {
    setSplitEqually(!splitEqually);
    if (splitEqually) {
      // Initialize custom splits with equal values
      const totalFriends = selectedFriends.length + 1; // +1 for the current user
      const equalShare = 100 / totalFriends;

      const initialSplits = {};
      selectedFriends.forEach((friend) => {
        initialSplits[friend.id] = equalShare.toFixed(2);
      });
      setCustomSplits(initialSplits);
    }
  };

  const handleCustomSplitChange = (friendId, value) => {
    setCustomSplits((prev) => ({
      ...prev,
      [friendId]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Please enter a title");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!amount) {
      setAmountError("Please enter an amount");
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError("Please enter a valid amount");
      isValid = false;
    } else {
      setAmountError("");
    }

    if (!selectedCategory) {
      setCategoryError("Please select a category");
      isValid = false;
    } else {
      setCategoryError("");
    }

    if (selectedFriends.length === 0) {
      setFriendsError("Please select at least one friend");
      isValid = false;
    } else {
      setFriendsError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save expense logic here
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Expense"
        leftIcon={<Text style={styles.backButton}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <TextField
              label="Title"
              placeholder="What is this expense for?"
              value={title}
              onChangeText={setTitle}
              error={titleError}
            />

            <TextField
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              error={amountError}
              leftIcon={<Text style={styles.currencySymbol}>$</Text>}
            />

            <TextField
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Category</Text>
              {categoryError ? (
                <Text style={styles.errorText}>{categoryError}</Text>
              ) : null}

              <View style={styles.categoryContainer}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      selectedCategory?.id === category.id &&
                        styles.selectedCategoryItem,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryName,
                        selectedCategory?.id === category.id &&
                          styles.selectedCategoryName,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Split With</Text>
              {friendsError ? (
                <Text style={styles.errorText}>{friendsError}</Text>
              ) : null}

              <View style={styles.friendsContainer}>
                {FRIENDS.map((friend) => (
                  <TouchableOpacity
                    key={friend.id}
                    style={[
                      styles.friendItem,
                      selectedFriends.some((f) => f.id === friend.id) &&
                        styles.selectedFriendItem,
                    ]}
                    onPress={() => handleFriendToggle(friend)}
                  >
                    <Avatar name={friend.name} size="small" />
                    <Text style={styles.friendName}>{friend.name}</Text>
                    {selectedFriends.some((f) => f.id === friend.id) && (
                      <View style={styles.checkmark}>
                        <Text>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.splitHeader}>
                <Text style={styles.sectionTitle}>Split Method</Text>
                <View style={styles.splitToggle}>
                  <TouchableOpacity
                    style={[
                      styles.splitToggleButton,
                      splitEqually && styles.splitToggleButtonActive,
                    ]}
                    onPress={() => setSplitEqually(true)}
                  >
                    <Text
                      style={[
                        styles.splitToggleText,
                        splitEqually && styles.splitToggleTextActive,
                      ]}
                    >
                      Equal
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.splitToggleButton,
                      !splitEqually && styles.splitToggleButtonActive,
                    ]}
                    onPress={() => setSplitEqually(false)}
                  >
                    <Text
                      style={[
                        styles.splitToggleText,
                        !splitEqually && styles.splitToggleTextActive,
                      ]}
                    >
                      Custom
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!splitEqually && selectedFriends.length > 0 && (
                <View style={styles.customSplitContainer}>
                  <View style={styles.splitItem}>
                    <Avatar name="You" size="small" />
                    <Text style={styles.splitName}>You</Text>
                    <TextField
                      value={(
                        100 -
                        Object.values(customSplits).reduce(
                          (sum, val) => sum + Number(val || 0),
                          0
                        )
                      ).toFixed(2)}
                      editable={false}
                      style={styles.splitInput}
                      inputStyle={styles.splitInputText}
                      rightIcon={<Text style={styles.percentText}>%</Text>}
                    />
                  </View>

                  {selectedFriends.map((friend) => (
                    <View key={friend.id} style={styles.splitItem}>
                      <Avatar name={friend.name} size="small" />
                      <Text style={styles.splitName}>{friend.name}</Text>
                      <TextField
                        keyboardType="numeric"
                        value={customSplits[friend.id] || ""}
                        onChangeText={(value) =>
                          handleCustomSplitChange(friend.id, value)
                        }
                        style={styles.splitInput}
                        inputStyle={styles.splitInputText}
                        rightIcon={<Text style={styles.percentText}>%</Text>}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TextField
              label="Note (Optional)"
              placeholder="Add a note about this expense"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Add Expense"
              onPress={handleSubmit}
              size="large"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  form: {
    marginBottom: spacing.xl,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs / 2,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.xs / 2,
    marginBottom: spacing.xs,
  },
  selectedCategoryItem: {
    backgroundColor: colors.transparentPrimary,
  },
  categoryIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.xs,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
  },
  selectedCategoryName: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  friendsContainer: {
    marginTop: spacing.xs,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  selectedFriendItem: {
    backgroundColor: colors.transparentPrimary,
  },
  friendName: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    marginLeft: spacing.md,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  splitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  splitToggle: {
    flexDirection: "row",
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  splitToggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  splitToggleButtonActive: {
    backgroundColor: colors.primary,
  },
  splitToggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  splitToggleTextActive: {
    color: colors.white,
  },
  customSplitContainer: {
    marginTop: spacing.sm,
  },
  splitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  splitName: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    flex: 1,
    marginLeft: spacing.md,
  },
  splitInput: {
    width: 100,
    marginBottom: 0,
  },
  splitInputText: {
    textAlign: "right",
  },
  percentText: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  currencySymbol: {
    fontSize: typography.fontSize.lg,
    color: colors.gray700,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
});

export default AddExpenseScreen;
