const express = require("express");
const router = express.Router();

const OpenAI = require("openai");

// ==========================================
// GROQ CLIENT
// ==========================================

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      role,
      interviewType,
      difficulty,
      experience,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // ==========================================
    // AI REQUEST
    // ==========================================

    const prompt = `
You are a professional technical interviewer.

Generate a complete mock interview for:

Role: ${role}

Difficulty: ${difficulty || "Intermediate"}
Interview Type: ${interviewType || "Full Interview"}
Experience: ${experience || "Fresher"}

Rules:

1. Create exactly 10 questions.
2. Number all questions.
3. Use these sections in this exact structure:
   - INTRODUCTION: 1 question
   - RESUME: 1 question
   - TECHNICAL: 3 questions
   - PROJECT DISCUSSION: 2 questions
   - CODING: 1 question
   - HR: 1 question
   - CANDIDATE QUESTIONS: 1 question
4. Technical questions must be specific to the role.
5. Coding questions should match the role difficulty.
6. HR questions should be realistic.
7. Project questions should ask about technologies, challenges, architecture, and deployment.
8. Return only the interview questions.

Example format:

=== INTRODUCTION ===

1. Tell me about yourself.

=== RESUME ===

2. Walk me through your resume.

=== TECHNICAL ===

3. What are React Hooks?

4. Explain state and props in React.

5. How do you optimize React performance?

=== PROJECT DISCUSSION ===

6. Describe your latest project.

7. What technical challenge did you solve in that project?

=== CODING ===

8. Write a function to reverse a string.

=== HR ===

9. Why should we hire you?

=== CANDIDATE QUESTIONS ===

10. Do you have any questions for us?
    `.trim();

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a senior technical interviewer who creates realistic sectioned interviews.

Rules:
- Return only interview questions.
- Keep sections clear and professional.
- Make the interview feel like a real company interview.
          `.trim(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1400,
    });

    // ==========================================
    // AI RESPONSE
    // ==========================================

    const result = completion.choices[0].message.content;

    console.log("✅ QUESTIONS GENERATED");

    // ==========================================
    // RETURN RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log("❌ AI QUESTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
});

module.exports = router;
