const User = require("../models/User");

/**
 * Middleware to check if a user has admin privileges
 * Assumes the auth middleware has already been run (req.user is available)
 */
exports.isAdmin = async (req, res, next) => {
  try {
    // If no user is authenticated, reject the request
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if the user exists and has admin privileges
    const user = await User.findById(req.user.id);

    // In a real application, you would check for an isAdmin field or role field
    // For this implementation, we're using a special array of admin user IDs in environment variables
    const adminUserIds = process.env.ADMIN_USER_IDS
      ? process.env.ADMIN_USER_IDS.split(",")
      : [];

    if (!user || !adminUserIds.includes(user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: "Admin privileges required",
      });
    }

    // User is an admin, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({
      success: false,
      error: "Server error in admin verification",
    });
  }
};
