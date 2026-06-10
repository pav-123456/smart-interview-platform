import React, { useEffect, useMemo, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

const TOTAL_QUESTIONS = 10;

const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const experienceLevels = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];

// Phase 1: Interview type cards config
const interviewTypeCards = [
  { type: "Technical", icon: "💻", sub: "MERN Stack" },
  { type: "HR", icon: "👔", sub: "Behavioral" },
  { type: "Project", icon: "🚀", sub: "Architecture" },
  { type: "Coding", icon: "🧠", sub: "DSA / Logic" },
  { type: "Full", icon: "🎯", sub: "All Rounds" },
];

function normalizeRoundName(rawRound) {
  const round = rawRound.trim().toUpperCase();
  if (round.includes("PROJECT") || round.includes("DISCUSSION") || round.includes("PROJECTS")) return "Project Discussion";
  if (round.includes("CANDIDATE")) return "Candidate Questions";
  if (round.includes("INTRO")) return "Introduction";
  if (round.includes("RESUME")) return "Resume";
  if (round.includes("TECHNICAL")) return "Technical";
  if (round.includes("CODING")) return "Coding";
  if (round.includes("HR")) return "HR";
  return rawRound.trim();
}

function parseQuestions(rawText) {
  const lines = rawText.split(/\r?\n/);
  const parsedQuestions = [];
  let currentRound = "Introduction";

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const sectionMatch = trimmedLine.match(/^(?:SECTION:|===)\s*([A-Z\s]+?)\s*(?:===)?$/i);
    if (sectionMatch) { currentRound = normalizeRoundName(sectionMatch[1]); return; }

    const directRoundMatch = trimmedLine.match(/^[A-Z][A-Z\s]+$/);
    if (directRoundMatch && !/^\d+\./.test(trimmedLine)) {
      currentRound = normalizeRoundName(trimmedLine);
      return;
    }

    const questionMatch = trimmedLine.match(/^\d+\.\s*(.+)$/);
    if (questionMatch) {
      parsedQuestions.push({ round: currentRound, text: questionMatch[1].trim() });
    }
  });

  return parsedQuestions.slice(0, TOTAL_QUESTIONS);
}

function extractScore(text, regex) {
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : null;
}

