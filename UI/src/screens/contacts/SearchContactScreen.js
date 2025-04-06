import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const SearchContactScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

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
  ];

  // Focus input on mount
  React.useEffect(() => {
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter contacts based on search query
    const filtered = contactsData.filter(
      (contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.email.toLowerCase().includes(text.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    searchInputRef.current.focus();
  };

  const handleContactSelect = (contact) => {
    navigation.navigate("ContactDetail", { contact });
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactSelect(item)}
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
      <MaterialIcons name="chevron-right" size={24} color={colors.gray400} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={24} color={colors.gray400} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <MaterialIcons name="clear" size={20} color={colors.gray500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {searchQuery.length > 0 && (
        <>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderContactItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No contacts found</Text>
            </View>
          )}
        </>
      )}

      {/* Keyboard */}
      <View style={styles.keyboardContainer}>
        {/* First Row */}
        <View style={styles.keyboardRow}>
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.keyboardKey}
              onPress={() => handleSearch(searchQuery + key)}
            >
              <Text style={styles.keyboardKeyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Second Row */}
        <View style={styles.keyboardRow}>
          {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.keyboardKey}
              onPress={() => handleSearch(searchQuery + key)}
            >
              <Text style={styles.keyboardKeyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Third Row */}
        <View style={styles.keyboardRow}>
          <TouchableOpacity style={styles.keyboardShiftKey}>
            <MaterialIcons
              name="arrow-upward"
              size={20}
              color={colors.gray900}
            />
          </TouchableOpacity>
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.keyboardKey}
              onPress={() => handleSearch(searchQuery + key)}
            >
              <Text style={styles.keyboardKeyText}>{key}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.keyboardDeleteKey}
            onPress={() => {
              if (searchQuery.length > 0) {
                handleSearch(searchQuery.slice(0, -1));
              }
            }}
          >
            <MaterialIcons name="backspace" size={20} color={colors.gray900} />
          </TouchableOpacity>
        </View>

        {/* Fourth Row */}
        <View style={styles.keyboardRow}>
          <TouchableOpacity style={styles.keyboardSpecialKey}>
            <Text style={styles.keyboardKeyText}>123</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keyboardSpaceKey}
            onPress={() => handleSearch(searchQuery + " ")}
          >
            <Text style={styles.keyboardKeyText}>space</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keyboardSpecialKey}
            onPress={() => {
              Keyboard.dismiss();
              if (searchResults.length > 0) {
                navigation.navigate("ContactDetail", {
                  contact: searchResults[0],
                });
              }
            }}
          >
            <Text style={styles.keyboardDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    marginLeft: spacing.xs,
    height: 40,
    color: colors.gray900,
  },
  resultsList: {
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
  noResultsContainer: {
    flex: 1,
    paddingTop: spacing.xl * 2,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
  keyboardContainer: {
    backgroundColor: colors.gray100,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  keyboardKey: {
    width: 32,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  keyboardKeyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  keyboardShiftKey: {
    width: 40,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  keyboardDeleteKey: {
    width: 40,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  keyboardSpecialKey: {
    width: 45,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  keyboardSpaceKey: {
    flex: 1,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  keyboardDoneText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default SearchContactScreen;
