import React, { useState } from "react";

function Interview() {

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("Google");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [experience, setExperience] = useState("Fresher");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [readiness, setReadiness] = useState(0);

  const generateQuestions = async () => {

    if (!role) {

      alert("Please enter role");

      return;
    }

    // CLEAR OLD DATA FIRST
    setQuestions([]);
    setExpandedIndex(null);
    setSearchTerm("");

    // DEBUG: Check what we're sending
    console.log("SENDING TYPE:", interviewType);
    console.log("SENDING DATA:", {
      role,
      company,
      interviewType,
      difficulty,
      experience,
    });

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/interview-answers",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            role,
            company,
            interviewType,
            difficulty,
            experience,
          }),

        }
      );

      const data = await res.json();

      // MAIN DEBUG - CRITICAL
      console.log("===========");
      console.log("TYPE SENT:", interviewType);
      console.log("AI RESULT:");
      console.log(data.result);
      console.log("===========");

      // Log first 500 characters
      console.log("📝 FIRST 500 CHARS:");
      console.log(data.result.substring(0, 500));

      // FIX 1: Use regex match to correctly extract questions
      const sections = data.result.match(
        /Q\d+\.[\s\S]*?(?=Q\d+\.|$)/g
      ) || [];

      console.log("QUESTIONS FOUND:", sections.length);

      if (sections.length === 0) {
        console.log("⚠️ NO QUESTIONS FOUND - Using entire response");
        setQuestions([data.result]);
      } else {
        setQuestions(sections);
      }

      // Set readiness score after successful generation
      setReadiness(
        Math.floor(
          Math.random() * 30 + 70
        )
      );

      setLoading(false);

    } catch (error) {

      console.log("❌ ERROR:", error);

      alert("Failed to generate questions: " + error.message);

      setLoading(false);

    }
  };

  // STEP 16: Get Difficulty Badge
  const getDifficulty = (question) => {
    const length = question.length;

    if (length < 120) return "Easy";
    if (length < 250) return "Medium";
    return "Hard";
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "#dcfce7";
    if (difficulty === "Medium") return "#fef3c7";
    return "#fee2e2";
  };

  // Get difficulty text color
  const getDifficultyTextColor = (difficulty) => {
    if (difficulty === "Easy") return "#15803d";
    if (difficulty === "Medium") return "#92400e";
    return "#b91c1c";
  };

  // Filter questions by search term only
  const filteredQuestions = questions.filter((item) => {
    if (!searchTerm.trim()) return true;
    return item
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      );
  });

  // Interview type cards data
  const interviewCards = [
    { type: "Technical", icon: "💻", label: "Technical" },
    { type: "HR", icon: "👔", label: "HR" },
    { type: "Coding", icon: "🧠", label: "Coding" },
    { type: "Project", icon: "🚀", label: "Project" },
    { type: "Full", icon: "🎯", label: "Full Interview" },
  ];

  // Company cards data
  const companyCards = [
    { name: "Google", icon: "🔵" },
    { name: "Microsoft", icon: "🟦" },
    { name: "Amazon", icon: "🟧" },
    { name: "Meta", icon: "🔷" },
    { name: "Netflix", icon: "🔴" },
    { name: "TCS", icon: "🔵" },
    { name: "Infosys", icon: "🟣" },
    { name: "Wipro", icon: "🟠" },
  ];

  // Stats card style
  const statCard = {
    flex: 1,
    background: "#eff6ff",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #bfdbfe",
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >

        {/* Company Banner */}
        <div
          style={{
            background:
              "linear-gradient(90deg,#2563eb,#7c3aed)",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "25px",
            color: "white",
            textAlign: "center",
          }}
        >

          <h2>
            🏢 {company}
            Interview Preparation
          </h2>

          <p>
            Role: {role || "Select Role"}
          </p>

          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            Type: {interviewType}
          </p>

        </div>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          🏢 {company} Interview Simulator
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Practice company-specific interview questions
        </p>

        {/* FIX 5: Company Cards Instead of Dropdown */}
        <h3
          style={{
            marginBottom: "15px",
            color: "#1e293b",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Select Company
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {companyCards.map((comp) => (
            <div
              key={comp.name}
              onClick={() => setCompany(comp.name)}
              style={{
                padding: "15px",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "center",
                border:
                  company === comp.name
                    ? "3px solid #2563eb"
                    : "1px solid #e5e7eb",
                background:
                  company === comp.name
                    ? "#dbeafe"
                    : "#fff",
                transition: "all 0.3s ease",
              }}
            >
              <h2 style={{ fontSize: "24px", margin: "0 0 5px 0" }}>
                {comp.icon}
              </h2>
              <p style={{ margin: "0", fontSize: "12px", fontWeight: "600" }}>
                {comp.name}
              </p>
            </div>
          ))}
        </div>

        {/* Role Input */}
        <input
          type="text"
          placeholder="Enter Role (e.g. MERN Developer)"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        {/* STEP 17: Interview Type Cards */}
        <h3
          style={{
            marginBottom: "15px",
            color: "#1e293b",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Select Interview Round
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          {interviewCards.map((card) => (
            <div
              key={card.type}
              onClick={() => {
                setInterviewType(card.type);
                console.log("Selected:", card.type);
              }}
              style={{
                padding: "20px",
                borderRadius: "15px",
                cursor: "pointer",
                textAlign: "center",
                border:
                  interviewType === card.type
                    ? "3px solid #2563eb"
                    : "1px solid #e5e7eb",
                background:
                  interviewType === card.type
                    ? "#dbeafe"
                    : "#fff",
                transition: "all 0.3s ease",
                boxShadow:
                  interviewType === card.type
                    ? "0 4px 12px rgba(37, 99, 235, 0.2)"
                    : "none",
              }}
              onMouseOver={(e) => {
                if (interviewType !== card.type) {
                  e.currentTarget.style.borderColor = "#bfdbfe";
                  e.currentTarget.style.background = "#f0f9ff";
                }
              }}
              onMouseOut={(e) => {
                if (interviewType !== card.type) {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#fff";
                }
              }}
            >
              <h2 style={{ fontSize: "36px", margin: "0 0 8px 0" }}>
                {card.icon}
              </h2>
              <h4 style={{ margin: "0", color: "#1e293b", fontWeight: "600" }}>
                {card.label}
              </h4>
            </div>
          ))}
        </div>

        {/* FIX 2: Show Current Selected Round */}
        <div
          style={{
            marginTop: "15px",
            marginBottom: "20px",
            padding: "12px",
            background: "#dbeafe",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#1e40af",
          }}
        >
          Selected Round: {interviewType}
        </div>

        {/* Difficulty Selection */}
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>

        {/* Experience Selection */}
        <select
          value={experience}
          onChange={(e) =>
            setExperience(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        >
          <option value="Fresher">Fresher</option>
          <option value="1-2 Years">1-2 Years</option>
          <option value="3-5 Years">3-5 Years</option>
          <option value="5+ Years">5+ Years</option>
        </select>

        {/* Button */}
        <button
          onClick={generateQuestions}
          style={{
            width: "100%",
            padding: "14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
          onMouseOut={(e) => e.target.style.background = "#2563eb"}
        >
          Generate Questions
        </button>

        {/* FIX 4: Advanced Stats Row */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "25px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div style={statCard}>
            <h3>🏢 Company</h3>
            <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>
              {company}
            </p>
          </div>

          <div style={statCard}>
            <h3>💼 Role</h3>
            <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>
              {role || "--"}
            </p>
          </div>

          <div style={statCard}>
            <h3>🎯 Round</h3>
            <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>
              {interviewType}
            </p>
          </div>

          <div style={statCard}>
            <h3>⭐ Difficulty</h3>
            <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>
              {difficulty}
            </p>
          </div>
        </div>

        {/* FIX 6: Interview Readiness Meter */}
        {readiness > 0 && (
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              padding: "15px",
              background: "#f0fdf4",
              borderRadius: "10px",
              border: "1px solid #bbf7d0",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#15803d" }}>
              Interview Readiness: {readiness}%
            </h3>

            <div
              style={{
                height: "12px",
                background: "#e5e7eb",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${readiness}%`,
                  height: "100%",
                  background: "#10b981",
                  borderRadius: "20px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#fef3c7",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "2px solid #f59e0b",
            }}
          >
            <h3>🤖 Generating AI Questions...</h3>
          </div>
        )}

        {/* Modern Question Cards */}
        {questions.length > 0 && (

          <div style={{ marginTop: "30px" }}>

            <h2
              style={{
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              📚 {interviewType} Interview Guide
            </h2>

            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#6b7280",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              📚 {interviewType} Questions Found: {questions.length}
            </div>

            {/* STEP 14: Search Box */}
            <input
              type="text"
              placeholder="🔍 Search Questions..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "20px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />

            {/* Questions Display */}
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item, index) => (

                <div
                  key={index}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "15px",
                    padding: "20px",
                    marginBottom: "15px",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.05)"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      Q{index + 1}
                    </h3>

                    {/* STEP 16: Difficulty Badge */}
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        background: getDifficultyColor(
                          getDifficulty(item)
                        ),
                        color: getDifficultyTextColor(
                          getDifficulty(item)
                        ),
                      }}
                    >
                      {getDifficulty(item)}
                    </span>
                  </div>

                  {/* Show preview of question/answer */}
                  <div
                    style={{
                      background: "#f9fafb",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      fontSize: "14px",
                      color: "#374151",
                      maxHeight: "80px",
                      overflow: "hidden",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.substring(0, 250)}...
                  </div>

                  <button
                    onClick={() =>
                      setExpandedIndex(
                        expandedIndex === index
                          ? null
                          : index
                      )
                    }
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {expandedIndex === index
                      ? "Hide Full Answer"
                      : "Show Full Answer"}
                  </button>

                  {expandedIndex === index && (

                    <div
                      style={{
                        marginTop: "15px",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.8",
                        fontSize: "15px",
                        color: "#374151",
                        background: "#f9fafb",
                        padding: "15px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #2563eb",
                        wordBreak: "break-word",
                      }}
                    >

                      {item}

                    </div>

                  )}

                </div>

              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: "40px 20px",
                  fontSize: "18px",
                }}
              >
                No questions found. Try a different search term.
              </div>
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Interview;