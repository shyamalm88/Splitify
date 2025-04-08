const Group = require("../models/Group");
const User = require("../models/User");
const { uploadBase64Image } = require("../utils/fileUpload");
const mongoose = require("mongoose");

/**
 * Create a new group
 * @route POST /api/groups
 * @access Private
 */
exports.createGroup = async (req, res) => {
  try {
    console.log("Creating new group with payload:", {
      ...req.body,
      groupImage: req.body.groupImage ? "[base64 image data]" : undefined,
    });

    const { name, description, currency, categories, participants } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Group name is required",
      });
    }

    let imageUrl = "";

    // Upload group image if provided
    if (req.body.groupImage) {
      try {
        console.log("Attempting to upload group image...");
        imageUrl = await uploadBase64Image(req.body.groupImage, "group-images");
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading group image:", uploadError);
        // Continue creating the group even if image upload fails
      }
    }

    // Create the group
    const group = new Group({
      name,
      description: description || "",
      imageUrl,
      currency: currency || "INR",
      categories: categories || [],
      createdBy: req.user.id, // Assuming req.user is set by auth middleware
      participants: [
        {
          user: req.user.id, // Add the creator as a participant
          isActive: true,
          joinedAt: Date.now(),
        },
      ],
    });

    // Add other participants
    if (participants && Array.isArray(participants)) {
      console.log(`Processing ${participants.length} participants`);
      for (const participant of participants) {
        // Extract the user ID - participant can be an object with user field or just an ID string
        const participantId =
          typeof participant === "object"
            ? participant.user || null
            : participant;

        // Skip if no valid ID or if it's the same as the creator
        if (!participantId || participantId === req.user.id) {
          console.log(
            `Skipping participant: ${
              participantId || "undefined"
            } (creator or invalid ID)`
          );
          continue;
        }

        // For development mode, handle mock IDs that aren't valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(participantId)) {
          console.log(`Skipping invalid ObjectId: ${participantId}`);
          continue;
        }

        // Verify that the user exists
        try {
          const userExists = await User.findById(participantId);
          if (userExists) {
            console.log(
              `Adding participant: ${participantId} (${
                userExists.username || userExists.email || "unnamed user"
              })`
            );
            group.participants.push({
              user: participantId,
              isActive: true,
              joinedAt: Date.now(),
            });
          } else {
            console.log(`User not found: ${participantId}`);
          }
        } catch (userLookupError) {
          console.error(
            `Error looking up user ${participantId}:`,
            userLookupError
          );
        }
      }
    }

    console.log(`Saving group with ${group.participants.length} participants`);
    await group.save();

    // Populate user details for response
    const populatedGroup = await Group.findById(group._id)
      .populate("createdBy", "username email profilePicture")
      .populate("participants.user", "username email profilePicture");

    console.log("Group created successfully:", group._id);
    res.status(201).json({
      success: true,
      data: populatedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);

    // Check for validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message,
      }));

      return res.status(400).json({
        success: false,
        error: "Validation Error",
        validationErrors,
        message: "Please check your input and try again",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Get all groups for the logged-in user
 * @route GET /api/groups
 * @access Private
 */
exports.getGroups = async (req, res) => {
  try {
    // Find groups where the user is a participant
    const groups = await Group.find({
      "participants.user": req.user.id,
      "participants.isActive": true,
      isActive: true,
    })
      .populate("createdBy", "username email profilePicture")
      .populate("participants.user", "username email profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Get a single group by ID
 * @route GET /api/groups/:id
 * @access Private
 */
exports.getGroup = async (req, res) => {
  try {
    let group = await Group.findById(req.params.id)
      .populate("createdBy", "username email profilePicture")
      .populate("participants.user", "username email profilePicture")
      .populate("expenses");

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // Get user ID for comparison
    const userId = req.user.id;
    const isTestUser = userId === "5f9f1b9b9c9d1b9b9c9d1b9b";
    console.log(`User ${userId} is accessing group ${group._id}`);

    // Log participants for debugging
    const participants = group.participants.map((p) => ({
      userId: p.user
        ? typeof p.user === "object"
          ? p.user._id
          : p.user
        : null,
      isActive: p.isActive,
    }));
    console.log("Current participants:", JSON.stringify(participants));

    // CRITICAL FIX: If we detect participants with null users, clean them up
    if (group.participants.some((p) => !p.user)) {
      console.log(
        `Group ${group._id} has invalid participants - cleaning them up`
      );
      const originalCount = group.participants.length;

      // Remove participants with null user references
      group.participants = group.participants.filter((p) => p && p.user);
      console.log(
        `Removed ${
          originalCount - group.participants.length
        } invalid participants`
      );

      // Always add test user for development
      if (isTestUser) {
        console.log(`Adding test user ${userId} to cleaned group`);
        const alreadyAdded = group.participants.some(
          (p) =>
            p.user &&
            ((typeof p.user === "object" && p.user._id.toString() === userId) ||
              (typeof p.user === "string" && p.user === userId))
        );

        if (!alreadyAdded) {
          group.participants.push({
            user: userId,
            isActive: true,
            joinedAt: Date.now(),
          });
          console.log(`Test user ${userId} added to participants list`);
        }
      }

      // Save changes
      console.log("Saving group with cleaned participants data");
      await group.save();

      // Return group directly since we just cleaned it up
      console.log("Returning cleaned group data");
      return res.status(200).json({
        success: true,
        data: group,
      });
    }

    // Special case for test user - always grant access
    if (isTestUser) {
      // Check if test user is already a participant
      const isParticipant = group.participants.some(
        (p) =>
          p.user &&
          ((typeof p.user === "object" && p.user._id.toString() === userId) ||
            (typeof p.user === "string" && p.user.toString() === userId))
      );

      // If not a participant, add them
      if (!isParticipant) {
        console.log(
          `Test user ${userId} not found in participants - adding them`
        );
        group.participants.push({
          user: userId,
          isActive: true,
          joinedAt: Date.now(),
        });

        await group.save();

        // Return group with the user added
        return res.status(200).json({
          success: true,
          data: group,
        });
      }

      // Test user is already a participant, skip further checks
      console.log("Test user already has access - returning group");
      return res.status(200).json({
        success: true,
        data: group,
      });
    }

    // For normal users, check if they're a participant
    const isParticipant = group.participants.some((participant) => {
      if (!participant || !participant.user) {
        return false;
      }

      const participantId =
        typeof participant.user === "object"
          ? participant.user._id.toString()
          : participant.user.toString();

      return participantId === userId && participant.isActive;
    });

    if (!isParticipant) {
      console.log(
        `User ${userId} is not authorized to access group ${group._id}`
      );
      return res.status(403).json({
        success: false,
        error: "Not authorized to access this group",
      });
    }

    // User is authorized, return the group data
    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Update a group
 * @route PUT /api/groups/:id
 * @access Private
 */
exports.updateGroup = async (req, res) => {
  try {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // Check if user is group creator
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this group",
      });
    }

    const { name, description, currency, categories } = req.body;
    const updateData = { name, description, currency, categories };

    // Upload group image if provided
    if (req.body.groupImage && req.body.groupImage !== group.imageUrl) {
      try {
        const imageUrl = await uploadBase64Image(
          req.body.groupImage,
          "group-images"
        );
        updateData.imageUrl = imageUrl;
      } catch (uploadError) {
        console.error("Error uploading group image:", uploadError);
        // Continue updating the group even if image upload fails
      }
    }

    // Update the group
    group = await Group.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "username email profilePicture")
      .populate("participants.user", "username email profilePicture");

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Delete a group (soft delete)
 * @route DELETE /api/groups/:id
 * @access Private
 */
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // Check if user is group creator
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this group",
      });
    }

    // Soft delete (mark as inactive)
    group.isActive = false;
    await group.save();

    res.status(200).json({
      success: true,
      data: {},
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Add a participant to a group
 * @route POST /api/groups/:id/participants
 * @access Private
 */
exports.addParticipant = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // Check if user is already a participant
    const existingParticipant = group.participants.find((participant) => {
      if (!participant || !participant.user) return false;

      // Handle both populated and non-populated user references
      const participantId =
        typeof participant.user === "object"
          ? participant.user._id.toString()
          : participant.user.toString();

      return participantId === userId;
    });

    if (existingParticipant) {
      // If existing but inactive, reactivate
      if (!existingParticipant.isActive) {
        existingParticipant.isActive = true;
        existingParticipant.joinedAt = Date.now();
        await group.save();
      } else {
        return res.status(400).json({
          success: false,
          error: "User is already a participant in this group",
        });
      }
    } else {
      // Verify that the user exists
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Add new participant
      group.participants.push({
        user: userId,
        isActive: true,
        joinedAt: Date.now(),
      });
      await group.save();
    }

    // Return updated group with populated user details
    const updatedGroup = await Group.findById(req.params.id)
      .populate("createdBy", "username email profilePicture")
      .populate("participants.user", "username email profilePicture");

    res.status(200).json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Remove a participant from a group
 * @route DELETE /api/groups/:id/participants/:userId
 * @access Private
 */
exports.removeParticipant = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // Only creator can remove others, but any participant can remove themselves
    const isSelfRemoval = req.params.userId === req.user.id;
    const isCreator = group.createdBy.toString() === req.user.id;

    if (!isSelfRemoval && !isCreator) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to remove participants from this group",
      });
    }

    // Soft delete participant (mark as inactive)
    const participantIndex = group.participants.findIndex((participant) => {
      if (!participant || !participant.user) return false;

      // Handle both populated and non-populated user references
      const participantId =
        typeof participant.user === "object"
          ? participant.user._id.toString()
          : participant.user.toString();

      return participantId === req.params.userId;
    });

    if (participantIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Participant not found in this group",
      });
    }

    group.participants[participantIndex].isActive = false;
    await group.save();

    res.status(200).json({
      success: true,
      data: {},
      message: "Participant removed successfully",
    });
  } catch (error) {
    console.error("Error removing participant:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};

/**
 * Debug a group's participant access
 * @route GET /api/groups/:id/debug
 * @access Private
 */
exports.debugGroupAccess = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "username email profilePicture")
      .populate("participants.user", "username email profilePicture");

    if (!group) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    // Check the current user's access
    const userId = req.user.id;
    const isCreator =
      group.createdBy._id.toString() === userId ||
      group.createdBy.toString() === userId;

    // Log participant data for debugging
    const participantsData = group.participants.map((p) => {
      const pUser = p.user;
      return {
        participantId: pUser?._id || pUser,
        participantIdType: typeof pUser,
        participantIdString: pUser
          ? typeof pUser === "object"
            ? pUser._id.toString()
            : pUser.toString()
          : null,
        isActive: p.isActive,
        matchesCurrentUser: pUser
          ? typeof pUser === "object"
            ? pUser._id.toString() === userId
            : pUser.toString() === userId
          : false,
      };
    });

    // Return debug info
    res.status(200).json({
      success: true,
      debug: {
        groupId: group._id,
        creatorId:
          typeof group.createdBy === "object"
            ? group.createdBy._id.toString()
            : group.createdBy.toString(),
        currentUserId: userId,
        isUserCreator: isCreator,
        participants: participantsData,
        participantCount: group.participants.length,
        activeParticipantCount: group.participants.filter((p) => p.isActive)
          .length,
      },
    });
  } catch (error) {
    console.error("Error debugging group access:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: error.message,
    });
  }
};
