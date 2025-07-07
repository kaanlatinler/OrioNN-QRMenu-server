const express = require("express");
const { body, param, query } = require("express-validator");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  activateProduct,
  getProductsByCategory,
  incrementProductView,
} = require("../controllers/productController");
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
const validateCreateProduct = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  handleValidationErrors,
];

const validateUpdateProduct = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  handleValidationErrors,
];

const validateProductId = [
  param("id").isInt({ min: 1 }).withMessage("Invalid product ID"),
  handleValidationErrors,
];

const validateCategoryId = [
  param("categoryId").isInt({ min: 1 }).withMessage("Invalid category ID"),
  handleValidationErrors,
];

const validateProductPagination = [
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
  query("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  query("search")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Search term must be between 2 and 50 characters"),
  query("sortBy")
    .optional()
    .isIn(["title", "createdAt", "updatedAt"])
    .withMessage("Sort by must be one of: title, createdAt, updatedAt"),
  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("Sort order must be either ASC or DESC"),
  handleValidationErrors,
];

const validateCategoryPagination = [
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
  validateCreateProduct,
  createProduct
);
router.get("/", validateProductPagination, getAllProducts);
router.get("/:id", validateProductId, getProductById);
router.put(
  "/:id",
  authenticateToken,
  uploadImage,
  handleUploadError,
  validateUpdateProduct,
  updateProduct
);
router.delete("/:id", authenticateToken, validateProductId, deleteProduct);
router.patch(
  "/:id/deactivate",
  authenticateToken,
  validateProductId,
  deactivateProduct
);
router.patch(
  "/:id/activate",
  authenticateToken,
  validateProductId,
  activateProduct
);

// Increment product view count (public route)
router.patch("/:id/view", validateProductId, incrementProductView);

// Category-specific routes
router.get(
  "/category/:categoryId",
  validateCategoryId,
  validateCategoryPagination,
  getProductsByCategory
);

module.exports = router;
