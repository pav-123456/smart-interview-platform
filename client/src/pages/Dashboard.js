import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-10px)";
    e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.12)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0px)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
  };

  const cards = [
    {
      title: "Resume Upload",
      icon: "📄",
      description: "Upload resume for ATS score and AI feedback.",
      buttonText: "Upload Resume",
      path: "/upload",
    },
    {
      title: "AI Resume Builder",
      icon: "📄",
      description: "Generate ATS-friendly resumes using AI.",
      buttonText: "Open Resume Builder",
      path: "/resume-builder",
    },
    {
      title: "AI Interview",
      icon: "🤖",
      description: "Get AI-generated technical questions instantly.",
      buttonText: "Start Interview",
      path: "/interview",
    },
    {
      title: "Mock Interview",
      icon: "🧠",
      description: "Practice structured AI interview flow.",
      buttonText: "Start Mock Interview",
      path: "/mock-interview",
    },
    {
      title: "Interview History",
      icon: "📜",
      description: "View all past interviews and results.",
      buttonText: "View History",
      path: "/history",
    },
    {
      title: "Analytics",
      icon: "📊",
      description: "Track your performance improvement.",
      buttonText: "Open Analytics",
      path: "/analytics",
    },
    {
      title: "AI Career Coach",
      icon: "🤖",
      description: "Get AI-powered career guidance and resume help.",
      buttonText: "Open Career Coach",
      path: "/career-coach",
    },
    {
      title: "Job Recommendations",
      icon: "💼",
      description: "Find AI-powered job matches based on your skills.",
      buttonText: "Find Jobs",
      path: "/job-recommendations",
    },
    {
      title: "Certificates",
      icon: "🏆",
      description: "Earn AI-powered interview certificates.",
      buttonText: "Open Certificates",
      path: "/certificate",
    },
    {
      title: "Career Roadmap",
      icon: "🗺️",
      description: "Generate AI-powered career roadmap.",
      buttonText: "Open Roadmap",
      path: "/roadmap",
    },
  ];

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src="/dashboard-bg.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          background: "rgba(0,0,0,0.72)",
          zIndex: -1,
        }}
      />

      <div style={mainContainer}>

        {/* NAVBAR */}
        <div style={navbar}>
          <h2 style={logo}>🚀 Smart Interview Platform</h2>
          <button onClick={logout} style={logoutButton}>🔐 Logout</button>
        </div>

        {/* HERO */}
        <div style={heroSection}>
          <h1 style={mainTitle}>AI Powered Interview Preparation System</h1>
          <p style={heroText}>
            Practice interviews with AI and smart analytics to improve your performance.
          </p>
        </div>

        {/* STATS */}
        <div style={statsContainer}>
          <div style={statsCard}>
            <h2>🤖</h2>
            <h3>AI Interviews</h3>
            <p>25 Completed</p>
          </div>
          <div style={statsCard}>
            <h2>📜</h2>
            <h3>History</h3>
            <p>40 Records</p>
          </div>
          <div style={statsCard}>
            <h2>📊</h2>
            <h3>Analytics</h3>
            <p>85% Avg Score</p>
          </div>
          <div style={statsCard}>
            <h2>💼</h2>
            <h3>Jobs Found</h3>
            <p>100+ Matches</p>
          </div>
          <div style={statsCard}>
            <h2>📄</h2>
            <h3>ATS Score</h3>
            <p>88%</p>
          </div>
          <div style={statsCard}>
            <h2>🏆</h2>
            <h3>Certificates</h3>
            <p>5 Earned</p>
          </div>
        </div>

        {/* CAREER PROGRESS OVERVIEW */}
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "40px",
            color: "white",
          }}
        >
          <h2>🚀 Career Progress Overview</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div style={progressItem}>
              <h3>💼 Job Matches</h3>
              <p>100 Available Jobs</p>
              <div style={progressBarWrap}>
                <div style={{ ...progressBarFill, width: "100%", background: "#2563eb" }} />
              </div>
            </div>
            <div style={progressItem}>
              <h3>📄 Resume Score</h3>
              <p>ATS Score: 88%</p>
              <div style={progressBarWrap}>
                <div style={{ ...progressBarFill, width: "88%", background: "#16a34a" }} />
              </div>
            </div>
            <div style={progressItem}>
              <h3>🧠 Skill Gap</h3>
              <p>4 Skills Missing</p>
              <div style={progressBarWrap}>
                <div style={{ ...progressBarFill, width: "60%", background: "#f59e0b" }} />
              </div>
            </div>
            <div style={progressItem}>
              <h3>🎯 Interview Readiness</h3>
              <p>82%</p>
              <div style={progressBarWrap}>
                <div style={{ ...progressBarFill, width: "82%", background: "#7c3aed" }} />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CARDS */}
        <div style={cardGrid}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div style={iconStyle}>{card.icon}</div>
              <h2 style={cardTitle}>{card.title}</h2>
              <p style={cardText}>{card.description}</p>
              <button onClick={() => navigate(card.path)} style={buttonStyle}>
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginTop: "40px", marginBottom: "40px" }}>
          <h2 style={{ color: "white", marginBottom: "20px" }}>⚡ Quick Actions</h2>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button style={quickBtn} onClick={() => navigate("/resume-builder")}>
              📄 Build Resume
            </button>
            <button style={quickBtn} onClick={() => navigate("/job-recommendations")}>
              💼 Find Jobs
            </button>
            <button style={quickBtn} onClick={() => navigate("/career-coach")}>
              🤖 Career Advice
            </button>
            <button style={quickBtn} onClick={() => navigate("/mock-interview")}>
              🧠 Practice Interview
            </button>
            <button style={quickBtn} onClick={() => navigate("/roadmap")}>
              🗺️ Career Roadmap
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div style={footer}>© 2026 Smart Interview Platform</div>
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const mainContainer = {
  minHeight: "100vh",
  padding: "30px",
  fontFamily: "Arial",
  position: "relative",
  zIndex: 1,
};

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
};

