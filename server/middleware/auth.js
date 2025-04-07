const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate with JWT
exports.authenticateJWT = async (req, res, next) => {
  // Get token from header
  const authHeader = req.header("Authorization");

  // Check if no token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Check if it's a development token
    if (token.startsWith("dev_")) {
      const [prefix, userId, timestamp] = token.split("_");
      if (prefix === "dev" && userId && timestamp) {
        // For development tokens, we'll create a mock user
        req.user = {
          id: userId,
          deviceTokens: [], // Initialize empty device tokens array
        };
        return next();
      }
    }

    // For production tokens, verify with JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-jwt-secret-key"
    );

    // Add user ID from payload to request object
    req.user = decoded;

    // Check if user still exists in database
    const userExists = await User.exists({ _id: decoded.id });
    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    next();
  } catch (error) {
    // Check if token is expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Middleware to authenticate with local strategy
exports.authenticateLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: info ? info.message : "Invalid credentials",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to validate JWT token
exports.validateToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

/**
 * Middleware to check if user has admin role
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isAdmin = async (req, res, next) => {
  try {
    // First ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Find user in database
    const user = await User.findById(req.user.id);

    // Check if user exists and has admin role
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin privileges required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};
