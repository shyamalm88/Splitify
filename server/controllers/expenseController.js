const mongoose = require("mongoose");
const Expense = mongoose.model("Expense");
const Group = mongoose.model("Group");
const User = mongoose.model("User");
const { ApiError } = require("../utils/errorHandler");
const { optimizeImage } = require("../utils/imageProcessor");
const { uploadToFirebaseStorage } = require("../utils/fileUpload");

/**
 * Controller for handling expense-related operations
 */
class ExpenseController {
  /**
   * Create a new expense
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createExpense(req, res, next) {
    try {
      const {
        title,
        amount,
        paidBy,
        splitMethod,
        groupId,
        category,
        notes,
        receipt,
      } = req.body;
      const userId = req.user._id;

      // Check if group exists and user is a member
      const group = await Group.findById(groupId);
      if (!group) {
        throw ApiError.notFound("Group not found");
      }

      // Verify that the user is a member of the group
      const isGroupMember = group.participants.some(
        (participant) =>
          participant &&
          participant.user &&
          participant.user.toString() === userId.toString() &&
          participant.isActive
      );

      if (!isGroupMember) {
        throw ApiError.forbidden("You must be a group member to add expenses");
      }

      // Verify that the payer is a member of the group
      const isPaidByValid = group.participants.some(
        (participant) =>
          participant &&
          participant.user &&
          participant.user.toString() === paidBy.toString() &&
          participant.isActive
      );

      if (!isPaidByValid) {
        throw ApiError.badRequest("The payer must be an active group member");
      }

      // Create expense
      const newExpense = new Expense({
        title,
        amount: parseFloat(amount),
        paidBy,
        group: groupId,
        category,
        date: new Date(),
        notes: notes || "",
        splitMethod: splitMethod || "Equally",
        createdBy: userId,
      });

      // Handle receipt if provided
      if (receipt) {
        try {
          // Convert base64 to buffer
          const base64Data = receipt.replace(/^data:image\/\w+;base64,/, "");
          const imageBuffer = Buffer.from(base64Data, "base64");

          // Optimize the image
          const { optimizedBuffer } = await optimizeImage(
            imageBuffer,
            "receipt.jpg"
          );

          // Upload both original and optimized versions
          const [originalUrl, optimizedUrl] = await Promise.all([
            uploadToFirebaseStorage(
              imageBuffer,
              "receipt.jpg",
              "expense-receipts/original"
            ),
            uploadToFirebaseStorage(
              optimizedBuffer,
              "receipt.jpg",
              "expense-receipts/optimized"
            ),
          ]);

          // Store both URLs in the expense
          newExpense.receiptUrl = optimizedUrl;
          newExpense.originalReceiptUrl = originalUrl;
          newExpense.attachments = [originalUrl, optimizedUrl];
        } catch (error) {
          console.error("Error processing receipt:", error);
          // Continue without the receipt if there's an error
        }
      }

      // Calculate splits based on the split method
      const groupParticipants = group.participants.filter((p) => p.isActive);

      if (splitMethod === "Equally") {
        // Split equally among all active participants
        const splitAmount = parseFloat(amount) / groupParticipants.length;

        newExpense.splits = groupParticipants.map((participant) => ({
          user: participant.user,
          amount: splitAmount,
        }));
      } else {
        // For custom splits, we would expect the split details in the request
        // This is a simplified implementation
        newExpense.splits = groupParticipants.map((participant) => ({
          user: participant.user,
          amount: parseFloat(amount) / groupParticipants.length,
        }));
      }

      await newExpense.save();

      // Add expense to group
      group.expenses.push(newExpense._id);
      await group.save();

      // Send real-time notification using Socket.io
      const io = req.app.get("io");
      if (io) {
        io.to(`group_${groupId}`).emit("expense_added", {
          expenseId: newExpense._id,
          groupId,
          message: `New expense added: ${title}`,
        });
      }

      // Return the created expense
      res.status(201).json({
        success: true,
        data: newExpense,
        message: "Expense created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all expenses for a group
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getGroupExpenses(req, res, next) {
    try {
      const { groupId } = req.params;
      const userId = req.user._id;

      // Check if group exists and user is a member
      const group = await Group.findById(groupId);
      if (!group) {
        throw ApiError.notFound("Group not found");
      }

      // Verify that the user is a member of the group
      const isGroupMember = group.participants.some(
        (participant) =>
          participant &&
          participant.user &&
          participant.user.toString() === userId.toString() &&
          participant.isActive
      );

      if (!isGroupMember) {
        throw ApiError.forbidden("You must be a group member to view expenses");
      }

      // Get expenses for the group
      const expenses = await Expense.find({ group: groupId })
        .populate("paidBy", "username email")
        .populate("createdBy", "username email")
        .populate("splits.user", "username email")
        .sort({ date: -1 });

      res.status(200).json({
        success: true,
        data: expenses,
        message: "Group expenses retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific expense by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getExpenseById(req, res, next) {
    try {
      const { expenseId } = req.params;
      const userId = req.user._id;

      // Get expense with populated fields
      const expense = await Expense.findById(expenseId)
        .populate("paidBy", "username email")
        .populate("createdBy", "username email")
        .populate("group", "name")
        .populate("splits.user", "username email");

      if (!expense) {
        throw ApiError.notFound("Expense not found");
      }

      // Get the group to check membership
      const group = await Group.findById(expense.group);
      if (!group) {
        throw ApiError.notFound("Group not found");
      }

      // Verify that the user is a member of the group
      const isGroupMember = group.participants.some(
        (participant) =>
          participant &&
          participant.user &&
          participant.user.toString() === userId.toString() &&
          participant.isActive
      );

      if (!isGroupMember) {
        throw ApiError.forbidden(
          "You must be a group member to view this expense"
        );
      }

      res.status(200).json({
        success: true,
        data: expense,
        message: "Expense retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an expense
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateExpense(req, res, next) {
    try {
      const { expenseId } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      // Get the expense
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw ApiError.notFound("Expense not found");
      }

      // Check if user created the expense or is the payer
      const isExpenseCreator =
        expense.createdBy.toString() === userId.toString();
      const isPayer = expense.paidBy.toString() === userId.toString();

      if (!isExpenseCreator && !isPayer) {
        throw ApiError.forbidden(
          "You can only edit expenses you created or paid for"
        );
      }

      // If amount or split method is changing, recalculate splits
      if (updateData.amount || updateData.splitMethod) {
        const group = await Group.findById(expense.group);
        const groupParticipants = group.participants.filter((p) => p.isActive);

        if (
          updateData.splitMethod === "Equally" ||
          expense.splitMethod === "Equally"
        ) {
          const newAmount = updateData.amount || expense.amount;
          const splitAmount = parseFloat(newAmount) / groupParticipants.length;

          updateData.splits = groupParticipants.map((participant) => ({
            user: participant.user,
            amount: splitAmount,
          }));
        }
      }

      // Update expense fields
      Object.keys(updateData).forEach((key) => {
        if (key !== "splits" && key !== "group") {
          expense[key] = updateData[key];
        }
      });

      // Handle splits separately if provided
      if (updateData.splits) {
        expense.splits = updateData.splits;
      }

      await expense.save();

      // Notify group members
      const io = req.app.get("io");
      if (io) {
        io.to(`group_${expense.group}`).emit("expense_updated", {
          expenseId: expense._id,
          groupId: expense.group,
          message: `Expense updated: ${expense.title}`,
        });
      }

      res.status(200).json({
        success: true,
        data: expense,
        message: "Expense updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an expense
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteExpense(req, res, next) {
    try {
      const { expenseId } = req.params;
      const userId = req.user._id;

      // Get the expense
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        throw ApiError.notFound("Expense not found");
      }

      // Check if user created the expense
      if (expense.createdBy.toString() !== userId.toString()) {
        throw ApiError.forbidden("You can only delete expenses you created");
      }

      // Get the group to remove expense reference
      const group = await Group.findById(expense.group);
      if (group) {
        group.expenses = group.expenses.filter(
          (exp) => exp.toString() !== expenseId.toString()
        );
        await group.save();
      }

      // Delete the expense
      await Expense.findByIdAndDelete(expenseId);

      // Notify group members
      const io = req.app.get("io");
      if (io) {
        io.to(`group_${expense.group}`).emit("expense_deleted", {
          expenseId,
          groupId: expense.group,
          message: `Expense deleted: ${expense.title}`,
        });
      }

      res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExpenseController();
