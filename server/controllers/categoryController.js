const categoryService = require("../services/categoryService");
const cache = require("../utils/cache");
const { ApiError } = require("../utils/errorHandler");

/**
 * Create a new category
 * @route POST /api/categories
 * @access Private
 */
exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(
      req.body,
      req.user.id
    );

    // Clear user categories cache
    cache.del(`categories:${req.user.id}`);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories (system defined and user created)
 * @route GET /api/categories
 * @access Private
 */
exports.getCategories = async (req, res, next) => {
  try {
    const cacheKey = `categories:${req.user.id}`;

    // Use cache with 15 minute TTL
    const categories = await cache.getOrSet(cacheKey, 900, async () => {
      return await categoryService.getCategories(req.user.id);
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a category
 * @route PUT /api/categories/:id
 * @access Private
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body,
      req.user.id
    );

    // Clear user categories cache
    cache.del(`categories:${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 * @access Private
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id, req.user.id);

    // Clear user categories cache
    cache.del(`categories:${req.user.id}`);

    res.status(200).json({
      success: true,
      data: {},
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get system-defined categories
 * @route GET /api/categories/system
 * @access Private
 */
exports.getSystemCategories = async (req, res, next) => {
  try {
    const cacheKey = "categories:system";

    // Use cache with 1 hour TTL for system categories
    const categories = await cache.getOrSet(cacheKey, 3600, async () => {
      return await categoryService.getSystemCategories();
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create system-defined categories (one-time setup)
 * @route POST /api/categories/system/setup
 * @access Private/Admin
 */
exports.setupSystemCategories = async (req, res, next) => {
  try {
    // Define default system categories
    const defaultCategories = [
      { name: "Food & Drinks", icon: "restaurant" },
      { name: "Dining", icon: "local-dining" },
      { name: "Transportation", icon: "directions-car" },
      { name: "Accommodation", icon: "hotel" },
      { name: "Entertainment", icon: "movie" },
      { name: "Shopping", icon: "shopping-bag" },
      { name: "Groceries", icon: "local-grocery-store" },
      { name: "Bills & Utilities", icon: "receipt" },
      { name: "Utilities", icon: "power" },
      { name: "Rent/Apartment Bills", icon: "apartment" },
      { name: "Trip", icon: "flight" },
      { name: "Travel", icon: "card-travel" },
      { name: "Family", icon: "family-restroom" },
      { name: "Couple", icon: "favorite" },
      { name: "Event", icon: "event" },
      { name: "Friends", icon: "people" },
      { name: "Roommates", icon: "person" },
      { name: "Home", icon: "home" },
      { name: "Sports", icon: "sports-basketball" },
      { name: "Health", icon: "local-hospital" },
      { name: "Education", icon: "school" },
      { name: "Work", icon: "work" },
      { name: "Loans/IOUs", icon: "account-balance" },
      { name: "Other", icon: "more-horiz" },
    ];

    const result = await categoryService.initializeSystemCategories(
      defaultCategories
    );

    // Clear system categories cache
    cache.del("categories:system");

    res.status(200).json({
      success: true,
      message: `System categories setup complete. Created: ${result.created}, Already existing: ${result.existing}`,
    });
  } catch (error) {
    next(error);
  }
};
