const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// ===============================
// IMPORT INTERVIEW MODEL
// ===============================
const Interview = require("../models/Interview");

// ===============================
// GROQ CLIENT
// ===============================
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ===============================
// AI FEEDBACK ROUTE
// ===============================
router.post("/feedback", async (req, res) => {
  try {
    // ===============================
    // GET DATA FROM FRONTEND
    // ===============================
    const { role, question, answer, interviewType, difficulty, round } =
      req.body;

    // ===============================
    // VALIDATION
    // ===============================
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    // ===============================
    // AI PROMPT
    // ===============================
    const prompt = `
You are a professional interview evaluator.

Analyze the candidate answer carefully and generate a structured interview report.

Interview Role:
${role}

Interview Type:
${interviewType || "Full Interview"}

Difficulty:
${difficulty || "Intermediate"}

Round:
${round || "General"}

Interview Question:
${question}

Candidate Answer:
${answer}

Return only in this exact format:

Communication: x/10
Technical: x/10
Confidence: x/10
Overall: x/10

📊 INTERVIEW REPORT

Communication Skills
⭐⭐⭐⭐☆

Technical Knowledge
⭐⭐⭐☆☆

Confidence
⭐⭐⭐⭐⭐

Problem Solving
⭐⭐⭐☆☆

Project Explanation
⭐⭐⭐⭐☆

Overall Score
8.2/10

Strengths
✓ Clear communication
✓ Good React knowledge

Areas for Improvement
✓ Database concepts
✓ API security

Hiring Recommendation
Recommended
`.trim();

    // ===============================
    // AI REQUEST
    // ===============================
    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer who gives detailed interview feedback in a structured professional report.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 900,
    });

    // ===============================
    // AI RESPONSE
    // ===============================
    const aiFeedback = completion.choices[0].message.content;

    // ===============================
    // SAVE TO MONGODB
    // ===============================
    await Interview.create({
      role: role || "Unknown",
      question,
      answer,
      feedback: aiFeedback,
    });

    // ===============================
    // SEND RESPONSE
    // ===============================
    res.status(200).json({
      success: true,
      feedback: aiFeedback,
      timestamp: new Date(),
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });
  } catch (error) {
    // ===============================
    // ERROR LOGGING
    // ===============================
    console.error("AI FEEDBACK ERROR:");
    console.error(error);

    // ===============================
    // ERROR RESPONSE
    // ===============================
    res.status(500).json({
      success: false,
      message: "Failed to generate AI feedback",
      error: error.message || "Unknown error",
    });
  }
});

// ===============================
// GET INTERVIEW HISTORY
// ===============================
router.get("/history", async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
});

// ===============================
// TEST ROUTE
// ===============================
router.get("/feedback", (req, res) => {
  res.json({
    success: true,
    message: "AI Feedback API is working properly 🚀",
  });
});

module.exports = router;
