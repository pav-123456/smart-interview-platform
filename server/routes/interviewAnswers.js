const express = require("express");
const router = express.Router();

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/", async (req, res) => {

  try {

    const {
      role,
      company,
      interviewType,
      difficulty,
      experience,
    } = req.body;

    // DEBUGGING
    console.log("ROLE:", role);
    console.log("TYPE RECEIVED =", interviewType);
    console.log("COMPANY:", company);

    // Normalize interviewType to lowercase for consistent matching
    const type = interviewType?.toLowerCase();

    console.log("NORMALIZED TYPE:", type);

    let prompt = "";

    // TECHNICAL INTERVIEW - EXACT MATCH
    if (type === "technical") {
      console.log("✅ GENERATING TECHNICAL QUESTIONS");
      prompt = `
Generate EXACTLY 10 technical interview questions and answers.

Role: ${role}
Company: ${company}
Difficulty: ${difficulty}
Experience: ${experience}

STRICT RULES:

1. Generate ONLY technical questions.
2. No HR questions.
3. No Coding questions.
4. No Project questions.
5. Focus on role-specific concepts.
6. Include detailed answers with examples.

Format:

Q1. Technical Question?

Answer:
Detailed technical answer with examples

Q2. Technical Question?

Answer:
Detailed technical answer with examples

Generate EXACTLY 10 technical questions and answers.
`;
    }

    // HR INTERVIEW - EXACT MATCH
    else if (type === "hr") {
      console.log("✅ GENERATING HR QUESTIONS");
      prompt = `
Generate EXACTLY 10 HR interview questions and answers.

Company: ${company}
Role: ${role}
Experience: ${experience}

STRICT RULES:

1. Generate ONLY HR questions.
2. Never generate technical questions.
3. Never generate coding questions.
4. Never generate project questions.
5. Focus on behavioral and soft skills.

Topics:
- Tell me about yourself
- Why should we hire you?
- Your strengths and weaknesses
- Conflict resolution
- Team collaboration
- Time management
- Career goals
- Handling pressure
- Leadership experience
- Work-life balance

Format:

Q1. HR Question?

Answer:
Sample answer

Q2. HR Question?

Answer:
Sample answer

Generate EXACTLY 10 HR questions and answers.
`;
    }

    // CODING INTERVIEW - EXACT MATCH
    else if (type === "coding") {
      console.log("✅ GENERATING CODING QUESTIONS");
      prompt = `
Generate EXACTLY 10 coding interview questions.

Role: ${role}
Company: ${company}
Difficulty: ${difficulty}

STRICT RULES:

1. Every question must require coding.
2. No HR questions.
3. No behavioral questions.
4. No project questions.
5. No architecture questions.
6. No "Tell me about yourself".
7. No "Why should we hire you".

Each question must contain:

Problem Statement
Solution
Explanation
Time Complexity
Space Complexity

Format:

Q1. Problem?

Solution:
\`\`\`
code
\`\`\`

Explanation:
...

Time Complexity: O(n)
Space Complexity: O(1)

Generate EXACTLY 10 coding questions.
`;
    }

    // PROJECT DISCUSSION - EXACT MATCH
    else if (type === "project") {
      console.log("✅ GENERATING PROJECT QUESTIONS");
      prompt = `
Generate EXACTLY 10 project discussion questions.

Role: ${role}
Company: ${company}

STRICT RULES:

1. No coding challenges.
2. No HR questions.
3. No behavioral questions.
4. No DSA questions.

Focus ONLY on:

- Architecture
- Deployment
- Security
- Scalability
- Database Design
- API Design
- Challenges Faced
- Optimization
- Cloud Hosting
- DevOps

Format:

Q1. Project Question?

Answer:
Detailed answer

Generate EXACTLY 10 project discussion questions and answers.
`;
    }

    // FULL MOCK INTERVIEW - EXACT MATCH
    else if (type === "full") {
      console.log("✅ GENERATING FULL MOCK INTERVIEW QUESTIONS");
      prompt = `
Generate EXACTLY 10 full mock interview questions and answers.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}
Experience: ${experience}

RULES:
- Mix of Technical (4 questions), HR (3 questions), and Project (3 questions).
- Include a variety of topics and difficulty levels.
- Each question should have detailed answers.
- Make it realistic to actual interviews.

Format:

Q1. [TECHNICAL] Technical Question?

Answer:
Detailed technical answer

Q2. [HR] HR Question?

Answer:
Sample behavioral answer

Q3. [PROJECT] Project Question?

Answer:
Project-related answer

Q4. [TECHNICAL] Technical Question?

Answer:
Detailed technical answer

Q5. [TECHNICAL] Technical Question?

Answer:
Detailed technical answer

Q6. [TECHNICAL] Technical Question?

Answer:
Detailed technical answer

Q7. [HR] HR Question?

Answer:
Sample answer

Q8. [HR] HR Question?

Answer:
Sample answer

Q9. [PROJECT] Project Question?

Answer:
Project-related answer

Q10. [PROJECT] Project Question?

Answer:
Project-related answer

Total: 4 technical, 3 HR, 3 project = 10 questions.
`;
    }

    // DEFAULT FALLBACK
    else {
      console.log("⚠️ WARNING: NO MATCHING INTERVIEW TYPE. USING FALLBACK");
      console.log("Received type was:", interviewType);
      console.log("Normalized type was:", type);
      prompt = `
Generate EXACTLY 10 interview questions with detailed answers.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}
Experience: ${experience}

Format:

Q1. Question?

Answer:
Detailed answer

Continue until 10 questions.
`;
    }

    // CRITICAL DEBUG - Show exactly which prompt is being sent
    console.log("=================================");
    console.log("SELECTED INTERVIEW TYPE:", type);
    console.log("=================================");
    console.log("PROMPT BEING SENT TO AI:");
    console.log(prompt);
    console.log("=================================");

    console.log("📝 SENDING PROMPT TO AI...");

    const completion =
      await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.3,

        messages: [
          {
            role: "system",
            content: `
You are a senior interviewer.

STRICT RULES:

If generating Technical questions:
- Only technical questions
- No HR, no coding, no project questions

If generating Coding questions:
- Only coding/DSA questions
- No HR, no project, no behavioral questions
- Include problem, solution, and complexity analysis

If generating Project questions:
- Only project discussion questions
- No HR, no coding, no behavioral questions
- Focus on architecture, deployment, scaling, database

If generating HR questions:
- Only HR/behavioral questions
- No technical, no coding questions

If generating Full Interview:
- Mix: 4 technical, 3 HR, 3 project = 10 total

Follow instructions exactly.
`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],

      });

    console.log("✅ AI RESPONSE RECEIVED");

    res.json({
      success: true,
      result:
        completion.choices[0]
          .message.content,
    });

  } catch (error) {

    console.log("❌ ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        "Failed to generate questions",
    });

  }

});

module.exports = router;