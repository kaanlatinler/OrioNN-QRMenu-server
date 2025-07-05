const express = require("express");
const path = require("path");

const app = express();
const { port } = require("./config/env") || 3000;

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// Import routes
const routes = require("./routes");

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Initialize models
require("./models");

// Mount routes
app.use("/", routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`Server running on => http://localhost:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api/v1`);
});

module.exports = app;
