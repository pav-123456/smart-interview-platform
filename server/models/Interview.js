const mongoose = require("mongoose");

const interviewSchema =
  new mongoose.Schema(
    {
      role: {
        type: String,
      },

      difficulty: {
        type: String,
      },

      question: {
        type: String,
      },

      answer: {
        type: String,
      },

      feedback: {
        type: String,
      },

      score: {
        type: Number,
        default: 0,
      },

      strengths: [
        {
          type: String,
        },
      ],

      weaknesses: [
        {
          type: String,
        },
      ],

      recommendation: {
        type: String,
      },

      duration: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Interview",
    interviewSchema
  );