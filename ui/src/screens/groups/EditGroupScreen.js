import React, { useState, useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";

const EditGroupScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [groupImage, setGroupImage] = useState(null);

  // Categories that can be selected for a group
  const categories = [
    { id: "1", name: "Trip", icon: "flight" },
    { id: "2", name: "Family", icon: "family-restroom" },
    { id: "3", name: "Couple", icon: "favorite" },
    { id: "4", name: "Event", icon: "event" },
    { id: "5", name: "Friends", icon: "people" },
    { id: "6", name: "Other", icon: "more-horiz" },
  ];

  // Currency options
  const currencies = [
    { id: "usd", name: "USD", symbol: "$" },
    { id: "eur", name: "EUR", symbol: "€" },
    { id: "gbp", name: "GBP", symbol: "£" },
    { id: "jpy", name: "JPY", symbol: "¥" },
    { id: "cad", name: "CAD", symbol: "CA$" },
  ];

  // Fetch group data
  useEffect(() => {
    // In a real app, this would be a fetch from an API or Redux store
    const mockGroup = {
      id: "1",
      name: "Trip to Japan 🇯🇵",
      description: "Vacationing with college friends in Japan",
      currency: "USD",
      categoryIds: ["1", "5"], // Trip, Friends
      image: null,
      members: [
        { id: "1", name: "Andrew Ainsley (You)", email: "andrew@example.com" },
        { id: "2", name: "Charlotte Hanlin", email: "charlotte@example.com" },
        { id: "3", name: "Darren Kahminski", email: "darren@example.com" },
        { id: "4", name: "Kevin Wilson", email: "kevin@example.com" },
        { id: "5", name: "Joseph Thames", email: "joseph@example.com" },
      ],
    };

    setGroup(mockGroup);
    setGroupName(mockGroup.name);
    setDescription(mockGroup.description);
    setCurrency(mockGroup.currency);
    setSelectedCategories(mockGroup.categoryIds);
    setGroupImage(mockGroup.image);
  }, [groupId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setGroupImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
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

  const handleSave = () => {
    // In a real app, this would save the updated group to an API or Redux store
    navigation.navigate("GroupDetail", {
      groupId,
      groupUpdated: true,
    });
  };

  const handleDeleteGroup = () => {
    navigation.navigate("DeleteGroupConfirm", { groupId });
  };

  const handleLeaveGroup = () => {
    navigation.navigate("LeaveGroupConfirm", { groupId });
  };

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>Edit Group</Text>
        <View style={{ width: 24 }} />
      </View>

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
              <Text style={styles.groupImageInitial}>
                {groupName.charAt(0)}
              </Text>
              <MaterialIcons
                name="edit"
                size={24}
                color={colors.white}
                style={styles.editIcon}
              />
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
              name={showCurrencyPicker ? "arrow-drop-up" : "arrow-drop-down"}
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
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategories.includes(category.id) &&
                    styles.selectedCategoryChip,
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <MaterialIcons
                  name={category.icon}
                  size={18}
                  color={
                    selectedCategories.includes(category.id)
                      ? colors.black
                      : colors.gray500
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category.id) &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group Members */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Group Members</Text>
          <View style={styles.membersContainer}>
            {group.members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitial}>
                    {member.name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.addMemberButton}>
            <MaterialIcons name="person-add" size={18} color={colors.gray800} />
            <Text style={styles.addMemberText}>Add Members</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.leaveGroupButton}
            onPress={handleLeaveGroup}
          >
            <MaterialIcons name="exit-to-app" size={18} color={colors.error} />
            <Text style={styles.leaveGroupText}>Leave Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteGroupButton}
            onPress={handleDeleteGroup}
          >
            <MaterialIcons name="delete" size={18} color={colors.error} />
            <Text style={styles.deleteGroupText}>Delete Group</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !groupName.trim() && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={!groupName.trim()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    height: 180,
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
    backgroundColor: colors.gray300,
  },
  groupImageInitial: {
    fontSize: 64,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.gray700,
    padding: spacing.xs,
    borderRadius: 16,
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
  membersContainer: {
    marginTop: spacing.xs,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  memberInitial: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  memberName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
  },
  addMemberText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.gray800,
  },
  dangerZone: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error + "50", // 50% opacity
    borderRadius: borderRadius.md,
    backgroundColor: colors.error + "10", // 10% opacity
  },
  dangerZoneTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.error,
    marginBottom: spacing.md,
  },
  leaveGroupButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  leaveGroupText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.error,
  },
  deleteGroupButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  deleteGroupText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.error,
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
  saveButton: {
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
  saveButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
});

export default EditGroupScreen;
