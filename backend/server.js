const express = require("express");
const cors = require("cors");  // Add CORS support
const connectDB = require("./config");
const userRoutes = require("./routes/userRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const teamRoutes = require("./routes/teamRoutes");
const submissionRoutes = require("./routes/submissionRoutes");  // ✅ Add Submission Routes
const adminRoutes = require("./routes/adminRoutes");  // ✅ Add Admin Routes
require("dotenv").config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Hackathon Management API" });
});

// Register Routes
app.use("/api/users", userRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/submissions", submissionRoutes);  // ✅ Added Submission Routes
app.use("/api/admin", adminRoutes);  // ✅ Added Admin Routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Something went wrong!", 
        error: err.message 
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: "Route not found" 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⭐️ API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
