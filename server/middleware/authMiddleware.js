// Re-export authentication middleware from auth.js
const { authenticateJWT, isAdmin, validateToken } = require("./auth");

// Export the authenticateJWT function as requireAuth for use in routes
exports.requireAuth = authenticateJWT;
exports.authenticate = authenticateJWT;
exports.isAdmin = isAdmin;
exports.verifyToken = validateToken;