const logo = {
  fontSize: "32px",
  color: "white",
  fontWeight: "bold",
  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
};

const logoutButton = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s",
};

const heroSection = {
  textAlign: "center",
  marginBottom: "60px",
  marginTop: "40px",
};

const mainTitle = {
  fontSize: "clamp(32px, 5vw, 56px)",
  fontWeight: "800",
  color: "#ffffff",
  textShadow: "0 4px 20px rgba(0,0,0,0.8)",
  marginBottom: "20px",
};

const heroText = {
  color: "#f1f5f9",
  maxWidth: "800px",
  margin: "auto",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: "15px",
  marginBottom: "30px",
};

const statsCard = {
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "white",
  padding: "25px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
};

const progressItem = {
  background: "rgba(255,255,255,0.07)",
  borderRadius: "14px",
  padding: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
};

const progressBarWrap = {
  marginTop: "10px",
  height: "6px",
  background: "rgba(255,255,255,0.15)",
  borderRadius: "99px",
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  borderRadius: "99px",
  transition: "width 0.6s ease",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "20px",
  marginBottom: "10px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  padding: "30px",
  borderRadius: "24px",
  textAlign: "center",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  transition: "all 0.4s ease",
};

const iconStyle = {
  fontSize: "45px",
  marginBottom: "10px",
};

const cardTitle = {
  marginBottom: "10px",
  fontSize: "22px",
};

const cardText = {
  color: "#e2e8f0",
  minHeight: "60px",
  marginBottom: "15px",
  fontSize: "14px",
  lineHeight: "1.5",
};

const buttonStyle = {
  marginTop: "15px",
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "14px",
};

const quickBtn = {
  padding: "14px 24px",
  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.25s",
  fontSize: "14px",
  boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
};

const footer = {
  textAlign: "center",
  marginTop: "20px",
  color: "#94a3b8",
  fontSize: "13px",
  paddingBottom: "20px",
};

export default Dashboard;