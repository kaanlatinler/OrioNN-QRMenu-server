const express = require("express");
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const roleRoutes = require("./roleRoutes");

const router = express.Router();

// API version prefix
const API_PREFIX = "/api/v1";

// Mount routes
router.use(`${API_PREFIX}/auth`, userRoutes);
router.use(`${API_PREFIX}/categories`, categoryRoutes);
router.use(`${API_PREFIX}/products`, productRoutes);
router.use(`${API_PREFIX}/roles`, roleRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// 404 handler for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

module.exports = router;
