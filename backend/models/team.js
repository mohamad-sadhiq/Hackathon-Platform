const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
  leader: { type: String, required: true },
  members: [{ type: String, required: true }],
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
