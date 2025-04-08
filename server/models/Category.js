const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for faster queries
    },
    icon: {
      type: String,
      required: true,
      default: "more-horiz", // Default MaterialIcons icon
    },
    isSystemDefined: {
      type: Boolean,
      default: false,
      index: true, // Add index for faster filtering
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Will be null for system-defined categories
      index: true, // Add index for faster user filtering
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Add index for filtering active categories
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals when document is converted to JSON
    toObject: { virtuals: true }, // Include virtuals when document is converted to Object
  }
);

// Create a compound index for common query patterns
categorySchema.index({ isSystemDefined: 1, name: 1 });
categorySchema.index({ createdBy: 1, isActive: 1 });

// Pre-save middleware to ensure unique names within the same scope
categorySchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const existingCategory = await this.constructor.findOne({
    name: new RegExp(`^${this.name}$`, "i"),
    _id: { $ne: this._id },
    $or: [
      { isSystemDefined: this.isSystemDefined },
      { createdBy: this.createdBy },
    ],
  });

  if (existingCategory) {
    const error = new Error("Category with this name already exists");
    error.name = "ValidationError";
    return next(error);
  }

  next();
});

// Static method to find categories by name (case insensitive)
categorySchema.statics.findByName = function (name) {
  return this.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });
};

// Static method to get all system categories
categorySchema.statics.getSystemCategories = function () {
  return this.find({ isSystemDefined: true }).sort({ name: 1 });
};

// Static method to get all user categories
categorySchema.statics.getUserCategories = function (userId) {
  return this.find({
    createdBy: userId,
    isActive: true,
  }).sort({ name: 1 });
};

// Static method to get all categories available to a user
categorySchema.statics.getAllUserAccessibleCategories = function (userId) {
  return this.find({
    $or: [{ isSystemDefined: true }, { createdBy: userId, isActive: true }],
  }).sort({ isSystemDefined: -1, name: 1 });
};

module.exports = mongoose.model("Category", categorySchema);
