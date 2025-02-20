const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  projectTitle: { type: String, required: true },
  repoLink: { type: String, required: true },
  demoLink: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
