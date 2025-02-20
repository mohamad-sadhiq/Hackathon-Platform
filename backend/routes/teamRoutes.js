const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Hackathon = require("../models/Hackathon");
const Team = require("../models/Team");

// ✅ Register a Team for a Hackathon
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { hackathonId, leader, members } = req.body;

    // Check if the hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found!" });

    // Check if user is already registered in another team for this hackathon
    const existingTeam = await Team.findOne({ hackathonId, members: { $in: [leader, ...members] } });
    if (existingTeam) {
      return res.status(400).json({ error: "One or more members are already registered in another team!" });
    }

    // Create new team
    const newTeam = new Team({
      hackathonId,
      leader,
      members,
    });

    await newTeam.save();
    
    res.json({ message: "Team registered successfully!", team: newTeam });

    // ✅ Send Email (Optional)
    sendConfirmationEmail(req.user.email, hackathon.name);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export Router
module.exports = router;
