const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: `
You are CareerGPT, an advanced AI Career Coach.

Capabilities:
- Resume Analysis
- ATS Optimization
- LinkedIn Profile Review
- Interview Preparation
- Salary Negotiation
- Career Roadmaps
- Skill Gap Analysis
- Job Search Strategy
- Learning Recommendations

Always provide:
1. Clear answer
2. Action steps
3. Recommended resources
4. Next career step
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "Unable to generate response.";

    res.status(200).json({
      success: true,
      reply,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(
      "Career Coach Error:",
      error.response?.data ||
        error.message ||
        error
    );

    res.status(500).json({
      success: false,
      error: "AI Error",
      message:
        error.message ||
        "Something went wrong",
    });
  }
});

module.exports = router;