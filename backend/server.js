/**
 * Main Server Configuration File
 *
 * This file initializes the Express server, sets up database connections,
 * configures middleware, and registers API routes.
 */

// Load environment variables from .env file
require("dotenv").config()

// Import required packages
const express = require("express")
const mongoose = require("mongoose")
const { GridFSBucket } = require("mongodb")
const cors = require("cors")
const path = require("path")

// Import route modules
const transactionRoutes = require("./routes/transaction")
const userRoutes = require("./routes/userRoutes")
const posconfigRoutes = require("./routes/posconfigRoutes")
const vendorRoutes = require("./routes/vendorRoutes")
const poRoutes = require("./routes/poRoutes") // Import purchase order routes
const bankRoutes = require("./routes/bankRoutes")

// Initialize Express application
const app = express()
const PORT = process.env.PORT || 5002 // Fallback to 5002 if PORT is not defined

/**
 * Middleware Configuration
 */
// Enable Cross-Origin Resource Sharing
app.use(cors())
// Parse JSON request bodies
app.use(express.json())
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }))

/**
 * MongoDB Connection
 */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully")
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err)
    process.exit(1) // Exit on database connection failure
  })

// Database connection instance
const db = mongoose.connection
let gridfsBucket

// Initialize GridFS once database connection is open
db.once("open", async () => {
  console.log("📁 Setting up GridFS storage")
  gridfsBucket = new GridFSBucket(db.db, { bucketName: "uploads" })
  console.log("✅ GridFS initialized successfully")
})

/**
 * Error handler for database connection errors
 */
db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err)
})

/**
 * API Routes
 */
app.use("/api/auth", userRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/posconfig", posconfigRoutes)
app.use("/api/vendors", vendorRoutes)
app.use("/api/purchase-orders", poRoutes) // Register purchase order routes
app.use("/api/banks", require("./routes/bankRoutes"))

/**
 * Default route for API health check
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() })
})

/**
 * Handle 404 - Route not found
 */
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  })
})

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  })
})

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📝 API Documentation available at http://localhost:${PORT}/api/health`)
})

// Export the app for testing purposes
module.exports = app
