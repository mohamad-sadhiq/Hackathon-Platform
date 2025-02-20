const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,  // Ensures the name is unique
  },
  description: { type: String, required: true },
  startDate: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function (value) {
        // Ensure that the startDate is not in the past
        return value >= new Date();
      },
      message: "Start date must be in the future!",
    },
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function (value) {
        // Ensure endDate is after startDate
        return value > this.startDate;
      },
      message: "End date must be after start date!",
    },
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model("Hackathon", hackathonSchema);
