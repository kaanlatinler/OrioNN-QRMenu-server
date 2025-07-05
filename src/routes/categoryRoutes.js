const express = require("express");
const { body, param, query } = require("express-validator");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByTitle,
  updateCategory,
  deleteCategory,
  deactivateCategory,
  activateCategory,
} = require("../controllers/categoryController");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  uploadImage,
  handleUploadError,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// Validation middleware
const validateCreateCategory = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  handleValidationErrors,
];

const validateUpdateCategory = [
  param("id").isInt({ min: 1 }).withMessage("Invalid category ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  handleValidationErrors,
];

const validateCategoryId = [
  param("id").isInt({ min: 1 }).withMessage("Invalid category ID"),
  handleValidationErrors,
];

const validateCategoryTitle = [
  param("title")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  handleValidationErrors,
];

const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("isActive")
    .optional()
    .isIn(["true", "false"])
    .withMessage('isActive must be either "true" or "false"'),
  handleValidationErrors,
];

// Routes
router.post(
  "/",
  authenticateToken,
  uploadImage,
  handleUploadError,
  validateCreateCategory,
  createCategory
);
router.get("/", validatePagination, getAllCategories);
router.get("/title/:title", validateCategoryTitle, getCategoryByTitle);
router.get("/:id", validateCategoryId, getCategoryById);
router.put(
  "/:id",
  authenticateToken,
  uploadImage,
  handleUploadError,
  validateUpdateCategory,
  updateCategory
);
router.delete("/:id", authenticateToken, validateCategoryId, deleteCategory);
router.patch(
  "/:id/deactivate",
  authenticateToken,
  validateCategoryId,
  deactivateCategory
);
router.patch(
  "/:id/activate",
  authenticateToken,
  validateCategoryId,
  activateCategory
);

module.exports = router;
