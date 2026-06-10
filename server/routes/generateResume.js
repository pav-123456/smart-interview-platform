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
      name,
      email,
      phone,
      location,
      skills,
      education,
      experience,
      projects,
      certifications,
      linkedin,
      github,
    } = req.body;

    // ==========================
    // RESUME PROMPT
    // ==========================

    const resumePrompt = `
You are an expert resume writer.

Create a professional ATS-friendly resume.

Candidate Information

Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}

Skills:
${skills}

Education:
${education}

Experience:
${experience}

Projects:
${projects}

Certifications:
${certifications}

LinkedIn:
${linkedin}

GitHub:
${github}

Requirements:

1. Professional Summary
2. Technical Skills
3. Projects
4. Work Experience
5. Education
6. Certifications

Use bullet points.

Make the resume ATS optimized.

Do NOT use markdown.

Return only resume content.
`;

    // ==========================
    // COVER LETTER PROMPT
    // ==========================

    const coverLetterPrompt = `
Write a professional cover letter.

Candidate Name:
${name}

Skills:
${skills}

Projects:
${projects}

Experience:
${experience}

Keep it concise and professional.
`;

    // ==========================
    // AI RESUME
    // ==========================

    const resumeCompletion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: resumePrompt,
          },
        ],
        temperature: 0.7,
      });

    const generatedResume =
      resumeCompletion.choices[0].message.content;

    // ==========================
    // AI COVER LETTER
    // ==========================

    const coverLetterCompletion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: coverLetterPrompt,
          },
        ],
        temperature: 0.7,
      });

    const coverLetter =
      coverLetterCompletion.choices[0].message.content;

    // ==========================
    // ATS SCORE CALCULATION
    // ==========================

    let atsScore = 60;

    if (skills?.length > 20)
      atsScore += 10;

    if (projects?.length > 20)
      atsScore += 10;

    if (experience?.length > 20)
      atsScore += 10;

    if (linkedin)
      atsScore += 5;

    if (github)
      atsScore += 5;

    if (atsScore > 100)
      atsScore = 100;

    // ==========================
    // STRENGTHS
    // ==========================

    const strengths = [];

    if (skills)
      strengths.push(
        "Strong Technical Skills"
      );

    if (projects)
      strengths.push(
        "Project Experience"
      );

    if (experience)
      strengths.push(
        "Professional Experience"
      );

    if (linkedin)
      strengths.push(
        "LinkedIn Profile Added"
      );

    if (github)
      strengths.push(
        "GitHub Portfolio Added"
      );

    // ==========================
    // SUGGESTIONS
    // ==========================

    const suggestions = [];

    if (!linkedin)
      suggestions.push(
        "Add LinkedIn Profile"
      );

    if (!github)
      suggestions.push(
        "Add GitHub Profile"
      );

    if (
      !experience ||
      experience.length < 50
    ) {
      suggestions.push(
        "Add More Experience Details"
      );
    }

    if (
      !projects ||
      projects.length < 50
    ) {
      suggestions.push(
        "Add Detailed Project Descriptions"
      );
    }

    if (
      !certifications
    ) {
      suggestions.push(
        "Add Relevant Certifications"
      );
    }

    // ==========================
    // RESPONSE
    // ==========================

    res.json({
      success: true,

      resume:
        generatedResume,

      coverLetter,

      atsScore,

      strengths,

      suggestions,
    });
  } catch (error) {
    console.error(
      "Resume Generation Error:",
      error
    );

    res.status(500).json({
      success: false,
      error:
        "Resume generation failed",
    });
  }
});

module.exports = router;