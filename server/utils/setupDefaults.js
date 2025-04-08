const Category = require("../models/Category");
const Group = require("../models/Group");
const mongoose = require("mongoose");

/**
 * Clean up invalid participants in groups
 * This function removes participants with null user references
 */
exports.cleanupGroupParticipants = async () => {
  try {
    console.log("Cleaning up invalid group participants...");

    // Find all groups
    const groups = await Group.find();
    let cleanedGroups = 0;

    for (const group of groups) {
      const originalParticipantCount = group.participants.length;

      // Filter out participants with null user references
      group.participants = group.participants.filter(
        (participant) =>
          participant &&
          participant.user &&
          mongoose.Types.ObjectId.isValid(participant.user)
      );

      if (group.participants.length !== originalParticipantCount) {
        await group.save();
        cleanedGroups++;
        console.log(
          `Cleaned group ${group._id}: Removed ${
            originalParticipantCount - group.participants.length
          } invalid participants`
        );
      }
    }

    console.log(`Cleaned up participants in ${cleanedGroups} groups`);
  } catch (error) {
    console.error("Error cleaning up group participants:", error);
  }
};

/**
 * Initialize default system categories
 * This function ensures system default categories exist in the database
 */
exports.initializeSystemCategories = async () => {
  try {
    console.log("Checking for system default categories...");

    // Define default system categories
    const defaultCategories = [
      { name: "Food & Drinks", icon: "restaurant" },
      { name: "Dining", icon: "local-dining" },
      { name: "Transportation", icon: "directions-car" },
      { name: "Accommodation", icon: "hotel" },
      { name: "Entertainment", icon: "movie" },
      { name: "Shopping", icon: "shopping-bag" },
      { name: "Groceries", icon: "local-grocery-store" },
      { name: "Bills & Utilities", icon: "receipt" },
      { name: "Utilities", icon: "power" },
      { name: "Rent/Apartment Bills", icon: "apartment" },
      { name: "Trip", icon: "flight" },
      { name: "Travel", icon: "card-travel" },
      { name: "Family", icon: "family-restroom" },
      { name: "Couple", icon: "favorite" },
      { name: "Event", icon: "event" },
      { name: "Friends", icon: "people" },
      { name: "Roommates", icon: "person" },
      { name: "Home", icon: "home" },
      { name: "Sports", icon: "sports-basketball" },
      { name: "Health", icon: "local-hospital" },
      { name: "Education", icon: "school" },
      { name: "Work", icon: "work" },
      { name: "Loans/IOUs", icon: "account-balance" },
      { name: "Other", icon: "more-horiz" },
    ];

    // For each default category, create it if it doesn't exist
    for (const cat of defaultCategories) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${cat.name}$`, "i") }, // Case insensitive search
        isSystemDefined: true,
      });

      if (!existingCategory) {
        await Category.create({
          name: cat.name,
          icon: cat.icon,
          isSystemDefined: true,
          createdBy: null, // No specific user for system categories
        });
        console.log(`Created system category: ${cat.name}`);
      }
    }

    // Count total system categories after initialization
    const systemCategoriesCount = await Category.countDocuments({
      isSystemDefined: true,
    });
    console.log(`Total system categories: ${systemCategoriesCount}`);
  } catch (error) {
    console.error("Error initializing system categories:", error);
  }
};

/**
 * Initialize all default data
 * This is the main function that should be called on server start
 */
exports.initializeDefaults = async () => {
  await exports.initializeSystemCategories();
  await exports.cleanupGroupParticipants();
  // Add other initialization functions here as needed
  console.log("Default data initialization complete.");
};
