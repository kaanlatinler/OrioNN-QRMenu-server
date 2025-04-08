const express = require("express");
const router = express.Router();
const VisitorController = require("../controllers/VisitorController");

// Route to create a new visitor
router.post("/create-visitor", VisitorController.createVisitor);

module.exports = router;
