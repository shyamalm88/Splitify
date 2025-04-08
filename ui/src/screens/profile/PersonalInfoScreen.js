import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const PersonalInfoScreen = ({ navigation }) => {
  const [name, setName] = useState("Andrew Ainsley");
  const [phone, setPhone] = useState("+1 (415) 555-0128");
  const [dob, setDob] = useState("10/27/1995");
  const [gender, setGender] = useState("Male");

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
        <Text style={styles.title}>Personal Info</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
          </View>
        </View>

        {/* Full Name */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
          </View>
        </View>

        {/* Activity Audits - Read Only */}
        <View style={styles.readOnlySection}>
          <Text style={styles.sectionLabel}>Activity Audits</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>Email</Text>
            <Text style={styles.readOnlyValue}>andrew.ainsley@gmail.com</Text>
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryText}>🇺🇸</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TouchableOpacity style={styles.dateContainer}>
            <Text style={styles.dateText}>{dob}</Text>
            <MaterialIcons
              name="calendar-today"
              size={20}
              color={colors.gray700}
            />
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Gender</Text>
          <TouchableOpacity style={styles.genderContainer}>
            <Text style={styles.genderText}>{gender}</Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color={colors.gray700}
            />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.white,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  scrollContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  input: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  readOnlySection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  readOnlyBox: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  readOnlyText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  readOnlyValue: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  phoneContainer: {
    flexDirection: "row",
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  countryCode: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: colors.gray300,
  },
  countryText: {
    fontSize: typography.fontSize.lg,
  },
  phoneInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  dateText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  genderText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  saveButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.black,
  },
});

export default PersonalInfoScreen;
