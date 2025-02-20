const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Submission = require("../models/Submission");
const Hackathon = require("../models/Hackathon");
const Team = require("../models/Team");

// ✅ Submit Project (Only for Registered Teams)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { hackathonId, teamId, projectTitle, repoLink, demoLink } = req.body;

    // Check if the hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found!" });
    }

    // Check if the team is registered in the hackathon
    const team = await Team.findById(teamId);
    if (!team || team.hackathonId.toString() !== hackathonId) {
      return res.status(403).json({ error: "Team is not registered for this hackathon!" });
    }

    // Create a new submission
    const submission = new Submission({
      hackathonId,
      teamId,
      projectTitle,
      repoLink,
      demoLink,
    });

    await submission.save();
    res.status(201).json({ message: "Project submitted successfully!", submission });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all submissions for a hackathon
router.get("/:hackathonId", async (req, res) => {
  try {
    const submissions = await Submission.find({ hackathonId: req.params.hackathonId }).populate("teamId");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export the router
module.exports = router;
