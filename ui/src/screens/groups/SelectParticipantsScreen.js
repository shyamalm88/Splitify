import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";
import { useCreateGroup, useUpdateGroup } from "../../services/groupService";

const SelectParticipantsScreen = ({ navigation, route }) => {
  const groupData = route.params || {};
  const { token, user, isAuthenticated } = useAuth();
  const [contactsData, setContactsData] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Determine if we're adding to an existing group or creating a new one
  const isExistingGroup = !!groupData.groupId;

  // Use the create group mutation
  const createGroupMutation = useCreateGroup();
  // Use the update group mutation
  const updateGroupMutation = useUpdateGroup();

  const isProcessing =
    createGroupMutation.isPending || updateGroupMutation.isPending;

  // Debug route params
  useEffect(() => {
    console.log("Group data from route params:", groupData);
    console.log("Is existing group:", isExistingGroup);
  }, [groupData, isExistingGroup]);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setAuthError(true);
      Alert.alert(
        "Authentication Required",
        "Please log in to create a group",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    }
  }, [isAuthenticated, navigation]);

  // State to keep track of selected contacts
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Fetch contacts from the API
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      try {
        // In a real app, this would be a call to get user contacts
        // For now, we'll use sample data
        const sampleContacts = [
          {
            id: "1",
            name: "Alexis Hershey",
            email: "alexis.hershey@gmail.com",
            avatar: null,
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

        // Simulate API call
        setTimeout(() => {
          setContactsData(sampleContacts);
          setIsLoadingContacts(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setIsLoadingContacts(false);
        Alert.alert("Error", "Failed to load contacts. Please try again.");
      }
    };

    fetchContacts();
  }, []);

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

  const handleSaveParticipants = async () => {
    // Check authentication before proceeding
    if (!isAuthenticated()) {
      Alert.alert("Authentication Required", "Please log in to continue", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
      return;
    }

    // Validate if this is a new group creation
    if (!isExistingGroup && (!groupData || !groupData.groupName)) {
      Alert.alert("Error", "Group name is required");
      return;
    }

    // Get the mock MongoDB ObjectId for development
    const devObjectId = "5f9f1b9b9c9d1b9b9c9d1b9b";

    try {
      if (isExistingGroup) {
        // Adding participants to existing group
        console.log(
          `Adding participants to existing group: ${groupData.groupId}`
        );

        // Prepare participants data for API
        const participantsPayload = {
          participants: selectedContacts.map((contactId) => devObjectId),
          paidBy: user ? user.id : devObjectId, // Use devObjectId as fallback if user is undefined
        };

        // Use the mutation to update group
        updateGroupMutation.mutate(
          {
            token,
            groupId: groupData.groupId,
            groupData: participantsPayload,
          },
          {
            onSuccess: (updatedGroup) => {
              console.log("Participants added successfully:", updatedGroup);
              // Navigate back to group details
              navigation.goBack();
            },
            onError: (error) => {
              console.error("Error adding participants:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "Failed to add participants. Please try again."
              );
            },
          }
        );
      } else {
        // Creating a new group
        // Check if image is too large (500KB limit)
        const imageSizeLimit = 500 * 1024 * 1000; // 500KB in bytes
        let processedGroupImage = null;

        if (groupData.groupImage) {
          // Estimate the size of the base64 image (base64 string length * 0.75 is approximate size in bytes)
          const estimatedImageSize = groupData.groupImage.length * 0.75;

          if (estimatedImageSize > imageSizeLimit) {
            console.warn(
              `Image is too large (${Math.round(estimatedImageSize / 1024)}KB). Skipping image upload.`
            );
            // Optionally show an alert about the image being too large
            Alert.alert(
              "Warning",
              "The selected image is too large and will not be uploaded. The group will be created without an image.",
              [{ text: "Continue Anyway" }]
            );
          } else {
            processedGroupImage = groupData.groupImage;
          }
        }

        // Prepare data for API with default values for missing fields
        const groupPayload = {
          name: groupData.groupName,
          description: groupData.description || "",
          currency: groupData.currency || "INR",
          categories: groupData.categories || [],
          // For dev mode, use consistent ObjectIds
          participants: selectedContacts.map((contactId) => devObjectId),
          paidBy: user ? user.id : devObjectId, // Use devObjectId as fallback if user is undefined
          // Only include image if it's processed and not too large
          ...(processedGroupImage ? { groupImage: processedGroupImage } : {}),
        };

        console.log("Sending group payload:", {
          ...groupPayload,
          groupImage: processedGroupImage
            ? `[Base64 image: ${Math.round((processedGroupImage.length * 0.75) / 1024)}KB]`
            : undefined,
        });

        // Use the mutation to create group
        createGroupMutation.mutate(
          { token, groupData: groupPayload },
          {
            onSuccess: (newGroup) => {
              console.log("Group created successfully:", newGroup);
              // Navigate to success screen
              navigation.navigate("GroupCreationSuccess", { group: newGroup });
            },
            onError: (error) => {
              console.error("Error creating group:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "Failed to create group. Please try again."
              );
            },
          }
        );
      }
    } catch (error) {
      console.error("Error processing group operation:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Operation failed. Please try again."
      );
    }
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

      {isLoadingContacts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : (
        <>
          {/* Contacts List */}
          <FlatList
            data={contactsData}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contactsList}
          />

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
                styles.createButton,
                (selectedContacts.length === 0 || isProcessing) &&
                  styles.disabledButton,
              ]}
              onPress={handleSaveParticipants}
              disabled={selectedContacts.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={colors.black} />
              ) : (
                <Text style={styles.createButtonText}>
                  {isExistingGroup ? "Add to Group" : "Create Group"}
                </Text>
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

export default SelectParticipantsScreen;
