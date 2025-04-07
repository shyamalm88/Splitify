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

const ContactsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock contact data
  const contactsData = [
    {
      id: "1",
      name: "Alexis Hershey",
      email: "alexis.hershey@gmail.com",
      isFavorite: true,
    },
    {
      id: "2",
      name: "Allison Schroeder",
      email: "allison.schro@gmail.com",
      isFavorite: false,
    },
    {
      id: "3",
      name: "Augustine Nguyen",
      email: "augustine.n@gmail.com",
      isFavorite: false,
    },
    {
      id: "4",
      name: "Charlotte Hanlin",
      email: "charlotte.hanlin@gmail.com",
      isFavorite: true,
    },
    {
      id: "5",
      name: "Danny Schekowski",
      email: "danny.sch@gmail.com",
      isFavorite: false,
    },
    {
      id: "6",
      name: "Florence Dominca",
      email: "florence.d@gmail.com",
      isFavorite: true,
    },
    {
      id: "7",
      name: "Geoffrey Nott",
      email: "geoffrey.nott@gmail.com",
      isFavorite: true,
    },
    {
      id: "8",
      name: "Thomas Webb",
      email: "thomas.webb@gmail.com",
      isFavorite: true,
    },
    {
      id: "9",
      name: "Margaret Webbs",
      email: "margaret.webb@gmail.com",
      isFavorite: false,
    },
    {
      id: "10",
      name: "Anna Estremo",
      email: "anna.estremo@gmail.com",
      isFavorite: false,
    },
    {
      id: "11",
      name: "Ronald Eshmaro",
      email: "ronald.eshmaro@gmail.com",
      isFavorite: false,
    },
  ];

  // Filter contacts based on active tab
  const filteredContacts = contactsData.filter(
    (contact) =>
      activeTab === "all" || (activeTab === "favorites" && contact.isFavorite)
  );

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate("ContactDetail", { contact: item })}
    >
      <View style={styles.contactInfo}>
        <View style={styles.contactInitials}>
          <Text style={styles.initialsText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactEmail}>{item.email}</Text>
        </View>
      </View>
      {item.isFavorite && (
        <MaterialIcons name="star" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="more-vert" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("SearchContact")}
      >
        <MaterialIcons name="search" size={24} color={colors.gray400} />
        <Text style={styles.searchPlaceholder}>Search</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All Contacts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
          onPress={() => setActiveTab("favorites")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "favorites" && styles.activeTabText,
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactList}
      />

      {/* Add Contact FAB */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddContact")}
      >
        <MaterialIcons name="add" size={24} color={colors.black} />
      </TouchableOpacity>
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
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  searchPlaceholder: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
  activeTabText: {
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  contactList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  initialsText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  contactDetails: {
    justifyContent: "center",
  },
  contactName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  addButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ContactsScreen;
