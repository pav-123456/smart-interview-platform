// routes/jobs.js
const express = require("express");
const router = express.Router();
const jobs = require("../datasets/jobs.json");

router.post("/", (req, res) => {
  const { skills } = req.body;  // ✅ expects: { "skills": ["React", "JavaScript"] }

  // STEP 6 — Match user skills against each job
  const recommendations = jobs.map((job) => {
    const matchedSkills = job.skills.filter((skill) =>
      skills.includes(skill)
    );
    const missingSkills = job.skills.filter((skill) =>
      !skills.includes(skill)
    );
    const matchPercentage = Math.round(
      (matchedSkills.length / job.skills.length) * 100
    );
    return {
      title: job.title,
      company: job.company,
      location: job.location,
      matchPercentage,
      matchedSkills,
      missingSkills,
    };
  });

  // STEP 7 — Sort best match first
  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // STEP 8 — Send response
  res.json(recommendations);
});

module.exports = router;