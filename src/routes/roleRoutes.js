const express = require("express");
const { body } = require("express-validator");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const router = express.Router();

const validateRole = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Role name must be between 2 and 50 characters"),
  handleValidationErrors,
];

router.post("/", validateRole, createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.put("/:id", validateRole, updateRole);
router.delete("/:id", deleteRole);

module.exports = router;
