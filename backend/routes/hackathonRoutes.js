const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Hackathon = require("../models/Hackathon");
const Team = require("../models/Team");
const User = require("../models/User");

// ✅ Test Route (Check if Routes Work)
router.get("/test", (req, res) => {
    res.json({ message: "Hackathon routes are working!" });
});

// ✅ Create Hackathon (Admins Only)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied. Admins only." });
    }

    const { name, description, startDate, endDate } = req.body;
    const hackathon = new Hackathon({
      name,
      description,
      startDate,
      endDate,
      createdBy: req.user.userId
    });

    await hackathon.save();
    res.status(201).json({ message: "Hackathon created successfully!", hackathon });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Hackathons
router.get("/", async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Hackathon by ID
router.get("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found!" });

    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Register a Team for a Hackathon
router.post("/:id/register", authMiddleware, async (req, res) => {
  try {
    const hackathonId = req.params.id;
    const { leader, members } = req.body;

    // Check if Hackathon Exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found!" });

    // Check if user is already registered in another team for this hackathon
    const existingTeam = await Team.findOne({ hackathonId, members: { $in: [leader, ...members] } });
    if (existingTeam) {
      return res.status(400).json({ error: "One or more members are already registered in another team!" });
    }

    // Create New Team
    const newTeam = new Team({
      hackathonId,
      leader,
      members,
    });

    await newTeam.save();
    
    res.json({ message: "Team registered successfully!", team: newTeam });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Teams Registered in a Hackathon
router.get("/:id/teams", async (req, res) => {
  try {
    const teams = await Team.find({ hackathonId: req.params.id });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export Router
module.exports = router;
