import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";
import axios from "axios";
import { API_URL } from "../../config/constants";
import { useAuth } from "../../context/AuthContext";

const GroupSettingsScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { token, user, isAuthenticated } = useAuth();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setError(
        "Authentication required. Please log in to view group settings."
      );
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch group data
  useEffect(() => {
    // Skip if not authenticated
    if (!isAuthenticated()) {
      return;
    }

    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const groupData = response.data.data;
          setGroup(groupData);

          // Check if current user is the creator
          if (user && user.id && groupData.createdBy === user.id) {
            setIsCreator(true);
          }
        } else {
          setError(response.data.error || "Failed to load group details");
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
        setError("Failed to load group details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, token, user]);

  const handleEditGroup = () => {
    navigation.navigate("EditGroup", { group });
  };

  const handleLeaveGroup = () => {
    navigation.navigate("LeaveGroupConfirm", {
      groupId,
      groupName: group.name,
    });
  };

  const handleDeleteGroup = () => {
    navigation.navigate("DeleteGroupConfirm", {
      groupId,
      groupName: group.name,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading group settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            // If error is due to auth issue, navigate to login
            if (!isAuthenticated()) {
              navigation.navigate("Login");
            } else {
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.retryButtonText}>
            {!isAuthenticated() ? "Go to Login" : "Go Back"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Group Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Group Image and Name */}
        <View style={styles.groupHeader}>
          <View style={styles.groupImageContainer}>
            {group.groupImage ? (
              <Image
                source={{ uri: group.groupImage }}
                style={styles.groupImage}
              />
            ) : (
              <View
                style={[
                  styles.placeholderImage,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <MaterialIcons name="group" size={32} color={colors.gray800} />
              </View>
            )}
          </View>
          <Text style={styles.groupName}>{group.name}</Text>
          {group.description && (
            <Text style={styles.groupDescription}>{group.description}</Text>
          )}
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Group Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleEditGroup}
          >
            <MaterialIcons name="edit" size={24} color={colors.gray800} />
            <Text style={styles.settingText}>Edit Group</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              navigation.navigate("ManageParticipants", {
                groupId,
                participants: group.participants,
              })
            }
          >
            <MaterialIcons name="people" size={24} color={colors.gray800} />
            <Text style={styles.settingText}>Manage Participants</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              navigation.navigate("ManageCategories", {
                groupId,
                categories: group.categories,
              })
            }
          >
            <MaterialIcons name="category" size={24} color={colors.gray800} />
            <Text style={styles.settingText}>Manage Categories</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={colors.gray800}
            />
            <Text style={styles.settingText}>Notification Settings</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={styles.dangerItem}
            onPress={handleLeaveGroup}
          >
            <MaterialIcons name="logout" size={24} color={colors.error} />
            <Text style={styles.dangerText}>Leave Group</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray400}
            />
          </TouchableOpacity>

          {isCreator && (
            <TouchableOpacity
              style={styles.dangerItem}
              onPress={handleDeleteGroup}
            >
              <MaterialIcons name="delete" size={24} color={colors.error} />
              <Text style={styles.dangerText}>Delete Group</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.gray400}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Group Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Group Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created On</Text>
            <Text style={styles.infoValue}>
              {new Date(group.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Currency</Text>
            <Text style={styles.infoValue}>{group.currency}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Group ID</Text>
            <Text style={styles.infoValue}>{group._id}</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  groupHeader: {
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  groupImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  groupImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  groupName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  groupDescription: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    textAlign: "center",
  },
  settingsSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  settingText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.black,
    marginLeft: spacing.md,
  },
  dangerSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  dangerTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.error,
    marginBottom: spacing.md,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  dangerText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.error,
    marginLeft: spacing.md,
  },
  infoSection: {
    padding: spacing.lg,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: colors.gray800,
    fontWeight: typography.fontWeight.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
});

export default GroupSettingsScreen;
