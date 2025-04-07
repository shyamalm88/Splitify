import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { countries } from "../../config/countries";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const CountryPicker = ({ selectedCountry, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.phoneCode.includes(searchQuery)
  );

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        onSelect(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.phoneCode}>{item.phoneCode}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.selectedCountry}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedFlag}>{selectedCountry.flag}</Text>
        <Text style={styles.selectedPhoneCode}>
          {selectedCountry.phoneCode}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={colors.gray700}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={colors.gray700} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country or code"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedCountry: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minWidth: 100,
    height: 50,
  },
  selectedFlag: {
    fontSize: typography.fontSize.xl,
    marginRight: spacing.xs,
  },
  selectedPhoneCode: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginRight: spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
  },
  closeButton: {
    padding: spacing.xs,
  },
  searchInput: {
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.md,
  },
  countryList: {
    paddingHorizontal: spacing.lg,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  countryFlag: {
    fontSize: typography.fontSize.xl,
    marginRight: spacing.md,
  },
  countryName: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  phoneCode: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
});

export default CountryPicker;
