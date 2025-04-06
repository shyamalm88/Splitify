const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.registerUser
);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  auth.authenticateLocal,
  userController.loginUser
);

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", auth.authenticateJWT, userController.getCurrentUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get("/", auth.authenticateJWT, userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", auth.authenticateJWT, userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put("/:id", auth.authenticateJWT, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete("/:id", auth.authenticateJWT, userController.deleteUser);

module.exports = router;
