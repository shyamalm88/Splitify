import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

// Walkthrough slides data
const slides = [
  {
    id: "1",
    title: "Split Expenses Easily",
    description:
      "Track and split expenses with friends, family, and roommates in seconds.",
    image: "https://placehold.co/600x400/FEBA17/FFFFFF/png?text=Split+Expenses",
  },
  {
    id: "2",
    title: "Send & Request Money",
    description:
      "Send money to friends or request payments with just a few taps.",
    image: "https://placehold.co/600x400/FEBA17/FFFFFF/png?text=Send+Money",
  },
  {
    id: "3",
    title: "Track Your Balances",
    description:
      "Keep track of who owes you and who you owe with our simple dashboard.",
    image: "https://placehold.co/600x400/FEBA17/FFFFFF/png?text=Track+Balances",
  },
  {
    id: "4",
    title: "Group Expenses",
    description:
      "Create groups for trips, roommates, or events to manage shared expenses.",
    image: "https://placehold.co/600x400/FEBA17/FFFFFF/png?text=Group+Expenses",
  },
];

const WalkthroughScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeWalkthrough();
    }
  };

  const handleSkip = () => {
    completeWalkthrough();
  };

  const completeWalkthrough = async () => {
    try {
      await AsyncStorage.setItem("walkthrough_completed", "true");
      navigation.replace("Welcome");
    } catch (error) {
      console.error("Error saving walkthrough status:", error);
      navigation.replace("Welcome");
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={0}
      />
      <View style={styles.footer}>
        <Pagination />
        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
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
  slide: {
    width,
    height: height * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
    marginBottom: spacing.xl,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  description: {
    fontSize: typography.fontSize.lg,
    color: colors.gray600,
    textAlign: "center",
    lineHeight: typography.lineHeight.lg,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray300,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    padding: spacing.md,
  },
  skipButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    minWidth: 120,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
});

export default WalkthroughScreen;
