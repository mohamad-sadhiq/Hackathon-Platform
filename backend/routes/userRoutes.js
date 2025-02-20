const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 
const authMiddleware = require("../middlewares/authMiddleware"); // ✅ Import middleware

require("dotenv").config(); 

// ✅ User Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // ✅ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create and save the new user
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Generate a JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful!", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Protected User Profile Route
router.get("/someRoute", (req, res) => {
  res.json({ message: "This route is working!" });
});


// ✅ Move `module.exports = router` to the end
module.exports = router;
