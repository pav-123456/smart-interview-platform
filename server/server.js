const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();


// ======================================
// MIDDLEWARE
// ======================================

// Parse JSON
app.use(express.json());

// CORS CONFIG
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


// ======================================
// SIMPLE REQUEST LOGGER (DEBUGGING HELP)
// ======================================
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});


// ======================================
// IMPORT ROUTES
// ======================================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");
const aiQuestionRoutes = require("./routes/aiQuestions");
const resumeRoutes = require("./routes/resumeAnalysis");
const historyRoutes = require("./routes/history");
const aiFeedbackRoute = require("./routes/aiFeedback");
const pdfRoutes = require("./routes/pdfRoutes");
const interviewAnswersRoutes = require("./routes/interviewAnswers");
const careerCoachRoute = require("./routes/careerCoach");
const generateResumeRoute = require("./routes/generateResume");
const skillsRoute = require("./routes/skills");
const recommendationRoute = require("./routes/jobRecommendation");
const roadmapRoute = require("./routes/roadmap");
// ======================================
// USE ROUTES
// ======================================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/ai-questions", aiQuestionRoutes);
app.use("/resume-analysis", resumeRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/recommendations", recommendationRoute);
app.use(
  "/interview-answers",
  interviewAnswersRoutes
);
app.use(
  "/career-coach",
  careerCoachRoute
);
app.use(
  "/generate-resume",
  generateResumeRoute
);
app.use("/api/skills", skillsRoute);
// IMPORTANT: History routes
app.use("/api/history", historyRoutes);

app.use("/api", aiFeedbackRoute);
app.use("/api/roadmap", roadmapRoute);

// ======================================
// HEALTH CHECK ROUTE
// ======================================
app.get("/", (req, res) => {
  res.send("🚀 Smart Interview API Running...");
});


// ======================================
// GLOBAL ERROR HANDLER (IMPORTANT UPGRADE)
// ======================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});


// ======================================
// MONGODB CONNECTION
// ======================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });


// ======================================
// DB EVENTS
// ======================================
mongoose.connection.on("connected", () => {
  console.log("📦 Database Connected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Database Error:", err);
});


// ======================================
// START SERVER
// ======================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});