const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getAllUsers,
} = require("../controllers/userController");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Validation middleware
const validateRegister = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/users", getAllUsers); // This should be a protected route

module.exports = router;
