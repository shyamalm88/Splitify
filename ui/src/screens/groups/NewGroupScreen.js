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
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "../../config/constants";
import { useAuth } from "../../context/AuthContext";

const NewGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { token, user, isAuthenticated } = useAuth();

  // Fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          // Use default categories if not authenticated
          setCategories(defaultCategories);
          setIsLoadingCategories(false);
          return;
        }

        const response = await axios.get(`${API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error("Error fetching categories:", response.data.error);
          // Fallback to default categories if API fails
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to default categories if API fails
        setCategories(defaultCategories);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [token, isAuthenticated]);

  // Default categories as fallback
  const defaultCategories = [
    { _id: "1", name: "Trip", icon: "flight" },
    { _id: "2", name: "Family", icon: "family-restroom" },
    { _id: "3", name: "Couple", icon: "favorite" },
    { _id: "4", name: "Event", icon: "event" },
    { _id: "5", name: "Friends", icon: "people" },
    { _id: "6", name: "Other", icon: "more-horiz" },
  ];

  // Currency options
  const currencies = [
    { id: "inr", name: "INR", symbol: "₹" },
    { id: "usd", name: "USD", symbol: "$" },
    { id: "eur", name: "EUR", symbol: "€" },
    { id: "gbp", name: "GBP", symbol: "£" },
    { id: "jpy", name: "JPY", symbol: "¥" },
    { id: "cad", name: "CAD", symbol: "CA$" },
  ];

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true, // Enable base64 encoding for easy upload
      });

      if (!result.canceled) {
        // Create a data URL with the base64 data
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setGroupImage(base64Image);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleCurrencySelect = (currencyCode) => {
    setCurrency(currencyCode);
    setShowCurrencyPicker(false);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // Check if name is provided
    if (!groupName.trim()) {
      Alert.alert("Error", "Please provide a group name.");
      return;
    }

    // Move to select participants screen
    navigation.navigate("SelectParticipants", {
      groupName,
      description,
      currency,
      categories: selectedCategories,
      groupImage,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>New Group</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoadingCategories ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.formContainer}>
            {/* Group Image */}
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {groupImage ? (
                <Image
                  source={{ uri: groupImage }}
                  style={styles.groupImage}
                  onError={() => {
                    // If image fails to load, set the image to null
                    setGroupImage(null);
                  }}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons
                    name="add-a-photo"
                    size={24}
                    color={colors.gray500}
                  />
                  <Text style={styles.imagePlaceholderText}>
                    Upload Group Image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Group Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Group Name"
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor={colors.gray400}
              />
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textareaInput]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                placeholderTextColor={colors.gray400}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Currency Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Currency</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
              >
                <Text style={styles.pickerButtonText}>{currency}</Text>
                <MaterialIcons
                  name={
                    showCurrencyPicker ? "arrow-drop-up" : "arrow-drop-down"
                  }
                  size={24}
                  color={colors.gray500}
                />
              </TouchableOpacity>

              {showCurrencyPicker && (
                <View style={styles.currencyOptions}>
                  {currencies.map((curr) => (
                    <TouchableOpacity
                      key={curr.id}
                      style={[
                        styles.currencyOption,
                        currency === curr.name && styles.selectedCurrencyOption,
                      ]}
                      onPress={() => handleCurrencySelect(curr.name)}
                    >
                      <Text
                        style={[
                          styles.currencyOptionText,
                          currency === curr.name &&
                            styles.selectedCurrencyOptionText,
                        ]}
                      >
                        {curr.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Category Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category._id) &&
                        styles.selectedCategoryChip,
                    ]}
                    onPress={() => toggleCategory(category._id)}
                  >
                    <MaterialIcons
                      name={category.icon}
                      size={18}
                      color={
                        selectedCategories.includes(category._id)
                          ? colors.black
                          : colors.gray500
                      }
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategories.includes(category._id) &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !groupName.trim() && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!groupName.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.black} />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
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
  formContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  imageUpload: {
    width: "100%",
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    backgroundColor: colors.gray100,
  },
  groupImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
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
  textareaInput: {
    minHeight: 80,
    paddingTop: spacing.sm,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pickerButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  currencyOptions: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  currencyOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  selectedCurrencyOption: {
    backgroundColor: colors.primary + "20", // 20% opacity
  },
  currencyOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  selectedCurrencyOptionText: {
    fontWeight: typography.fontWeight.medium,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.xs,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray900,
    marginLeft: spacing.xs,
  },
  selectedCategoryText: {
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.full,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  continueButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  disabledButton: {
    backgroundColor: colors.gray300,
  },
  continueButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
});

export default NewGroupScreen;
