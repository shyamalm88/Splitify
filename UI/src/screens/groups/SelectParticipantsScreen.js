import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const SelectParticipantsScreen = ({ navigation, route }) => {
  const groupData = route.params;

  // Sample contacts data (in a real app, this would be fetched from the API or redux store)
  const contactsData = [
    {
      id: "1",
      name: "Alexis Hershey",
      email: "alexis.hershey@gmail.com",
      avatar: null, // This would be a URL in a real app
    },
    {
      id: "2",
      name: "Allison Schroeder",
      email: "allison.schro@gmail.com",
      avatar: null,
    },
    {
      id: "3",
      name: "Augustine Nguyen",
      email: "augustine.n@gmail.com",
      avatar: null,
    },
    {
      id: "4",
      name: "Charlotte Hanlin",
      email: "charlotte.hanlin@gmail.com",
      avatar: null,
    },
    {
      id: "5",
      name: "Danny Schekowski",
      email: "danny.sch@gmail.com",
      avatar: null,
    },
    {
      id: "6",
      name: "Florence Dominca",
      email: "florence.d@gmail.com",
      avatar: null,
    },
    {
      id: "7",
      name: "Geoffrey Nott",
      email: "geoffrey.nott@gmail.com",
      avatar: null,
    },
  ];

  // State to keep track of selected contacts
  const [selectedContacts, setSelectedContacts] = useState([]);

  const toggleContactSelection = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreateGroup = () => {
    // Create a new group with selected contacts
    const newGroup = {
      ...groupData,
      members: selectedContacts.map((id) => {
        const contact = contactsData.find((c) => c.id === id);
        return {
          id: contact.id,
          name: contact.name,
          email: contact.email,
        };
      }),
      id: Date.now().toString(), // Generate a unique ID for the group
    };

    // Navigate back to groups screen with new group info
    navigation.navigate("Groups", { newGroup, newGroupAdded: true });
  };

  const renderContactItem = ({ item }) => {
    const isSelected = selectedContacts.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => toggleContactSelection(item.id)}
      >
        <View style={styles.contactInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactEmail}>{item.email}</Text>
          </View>
        </View>
        <MaterialIcons
          name={isSelected ? "check-circle" : "radio-button-unchecked"}
          size={24}
          color={isSelected ? colors.primary : colors.gray400}
        />
      </TouchableOpacity>
    );
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
        <Text style={styles.title}>Select Participants</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Selected Count */}
      <View style={styles.selectedCountContainer}>
        <Text style={styles.selectedCountText}>
          {selectedContacts.length === 0
            ? "No Contacts Selected"
            : `${selectedContacts.length} ${
                selectedContacts.length === 1 ? "Contact" : "Contacts"
              } Selected`}
        </Text>
      </View>

      {/* Contacts List */}
      <FlatList
        data={contactsData}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactsList}
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.createButton,
            selectedContacts.length === 0 && styles.disabledButton,
          ]}
          onPress={handleCreateGroup}
          disabled={selectedContacts.length === 0}
        >
          <Text style={styles.createButtonText}>Create</Text>
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
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  selectedCountContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.gray100,
  },
  selectedCountText: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  contactsList: {
    paddingHorizontal: spacing.lg,
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
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  contactDetails: {
    justifyContent: "center",
  },
  contactName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
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
  createButton: {
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
  createButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
});

export default SelectParticipantsScreen;
