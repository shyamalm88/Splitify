import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const DeleteGroupConfirmScreen = ({ navigation, route }) => {
  const { groupId } = route.params;

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDeleteGroup = () => {
    // In a real app, this would make an API call to delete the group
    // Navigate back to the groups list
    navigation.navigate("Groups", { deletedGroup: true });
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <MaterialIcons
          name="delete"
          size={48}
          color={colors.error}
          style={styles.deleteIcon}
        />
        <Text style={styles.modalTitle}>Delete Group</Text>
        <Text style={styles.modalText}>
          Are you sure you want to delete the group "Trip to Japan"?
        </Text>
        <Text style={styles.modalWarning}>
          This action cannot be undone and all expense data for this group will
          be permanently deleted.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteGroup}
          >
            <Text style={styles.deleteButtonText}>Yes, Delete Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteIcon: {
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  modalText: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  modalWarning: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cancelButtonText: {
    color: colors.gray900,
    fontSize: typography.fontSize.md,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
});

export default DeleteGroupConfirmScreen;
