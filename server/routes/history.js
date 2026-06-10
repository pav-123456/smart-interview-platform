const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const InterviewHistory =
  require("../models/InterviewHistory");


// ======================================
// SAVE INTERVIEW
// ======================================

router.post("/save", async (req, res) => {

  try {

    const {
      role,
      question,
      answer,
      feedback,
      score,
    } = req.body;

    // VALIDATION
    if (
      !role?.trim() ||
      !question?.trim() ||
      !answer?.trim() ||
      !feedback?.trim()
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // SAFE SCORE
    let finalScore = 0;

    if (
      score !== undefined &&
      score !== null &&
      score !== ""
    ) {

      const parsedScore = Number(score);

      if (!isNaN(parsedScore)) {
        finalScore = parsedScore;
      }
    }

    // CREATE INTERVIEW
    const newInterview =
      new InterviewHistory({

        role: role.trim(),

        question: question.trim(),

        answer: answer.trim(),

        feedback: feedback.trim(),

        score: finalScore,
      });

    // SAVE
    const savedInterview =
      await newInterview.save();

    console.log(
      "✅ Interview Saved:",
      savedInterview._id
    );

    res.status(201).json({
      success: true,
      message:
        "Interview saved successfully",
      interview: savedInterview,
    });

  } catch (error) {

    console.log(
      "❌ SAVE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save interview",
    });
  }
});


// ======================================
// GET ALL HISTORY
// ======================================

router.get("/", async (req, res) => {

  try {

    const history =
      await InterviewHistory.find()
      .sort({ createdAt: -1 });

    console.log(
      `📦 ${history.length} interviews fetched`
    );

    res.status(200).json({
      success: true,
      interviews: history,
    });

  } catch (error) {

    console.log(
      "❌ FETCH ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      interviews: [],
      message:
        "Failed to fetch history",
    });
  }
});


// ======================================
// DELETE SINGLE INTERVIEW
// ======================================

router.delete(
  "/delete/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      console.log(
        "🗑 DELETE REQUEST ID:",
        id
      );

      // VALIDATE ID
      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid interview ID",
        });
      }

      // DELETE DIRECTLY
      const deletedInterview =
        await InterviewHistory.findByIdAndDelete(id);

      console.log(
        "📦 DELETED INTERVIEW:",
        deletedInterview
      );

      // NOT FOUND
      if (!deletedInterview) {

        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      // SUCCESS
      res.status(200).json({
        success: true,
        message:
          "Interview deleted successfully",
      });

    } catch (error) {

      console.log(
        "❌ DELETE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete interview",
      });
    }
  }
);


// ======================================
// DELETE ALL HISTORY
// ======================================

router.delete(
  "/delete-all",
  async (req, res) => {

    try {

      const result =
        await InterviewHistory.deleteMany({});

      console.log(
        `🗑 ${result.deletedCount} interviews deleted`
      );

      res.status(200).json({
        success: true,
        message:
          "All interview history deleted",
      });

    } catch (error) {

      console.log(
        "❌ DELETE ALL ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete all history",
      });
    }
  }
);


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;