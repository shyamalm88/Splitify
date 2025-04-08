const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getSystemCategories,
  setupSystemCategories,
} = require("../controllers/categoryController");
const { validateRequest, categorySchemas } = require("../utils/validation");

// Protect all routes
router.use(auth);

// Category routes
router.post("/", validateRequest(categorySchemas.create), createCategory);
router.get("/", getCategories);

router.put(
  "/:id",
  validateRequest(categorySchemas.id, "params"),
  validateRequest(categorySchemas.update),
  updateCategory
);

router.delete(
  "/:id",
  validateRequest(categorySchemas.id, "params"),
  deleteCategory
);

// System category routes
router.get("/system", getSystemCategories);

// Admin-only route to set up system categories
router.post("/system/setup", isAdmin, setupSystemCategories);

module.exports = router;
