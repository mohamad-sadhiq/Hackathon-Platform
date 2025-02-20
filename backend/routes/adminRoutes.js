const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

// ✅ Get All Users (Admin Only)
router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admins only!" });

  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
router.delete("/hackathons/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admins only!" });
  
    try {
      await Hackathon.findByIdAndDelete(req.params.id);
      res.json({ message: "Hackathon deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  module.exports = router;  // ✅ Make sure this is present
