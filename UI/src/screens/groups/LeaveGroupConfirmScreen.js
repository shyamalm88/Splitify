import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const LeaveGroupConfirmScreen = ({ navigation, route }) => {
  const { groupId } = route.params;

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleLeaveGroup = () => {
    // In a real app, this would make an API call to leave the group
    // Navigate back to the groups list
    navigation.navigate("Groups", { leftGroup: true });
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Leave Group</Text>
        <Text style={styles.modalText}>
          Are you sure you want to leave the group "Trip to Japan"?
        </Text>
        <Text style={styles.modalWarning}>
          You will no longer have access to this group's expenses and chat
          history.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveGroup}
          >
            <Text style={styles.leaveButtonText}>Yes, Leave Group</Text>
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
  leaveButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  leaveButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
});

export default LeaveGroupConfirmScreen;
