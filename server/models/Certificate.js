const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  candidateName: String,
  role: String,
  score: Number,
  issueDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);