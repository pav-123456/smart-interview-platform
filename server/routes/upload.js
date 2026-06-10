const express = require("express");

const router = express.Router();

const multer = require("multer");

const pdfParse = require("pdf-parse");

const fs = require("fs");

const Groq = require("groq-sdk");

// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Storage setup
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },

});

// Upload middleware
const upload = multer({
  storage: storage,
});

// Upload Route
router.post(
  "/",
  upload.single("resume"),

  async (req, res) => {

    try {

      // Check file exists
      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded",
        });

      }

      // Read uploaded PDF
      const dataBuffer =
        fs.readFileSync(req.file.path);

      // Extract PDF text
      const pdfData =
        await pdfParse(dataBuffer);

      const resumeText =
        pdfData.text;

      // AI Resume Analysis
      const completion =
        await groq.chat.completions.create({

          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content:
                `Analyze this resume.

Give:
1. Skills
2. Strengths
3. Weaknesses
4. ATS Score
5. Suggestions

Resume:

${resumeText}`,
            },
          ],

        });

      const analysis =
        completion.choices[0].message.content;

      // Send response
      res.json({

        message:
          "Resume uploaded successfully",

        extractedText:
          resumeText,

        analysis:
          analysis,

      });

    } catch (error) {

      console.log("PDF ERROR:", error);

      res.status(500).json({

        message:
          "Resume analysis failed",

        error:
          error.message,

      });

    }

  }
);

module.exports = router;