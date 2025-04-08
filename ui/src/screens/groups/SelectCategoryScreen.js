import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const SelectCategoryScreen = ({ navigation, route }) => {
  const { onSelectCategory, currentCategory } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  // Category data
  const categories = [
    {
      id: "1",
      name: "Groceries",
      icon: "local-grocery-store",
      color: colors.primary,
    },
    { id: "2", name: "Restaurant", icon: "restaurant", color: "#FF9800" },
    {
      id: "3",
      name: "Transportation",
      icon: "directions-car",
      color: "#2196F3",
    },
    { id: "4", name: "Shopping", icon: "shopping-bag", color: "#9C27B0" },
    { id: "5", name: "Entertainment", icon: "movie", color: "#E91E63" },
    { id: "6", name: "Housing", icon: "home", color: "#4CAF50" },
    { id: "7", name: "Utilities", icon: "bolt", color: "#607D8B" },
    { id: "8", name: "Travel", icon: "flight", color: "#00BCD4" },
    { id: "9", name: "Health", icon: "favorite", color: "#F44336" },
    { id: "10", name: "Sports", icon: "directions-run", color: "#FF5722" },
    { id: "11", name: "Education", icon: "school", color: "#3F51B5" },
    { id: "12", name: "Work", icon: "work", color: "#795548" },
    { id: "13", name: "Gifts", icon: "card-giftcard", color: "#FFEB3B" },
    { id: "14", name: "Music", icon: "music-note", color: "#673AB7" },
    { id: "15", name: "General", icon: "attach-money", color: "#9E9E9E" },
  ];

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    navigation.goBack();
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleSelectCategory(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={24} color={colors.white} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      {currentCategory && currentCategory.id === item.id && (
        <MaterialIcons name="check" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

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
        <Text style={styles.title}>Category</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={colors.gray500} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray400}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="cancel" size={20} color={colors.gray500} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  categoryName: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
});

export default SelectCategoryScreen;
