const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { expenseSchemas } = require("../utils/validation");

// All expense routes require authentication
router.use(requireAuth);

// Create a new expense
router.post(
  "/",
  validate(expenseSchemas.createExpense),
  expenseController.createExpense
);

// Get all expenses for a group
router.get("/group/:groupId", expenseController.getGroupExpenses);

// Get a specific expense by ID
router.get("/:expenseId", expenseController.getExpenseById);

// Update an expense
router.put(
  "/:expenseId",
  validate(expenseSchemas.updateExpense),
  expenseController.updateExpense
);

// Delete an expense
router.delete("/:expenseId", expenseController.deleteExpense);

module.exports = router;
