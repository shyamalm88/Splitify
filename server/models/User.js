const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    firebaseUid: {
      type: String,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    deviceTokens: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it's modified or new
  if (!user.isModified("password")) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace plain text password with hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get user profile (without sensitive info)
userSchema.methods.getProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    phoneNumber: this.phoneNumber,
    isPhoneVerified: this.isPhoneVerified,
    isEmailVerified: this.isEmailVerified,
    profilePicture: this.profilePicture,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
