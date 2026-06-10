const express = require("express");

const router = express.Router();

const multer = require("multer");

const fs = require("fs");

const pdfParse = require("pdf-parse");

const OpenAI = require("openai");

// Groq Client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Storage
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },

});

const upload = multer({ storage });

// Route
router.post(
  "/",
  upload.single("resume"),
  async (req, res) => {

    try {

      // Read PDF
      const dataBuffer = fs.readFileSync(
        req.file.path
      );

      const pdfData = await pdfParse(dataBuffer);

      const resumeText = pdfData.text;

      // AI Prompt
      const prompt = `
Analyze this resume:

${resumeText}

Give:
1. Skills
2. Strengths
3. Weaknesses
4. Suggestions
5. ATS Score out of 100
`;

      // AI Response
      const completion =
        await client.chat.completions.create({

          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

        });

      const result =
        completion.choices[0].message.content;

      res.json({
        result,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Resume Analysis Failed",
      });

    }

  }
);

module.exports = router;