function formatScore(score) {
  if (score === null || isNaN(score)) return "--";
  return Number.isInteger(score) ? `${score}/10` : `${score.toFixed(1)}/10`;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// Phase 6: Assign difficulty to a question based on index
function getQuestionDifficulty(index) {
  if (index <= 2) return "Easy";
  if (index <= 6) return "Medium";
  return "Hard";
}

function MockInterview() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [candidateName, setCandidateName] = useState("");
  // Phase 1: interviewType as card selection
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [experience, setExperience] = useState("Fresher");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(null);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [technicalScore, setTechnicalScore] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Phase 3: confidence state
  const [confidence, setConfidence] = useState(0);

  // Phase 5: interviewer status
  const [interviewerStatus, setInterviewerStatus] = useState("Ready");

  // Phase 7: per-answer quality scores
  const [answerQuality, setAnswerQuality] = useState({ comm: 0, tech: 0, conf: 0 });
  const [showQuality, setShowQuality] = useState(false);

  // Phase 8: follow-up question
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const timerRef = useRef(null);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex] || null, [questions, currentQuestionIndex]);
  const currentAnswer = answers[currentQuestionIndex] || "";
  const currentRound = currentQuestion?.round || interviewType;

  // Phase 4: progress
  const progress = questions.length > 0 ? Math.round(((currentQuestionIndex) / TOTAL_QUESTIONS) * 100) : 0;

  useEffect(() => {
    if (interviewCompleted) return;
    if (!questions.length) { setCurrentQuestionIndex(0); return; }
    if (currentQuestionIndex >= questions.length) setCurrentQuestionIndex(questions.length - 1);
  }, [currentQuestionIndex, interviewCompleted, questions.length]);

  useEffect(() => {
    if (questions.length > 0 && !interviewCompleted) {
      timerRef.current = setInterval(() => setSeconds((p) => p + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [questions.length, interviewCompleted]);

  const resetSessionState = () => {
    setAnswers([]);
    setFeedback("");
    setScore(null);
    setCommunicationScore(0);
    setTechnicalScore(0);
    setConfidenceScore(0);
    setConfidence(0);
    setSeconds(0);
    setInterviewCompleted(false);
    setCurrentQuestionIndex(0);
    setShowQuality(false);
    setFollowUpQuestion("");
    setShowFollowUp(false);
    setInterviewerStatus("Ready");
    resetTranscript();
    SpeechRecognition.stopListening();
  };

  // Phase 2: Build prompt for each interview type (NOW USED)
  const buildPromptForType = (interviewTypeParam, roleParam, difficultyParam, experienceParam) => {
    const base = `You are an expert interviewer. Generate exactly 10 interview questions. Number each question like: 1. question text\n\nRole: ${roleParam || "Software Developer"}\nDifficulty: ${difficultyParam}\nExperience: ${experienceParam}\n\n`;

    if (interviewTypeParam === "Technical") {
      return base + `Generate exactly 10 technical interview questions for a ${roleParam || "MERN Stack"} developer.\nOnly technical questions. No HR questions. No project questions.`;
    }
    if (interviewTypeParam === "HR") {
      return base + `Generate exactly 10 HR interview questions.\nOnly HR questions.\nExamples: Tell me about yourself. Why should we hire you? What are your strengths?`;
    }
    if (interviewTypeParam === "Project") {
      return base + `Generate exactly 10 project discussion questions.\nFocus on: Architecture, Database, Deployment, Challenges, Scalability.`;
    }
    if (interviewTypeParam === "Coding") {
      return base + `Generate exactly 10 coding and DSA interview questions.\nFocus on: Data structures, Algorithms, Time/Space complexity, Problem solving.`;
    }
    return base + `Generate exactly 10 full mock interview questions mixing Technical, HR, and Project topics.`;
  };

  const generateQuestion = async () => {
    if (!role.trim()) { alert("Please enter job role"); return; }
    try {
      setLoading(true);
      setQuestions([]);
      resetSessionState();

      // USE buildPromptForType here
      const customPrompt = buildPromptForType(interviewType, role, difficulty, experience);

      const res = await fetch("http://localhost:5000/ai-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          role, 
          difficulty, 
          experience, 
          interviewType,
          customPrompt // Send the custom prompt to backend
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.result) throw new Error(data.message || "Failed to generate interview questions");

      const parsedQuestions = parseQuestions(data.result);
      if (parsedQuestions.length === 0) throw new Error("No questions were returned by the AI");

      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setAnswers(new Array(parsedQuestions.length).fill(""));
      setInterviewerStatus("Listening...");

      // Phase 11: speak first question aloud
      speakText(parsedQuestions[0]?.text || "");
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const saveInterviewHistory = async ({ questionText, answerText, feedbackText, extractedScore }) => {
    try {
      const saveRes = await fetch("http://localhost:5000/api/history/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role, question: questionText, answer: answerText,
          feedback: feedbackText, score: extractedScore ?? 0,
          round: currentRound, interviewType, difficulty, experience,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveData.success) console.warn("Save failed:", saveData.message);
    } catch (e) { console.warn("History save error:", e); }
  };

  const updateCurrentAnswer = (value) => {
    setAnswers((prev) => { const next = [...prev]; next[currentQuestionIndex] = value; return next; });
  };

  const submitAnswer = async () => {
    if (!currentQuestion) { alert("Please generate questions first"); return; }
    if (!currentAnswer.trim()) { alert("Please enter an answer"); return; }

    try {
      setFeedbackLoading(true);
      setInterviewerStatus("Evaluating answer...");
      setShowQuality(false);
      setShowFollowUp(false);

      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role, question: currentQuestion.text, answer: currentAnswer,
          interviewType, difficulty, experience, round: currentRound,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.feedback) throw new Error(data.message || "Failed to generate AI feedback");

      const aiFeedback = data.feedback;

      const extractedComm = extractScore(aiFeedback, /Communication:\s*(\d+(?:\.\d+)?)\/10/i);
      const extractedTech = extractScore(aiFeedback, /Technical:\s*(\d+(?:\.\d+)?)\/10/i);
      const extractedConf = extractScore(aiFeedback, /Confidence:\s*(\d+(?:\.\d+)?)\/10/i);
      const extractedOverall = extractScore(aiFeedback, /Overall:\s*(\d+(?:\.\d+)?)\/10/i);

      if (extractedComm !== null) setCommunicationScore(extractedComm);
      if (extractedTech !== null) setTechnicalScore(extractedTech);
      if (extractedConf !== null) setConfidenceScore(extractedConf);
      if (extractedOverall !== null) setScore(extractedOverall);

      // Phase 7: answer quality bars
      setAnswerQuality({
        comm: extractedComm ? extractedComm * 10 : 60,
        tech: extractedTech ? extractedTech * 10 : 55,
        conf: extractedConf ? extractedConf * 10 : 65,
      });
      setShowQuality(true);

      // Phase 3: update confidence
      const confVal = extractedConf ? Math.round(extractedConf * 10) : 65;
      setConfidence(confVal);

      setFeedback(aiFeedback);
      setInterviewerStatus("Listening...");

      // Phase 8: generate follow-up from feedback text
      const followUpMatch = aiFeedback.match(/follow[-\s]?up[:\s]+(.+?)(?:\n|$)/i);
      if (followUpMatch) {
        setFollowUpQuestion(followUpMatch[1].trim());
        setShowFollowUp(true);
      }

      localStorage.setItem("certificate", JSON.stringify({
        name: candidateName || "Candidate", role,
        score: extractedOverall ?? extractedComm ?? 0,
        interviewType, difficulty, experience,
        date: new Date().toLocaleDateString(),
      }));

      await saveInterviewHistory({
        questionText: currentQuestion.text, answerText: currentAnswer,
        feedbackText: aiFeedback, extractedScore: extractedOverall,
      });
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit answer");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const goToNextQuestion = () => {
    if (!questions.length) return;
    SpeechRecognition.stopListening();
    resetTranscript();

    const isLast = currentQuestionIndex >= questions.length - 1;
    if (isLast) { setInterviewCompleted(true); return; }

    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    setFeedback("");
    setShowQuality(false);
    setShowFollowUp(false);
    setInterviewerStatus("Listening...");

    // Phase 11: speak next question
    speakText(questions[nextIdx]?.text || "");
  };

  // Phase 11: voice synthesis
  const speakText = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
  };

  const startSpeaking = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setInterviewerStatus("Listening...");
  };

  const stopSpeaking = () => {
    SpeechRecognition.stopListening();
    updateCurrentAnswer(transcript);
    setInterviewerStatus("Evaluating answer...");
  };

  const resetInterview = () => {
    setRole("");
    setCandidateName("");
    setInterviewType("Technical");
    setDifficulty("Intermediate");
    setExperience("Fresher");
    setQuestions([]);
    resetSessionState();
  };

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      alert("🎤 Microphone Working");
      stream.getTracks().forEach((t) => t.stop());
    } catch { alert("❌ Microphone permission denied"); }
  };

  const statusColor = {
    "Ready": "#6b7280",
    "Listening...": "#16a34a",
    "Evaluating answer...": "#d97706",
  };

  const statusDot = {
    "Ready": "#9ca3af",
    "Listening...": "#22c55e",
    "Evaluating answer...": "#f59e0b",
  };

  const difficultyLabel = getQuestionDifficulty(currentQuestionIndex);
  const difficultyColor = { Easy: "#16a34a", Medium: "#d97706", Hard: "#dc2626" };
  const difficultyBg = { Easy: "#dcfce7", Medium: "#fef3c7", Hard: "#fee2e2" };

  if (!browserSupportsSpeechRecognition) {
    return <h2 style={{ padding: 24 }}>Browser does not support Speech Recognition</h2>;
  }

  // ─── COMPLETION SCREEN (Phase 9) ───────────────────────────────────────────
  if (interviewCompleted) {
    const overallNum = score ? score.toFixed(1) : ((communicationScore + technicalScore + confidenceScore) / 3).toFixed(1);
    const isRecommended = parseFloat(overallNum) >= 6;
    const problemSolving = ((technicalScore + confidenceScore) / 2).toFixed(1);

    return (
      <div style={styles.pageContainer}>
        <div style={{ ...styles.pageCard, maxWidth: 860 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 56 }}>🎉</div>
            <h1 style={{ ...styles.title, fontSize: 34, marginBottom: 6 }}>Interview Completed!</h1>
            <p style={{ color: "#6b7280", fontSize: 15 }}>
              {candidateName || "Candidate"} · {interviewType} Round · {formatTime(seconds)} taken
            </p>
          </div>

          {/* Overall Score Circle */}
          <div style={styles.overallScoreCircle}>
            <div style={styles.scoreCircle}>
              <span style={styles.scoreCircleNum}>{overallNum}</span>
              <span style={styles.scoreCircleSub}>/ 10</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={{
                ...styles.recommendBadge,
                background: isRecommended ? "#dcfce7" : "#fee2e2",
                color: isRecommended ? "#15803d" : "#b91c1c",
                border: `1.5px solid ${isRecommended ? "#86efac" : "#fca5a5"}`,
              }}>
                {isRecommended ? "✅ Recommended" : "🔄 Needs Improvement"}
              </span>
            </div>
          </div>

          {/* Score Cards Grid */}
          <div style={styles.scoreGrid}>
            {[
              { label: "Communication", value: communicationScore, icon: "🗣️" },
              { label: "Technical Knowledge", value: technicalScore, icon: "⚙️" },
              { label: "Problem Solving", value: problemSolving, icon: "🧠" },
              { label: "Confidence", value: confidenceScore, icon: "💪" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={styles.scoreCard}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
                <div style={styles.scoreCardNum}>{value}/10</div>
                <div style={styles.scoreCardLabel}>{label}</div>
              </div>
            ))}
          </div>

          <div style={styles.completionActions}>
            <button onClick={() => navigate("/analytics")} style={styles.secondaryButton}>📈 View Analytics</button>
            <button onClick={() => navigate("/certificate")} style={styles.primaryButton}>🏆 Get Certificate</button>
            <button onClick={resetInterview} style={styles.ghostButton}>🔄 Retake Interview</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN INTERVIEW SCREEN ─────────────────────────────────────────────────
  return (
    <div style={styles.pageContainer}>
      <div style={styles.pageCard}>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Interview Simulator</h1>
            <p style={styles.subtitle}>Practice real interview scenarios with AI feedback</p>
          </div>
          {/* Phase 5: AI Interviewer Avatar */}
          <div style={styles.avatarCard}>
            <div style={styles.avatarCircle}>🤖</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>AI Interviewer</div>
              <div style={styles.statusPill}>
                <span style={{ ...styles.statusDot, background: statusDot[interviewerStatus] }} />
                <span style={{ color: statusColor[interviewerStatus], fontSize: 12, fontWeight: 600 }}>
                  {interviewerStatus}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Phase 1: Interview Type Cards */}
        <div style={{ marginBottom: 20 }}>
          <p style={styles.sectionLabel}>Select Interview Round</p>
          <div style={styles.typeGrid}>
            {interviewTypeCards.map(({ type, icon, sub }) => (
              <div
                key={type}
                onClick={() => setInterviewType(type)}
                style={{
                  ...styles.typeCard,
                  ...(interviewType === type ? styles.typeCardActive : {}),
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
                <div style={styles.typeCardLabel}>{type}</div>
                <div style={styles.typeCardSub}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 3: Dashboard Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>📋 Questions</p>
            <strong style={styles.statValue}>
              {questions.length > 0 ? `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}` : `-- / ${TOTAL_QUESTIONS}`}
            </strong>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>🏷 Round</p>
            <strong style={{ ...styles.statValue, fontSize: 16 }}>{interviewType}</strong>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>⏱ Time</p>
            <strong style={styles.statValue}>{formatTime(seconds)}</strong>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>📊 Confidence</p>
            <strong style={styles.statValue}>{confidence > 0 ? `${confidence}%` : "—"}</strong>
          </div>
        </div>

        {/* Phase 4: Progress Bar */}
        {questions.length > 0 && (
          <div style={styles.progressSection}>
            <div style={styles.progressHeader}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>Interview Progress</span>
              <strong style={{ fontSize: 13 }}>{progress}%</strong>
            </div>
            <div style={styles.progressBg}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Setup Form */}
        <div style={styles.formGridTop}>
          <input
            type="text" placeholder="Candidate Name"
            value={candidateName} onChange={(e) => setCandidateName(e.target.value)}
            style={styles.inputStyle}
          />
          <input
            type="text" placeholder="Enter Job Role (e.g. MERN Developer)"
            value={role} onChange={(e) => setRole(e.target.value)}
            style={styles.inputStyle}
          />
        </div>

        <div style={styles.formGridBottom}>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={styles.selectStyle}>
            {difficultyLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={experience} onChange={(e) => setExperience(e.target.value)} style={styles.selectStyle}>
            {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div style={styles.buttonRow}>
          <button onClick={generateQuestion} style={styles.primaryButton}>🚀 Start Interview</button>
          <button onClick={testMicrophone} style={{ ...styles.secondaryButton, background: "#16a34a" }}>🎤 Test Mic</button>
          <button onClick={resetInterview} style={styles.ghostButton}>🔄 Reset</button>
        </div>

        {loading && <div style={styles.loadingBox}>🤖 Generating AI Questions...</div>}

        {/* Question Section */}
        {questions.length > 0 && (
          <div style={styles.questionCard}>

            {/* Phase 6: Difficulty Badge + Question Counter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{
                ...styles.diffBadge,
                background: difficultyBg[difficultyLabel],
                color: difficultyColor[difficultyLabel],
                border: `1.5px solid ${difficultyColor[difficultyLabel]}30`,
              }}>
                {difficultyLabel === "Easy" ? "🟢" : difficultyLabel === "Medium" ? "🟡" : "🔴"} {difficultyLabel}
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
                Q{currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <div style={styles.questionBox}>{currentQuestion?.text}</div>

            {/* Phase 8: Follow-Up Question */}
            {showFollowUp && followUpQuestion && (
              <div style={styles.followUpBox}>
                <span style={{ fontWeight: 700, color: "#1d4ed8" }}>🤖 Follow-up: </span>
                {followUpQuestion}
              </div>
            )}

            {/* Answer Section */}
            <div style={styles.answerSection}>
              <p style={styles.answerLabel}>Your Answer</p>
              <textarea
                rows={7}
                placeholder="Write your answer here or use the microphone..."
                value={currentAnswer}
                onChange={(e) => updateCurrentAnswer(e.target.value)}
                style={styles.textareaStyle}
              />

              {/* Display character count */}
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
                Characters: {currentAnswer.trim().length} | Words: {currentAnswer.trim().split(/\s+/).filter(w => w).length}
              </div>

              {/* Phase 7: Answer Quality Bars (shown after submit) */}
              {showQuality && (
                <div style={styles.qualitySection}>
                  <p style={styles.sectionLabel}>Answer Quality</p>
                  {[
                    { label: "Communication", value: answerQuality.comm, color: "#2563eb" },
                    { label: "Technical Depth", value: answerQuality.tech, color: "#0f766e" },
                    { label: "Confidence", value: answerQuality.conf, color: "#7c3aed" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={styles.qualityRow}>
                      <span style={styles.qualityName}>{label}</span>
                      <div style={styles.qualityBg}>
                        <div style={{ ...styles.qualityFill, width: `${value}%`, background: color }} />
                      </div>
                      <span style={styles.qualityPct}>{Math.round(value)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Controls */}
              <div style={styles.voiceRow}>
                <button onClick={startSpeaking} style={{ ...styles.secondaryButton, background: "#0f766e" }}>🎤 Start</button>
                <button onClick={stopSpeaking} style={{ ...styles.secondaryButton, background: "#dc2626" }}>🛑 Stop</button>
                <button onClick={() => speakText(currentQuestion?.text)} style={{ ...styles.ghostButton, background: "#374151" }}>
                  🔊 Read Aloud
                </button>
              </div>
              <div style={styles.speechBox}>
                <p style={styles.speechLabel}>🎙 Live Speech</p>
                <p style={styles.speechText}>{transcript || "Start speaking..."}</p>
              </div>
            </div>

            <div style={styles.questionActions}>
              <button onClick={submitAnswer} style={{ ...styles.primaryButton, background: "#9333ea" }}>
                ✅ Submit Answer
              </button>
              <button onClick={goToNextQuestion} style={{ ...styles.ghostButton, background: "#111827", color: "#fff" }}>
                Next Question →
              </button>
            </div>
          </div>
        )}

        {feedbackLoading && <div style={styles.loadingBox}>🤖 Generating AI Feedback...</div>}

        {/* Feedback / Report */}
        {feedback && (
          <div style={styles.reportCard}>
            <h2 style={styles.reportTitle}>📊 Interview Report</h2>
            <div style={styles.reportGrid}>
              {[
                { label: "Communication Skills", value: `${communicationScore}/10` },
                { label: "Technical Knowledge", value: `${technicalScore}/10` },
                { label: "Confidence", value: `${confidenceScore}/10` },
                { label: "Overall Score", value: formatScore(score) },
              ].map(({ label, value }) => (
                <div key={label} style={styles.metricCard}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
                  <strong style={{ fontSize: 22, color: "#111827" }}>{value}</strong>
                </div>
              ))}
            </div>
            <div style={styles.feedbackText}>{feedback}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = {
  pageContainer: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  },
  pageCard: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "#ffffff",
    padding: 28,
    borderRadius: 20,
    border: "3px solid #111827",
    boxShadow: "10px 10px 0 #111827",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  title: { color: "#111827", fontSize: 38, lineHeight: 1.1, marginBottom: 6 },
  subtitle: { color: "#4b5563", margin: 0, fontSize: 15 },

  // Phase 5: Avatar
  avatarCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    background: "#f9fafb",
    border: "2px solid #111827",
    borderRadius: 16,
    padding: "14px 20px",
    boxShadow: "4px 4px 0 #111827",
    minWidth: 140,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#e0e7ff",
    border: "2px solid #6366f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    marginBottom: 4,
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
  },

  // Phase 1: Type Cards
  sectionLabel: {
    margin: "0 0 10px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#6b7280",
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 10,
  },
  typeCard: {
    background: "#f9fafb",
    border: "2px solid #d1d5db",
    borderRadius: 14,
    padding: "14px 8px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
  },
  typeCardActive: {
    background: "#eff6ff",
    border: "2.5px solid #2563eb",
    boxShadow: "4px 4px 0 #2563eb",
  },
  typeCardLabel: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 2 },
  typeCardSub: { fontSize: 11, color: "#9ca3af" },

  // Phase 3: Stats
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    padding: 14,
    borderRadius: 12,
    background: "#f9fafb",
    border: "2px solid #111827",
    textAlign: "center",
    boxShadow: "4px 4px 0 #cbd5e1",
  },
  statLabel: { margin: 0, fontSize: 13, fontWeight: 700, color: "#374151" },
  statValue: { display: "block", marginTop: 5, fontSize: 20, fontWeight: 800, color: "#111827" },

  // Phase 4: Progress Bar
  progressSection: { marginBottom: 20 },
  progressHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  progressBg: { height: 10, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", border: "1.5px solid #d1d5db" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#2563eb,#7c3aed)", borderRadius: 99, transition: "width 0.4s ease" },

  // Form
  formGridTop: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 },
  formGridBottom: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 },
  inputStyle: { width: "100%", padding: 13, borderRadius: 12, border: "2px solid #111827", fontSize: 15, outline: "none", boxSizing: "border-box" },
  selectStyle: { width: "100%", padding: 13, borderRadius: 12, border: "2px solid #111827", fontSize: 15, background: "#fff", outline: "none", boxSizing: "border-box" },
  buttonRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 },

  // Buttons
  primaryButton: { padding: "11px 18px", background: "#2563eb", color: "#fff", border: "2px solid #111827", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "4px 4px 0 #111827" },
  secondaryButton: { padding: "11px 18px", background: "#0f766e", color: "#fff", border: "2px solid #111827", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "4px 4px 0 #111827" },
  ghostButton: { padding: "11px 18px", background: "#64748b", color: "#fff", border: "2px solid #111827", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "4px 4px 0 #111827" },

  loadingBox: { marginTop: 16, background: "#fef3c7", padding: 16, borderRadius: 12, border: "2px solid #111827", textAlign: "center", fontWeight: 700, fontSize: 15 },

  // Question Card
  questionCard: { marginTop: 24, background: "#eff6ff", padding: 28, borderRadius: 18, border: "2px solid #111827", boxShadow: "8px 8px 0 #111827" },
  questionBox: { background: "#fff", padding: 24, borderRadius: 14, lineHeight: 1.7, fontSize: 20, fontWeight: 600, whiteSpace: "pre-wrap", border: "2px solid #111827", marginBottom: 16 },

  // Phase 6: Difficulty badge
  diffBadge: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, padding: "4px 12px", borderRadius: 99, fontWeight: 700 },

  // Phase 8: Follow-up
  followUpBox: { background: "#fdf4ff", border: "2px solid #d8b4fe", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 14, lineHeight: 1.6, color: "#581c87" },

  // Answer Section
  answerSection: { display: "flex", flexDirection: "column", gap: 12 },
  answerLabel: { margin: 0, fontSize: 17, fontWeight: 800, color: "#111827" },
  textareaStyle: { width: "100%", padding: 14, borderRadius: 12, border: "2px solid #111827", resize: "vertical", fontSize: 15, lineHeight: 1.7, minHeight: 140, boxSizing: "border-box" },

  // Phase 7: Quality Bars
  qualitySection: { background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: "14px 16px" },
  qualityRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  qualityName: { fontSize: 12, fontWeight: 600, color: "#6b7280", width: 120, flexShrink: 0 },
  qualityBg: { flex: 1, height: 8, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" },
  qualityFill: { height: "100%", borderRadius: 99, transition: "width 0.5s ease" },
  qualityPct: { fontSize: 11, color: "#9ca3af", minWidth: 32, textAlign: "right" },

  voiceRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  speechBox: { background: "#f8fafc", padding: 14, borderRadius: 12, border: "2px solid #111827" },
  speechLabel: { margin: 0, fontWeight: 800, color: "#111827", fontSize: 14 },
  speechText: { margin: "6px 0 0", color: "#374151", fontSize: 14 },

  questionActions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 },

  // Report
  reportCard: { marginTop: 24, background: "#fff", padding: 24, borderRadius: 18, border: "2px solid #111827", boxShadow: "8px 8px 0 #111827" },
  reportTitle: { color: "#111827", marginBottom: 14, fontSize: 20 },
  reportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 },
  metricCard: { background: "#f9fafb", border: "2px solid #111827", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 6, boxShadow: "4px 4px 0 #d1d5db" },
  feedbackText: { whiteSpace: "pre-wrap", lineHeight: 1.9, fontSize: 15, color: "#111827", marginTop: 14 },

  // Phase 9: Completion
  overallScoreCircle: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 },
  scoreCircle: { width: 120, height: 120, borderRadius: "50%", background: "#eff6ff", border: "4px solid #2563eb", boxShadow: "6px 6px 0 #111827", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  scoreCircleNum: { fontSize: 36, fontWeight: 800, color: "#1d4ed8", lineHeight: 1 },
  scoreCircleSub: { fontSize: 14, color: "#6b7280", fontWeight: 600 },
  recommendBadge: { display: "inline-block", padding: "6px 18px", borderRadius: 99, fontSize: 14, fontWeight: 700 },
  scoreGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 24 },
  scoreCard: { background: "#f9fafb", border: "2px solid #111827", borderRadius: 14, padding: "18px 14px", textAlign: "center", boxShadow: "4px 4px 0 #d1d5db" },
  scoreCardNum: { fontSize: 26, fontWeight: 800, color: "#111827", margin: "4px 0" },
  scoreCardLabel: { fontSize: 13, color: "#6b7280", fontWeight: 600 },
  completionActions: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" },
};

export default MockInterview;