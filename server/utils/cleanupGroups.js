const mongoose = require("mongoose");
const Group = require("../models/Group");
require("dotenv").config();

/**
 * This script cleans up all groups by removing invalid participant entries
 */
const cleanupInvalidGroupParticipants = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");

    console.log("Fetching all groups...");
    const groups = await Group.find();
    console.log(`Found ${groups.length} groups`);

    let totalCleaned = 0;
    let groupsCleaned = 0;

    for (const group of groups) {
      const originalCount = group.participants.length;

      // Filter out participants with null or invalid user references
      group.participants = group.participants.filter(
        (p) => p && p.user && mongoose.Types.ObjectId.isValid(p.user)
      );

      if (originalCount !== group.participants.length) {
        const removed = originalCount - group.participants.length;
        console.log(
          `Group ${group._id}: Removing ${removed} invalid participants`
        );

        await group.save();
        totalCleaned += removed;
        groupsCleaned++;
      }
    }

    console.log("===== CLEANUP SUMMARY =====");
    console.log(`Groups processed: ${groups.length}`);
    console.log(`Groups with invalid data: ${groupsCleaned}`);
    console.log(`Total invalid participants removed: ${totalCleaned}`);
    console.log("===========================");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanupInvalidGroupParticipants()
    .then(() => {
      console.log("Cleanup complete");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Cleanup failed:", err);
      process.exit(1);
    });
}

module.exports = { cleanupInvalidGroupParticipants };
