const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/", async (req, res) => {
  try {
    const { goal, experience } = req.body;

    const completion = await client.chat.completions.create({
      model:"llama-3.3-70b-versatile",
      messages: [
       {
  role: "system",
  content: `
You are an expert AI Career Coach.

Generate a professional roadmap.

Return:

1. Monthly Plan
2. Skills To Learn
3. Projects To Build
4. Certifications
5. Interview Preparation
6. Expected Salary Growth
7. Portfolio Suggestions
8. Weekly Goals

Make roadmap detailed and practical.
`        },
        {
          role: "user",
          content: `
          Goal: ${goal}
          Experience: ${experience}
          `,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      roadmap: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate roadmap",
    });
  }
});

module.exports = router;