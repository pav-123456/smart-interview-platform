const mongoose = require("mongoose");

const InterviewHistorySchema =
new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    feedback: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewHistory",
  InterviewHistorySchema
);