const Category = require("../models/Category");
const { ApiError } = require("../utils/errorHandler");

/**
 * Service layer for category-related functionality
 */
class CategoryService {
  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @param {string} userId - User ID who created the category
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData, userId) {
    const { name, icon } = categoryData;

    // Using the findByName static method to check for existing categories
    const existingCategory = await Category.findByName(name);
    if (existingCategory) {
      throw ApiError.badRequest("Category with this name already exists");
    }

    // Create the category
    const category = new Category({
      name,
      icon: icon || "more-horiz", // Default icon if not provided
      isSystemDefined: false,
      createdBy: userId,
      isActive: true,
    });

    await category.save();
    return category;
  }

  /**
   * Get all categories (system defined and user created)
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of categories
   */
  async getCategories(userId) {
    // Using the enhanced static method for better performance
    return await Category.getAllUserAccessibleCategories(userId);
  }

  /**
   * Get system-defined categories
   * @returns {Promise<Array>} List of system categories
   */
  async getSystemCategories() {
    // Using the enhanced static method
    return await Category.getSystemCategories();
  }

  /**
   * Get categories created by a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of user categories
   */
  async getUserCategories(userId) {
    // Using the enhanced static method
    return await Category.getUserCategories(userId);
  }

  /**
   * Update a category
   * @param {string} categoryId - Category ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(categoryId, updateData, userId) {
    const { name, icon } = updateData;
    const category = await Category.findById(categoryId);

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    // Prevent updating system-defined categories
    if (category.isSystemDefined) {
      throw ApiError.forbidden("Cannot update system-defined categories");
    }

    // Check if user is the creator of this category
    if (category.createdBy && category.createdBy.toString() !== userId) {
      throw ApiError.forbidden("Not authorized to update this category");
    }

    // Check if name is already taken (only if name is being changed)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case insensitive search
        _id: { $ne: categoryId }, // Exclude the current category
        $or: [
          { isSystemDefined: category.isSystemDefined },
          { createdBy: userId },
        ],
      });

      if (existingCategory) {
        throw ApiError.badRequest("Category with this name already exists");
      }
    }

    // Update the category
    return await Category.findByIdAndUpdate(
      categoryId,
      {
        name: name || category.name,
        icon: icon || category.icon,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Delete a category (marks as inactive rather than actually deleting)
   * @param {string} categoryId - Category ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(categoryId, userId) {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    // Prevent deleting system-defined categories
    if (category.isSystemDefined) {
      throw ApiError.forbidden("Cannot delete system-defined categories");
    }

    // Check if user is the creator of this category
    if (category.createdBy && category.createdBy.toString() !== userId) {
      throw ApiError.forbidden("Not authorized to delete this category");
    }

    // Mark as inactive instead of actually deleting
    category.isActive = false;
    await category.save();
    return true;
  }

  /**
   * Hard delete a category (for admin use only)
   * @param {string} categoryId - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async hardDeleteCategory(categoryId) {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    // Prevent hard-deleting system-defined categories
    if (category.isSystemDefined) {
      throw ApiError.forbidden("Cannot delete system-defined categories");
    }

    await category.deleteOne();
    return true;
  }

  /**
   * Initialize system categories
   * @param {Array} defaultCategories - List of default categories
   * @returns {Promise<Object>} Results of operation
   */
  async initializeSystemCategories(defaultCategories) {
    let created = 0;
    let existing = 0;

    // Create each category if it doesn't exist
    for (const cat of defaultCategories) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${cat.name}$`, "i") },
        isSystemDefined: true,
      });

      if (!existingCategory) {
        await Category.create({
          name: cat.name,
          icon: cat.icon,
          isSystemDefined: true,
          createdBy: null, // No specific user for system categories
          isActive: true,
        });
        created++;
      } else {
        existing++;
      }
    }

    return { created, existing };
  }
}

module.exports = new CategoryService();
