import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumeBuilder.css";

// ============================================================
// CONSTANTS — Templates, Colors, Fonts
// ============================================================

const TEMPLATES = {
  modern: {
    name: "Modern",
    primary: "#2563eb",
    secondary: "#1e40af",
    accent: "#3b82f6",
    bg: "#ffffff",
    text: "#1e293b",
    headerBg: "#2563eb",
    headerText: "#ffffff",
    sectionStyle: "underline",
  },
  professional: {
    name: "Professional",
    primary: "#1e293b",
    secondary: "#475569",
    accent: "#64748b",
    bg: "#ffffff",
    text: "#1e293b",
    headerBg: "#f1f5f9",
    headerText: "#0f172a",
    sectionStyle: "bar-left",
  },
  minimal: {
    name: "Minimal",
    primary: "#000000",
    secondary: "#333333",
    accent: "#666666",
    bg: "#ffffff",
    text: "#000000",
    headerBg: "#ffffff",
    headerText: "#000000",
    sectionStyle: "line",
  },
  creative: {
    name: "Creative",
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#c084fc",
    bg: "#ffffff",
    text: "#1e293b",
    headerBg: "#7c3aed",
    headerText: "#ffffff",
    sectionStyle: "pill",
  },
  dark: {
    name: "Dark Mode",
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#6ee7b7",
    bg: "#111827",
    text: "#e2e8f0",
    headerBg: "#1f2937",
    headerText: "#f9fafb",
    sectionStyle: "underline",
  },
  executive: {
    name: "Executive",
    primary: "#1e3a5f",
    secondary: "#2c5282",
    accent: "#3182ce",
    bg: "#ffffff",
    text: "#1a202c",
    headerBg: "#1e3a5f",
    headerText: "#ffffff",
    sectionStyle: "bar-left",
  },
  gradient: {
    name: "Gradient",
    primary: "#db2777",
    secondary: "#e11d48",
    accent: "#f43f5e",
    bg: "#ffffff",
    text: "#1e293b",
    headerBg: "linear-gradient(135deg, #db2777, #7c3aed)",
    headerText: "#ffffff",
    sectionStyle: "pill",
  },
  ats: {
    name: "ATS Optimized",
    primary: "#000000",
    secondary: "#333333",
    accent: "#000000",
    bg: "#ffffff",
    text: "#000000",
    headerBg: "#ffffff",
    headerText: "#000000",
    sectionStyle: "line",
  },
};

const FONT_FAMILIES = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
];

const SECTION_TITLES = {
  summary: "Professional Summary",
  skills: "Skills",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
  interests: "Interests",
  references: "References",
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function ResumeBuilder() {
  // ---- Form state ----
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
    certifications: "",
    achievements: "",
    languages: "",
    interests: "",
  });

  // ---- UI state ----
  const [template, setTemplate] = useState("modern");
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  const [fontSize, setFontSize] = useState(14);
  const [profileImage, setProfileImage] = useState(null);
  const [generatedResume, setGeneratedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [strengths, setStrengths] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "preview" | "ats" | "cover"
  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
    achievements: true,
    languages: false,
    interests: false,
  });
  const [sectionOrder, setSectionOrder] = useState([
    "summary", "skills", "experience", "education",
    "projects", "certifications", "achievements", "languages", "interests",
  ]);
  const [showSectionConfig, setShowSectionConfig] = useState(false);

  const resumePreviewRef = useRef(null);

  // ---- Load history on mount ----
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setResumeHistory(history);
  }, []);

  // ---- Handlers ----
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleSection = (key) => {
    setVisibleSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const moveSection = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= sectionOrder.length) return;
    const newOrder = [...sectionOrder];
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    setSectionOrder(newOrder);
  };

  // ---- Generate resume via AI ----
  const generateResume = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setGeneratedResume(data.resume || "");
      setCoverLetter(data.coverLetter || "");
      setAtsScore(data.atsScore || 70);
      setStrengths(data.strengths || ["Good skills section", "Has project experience"]);
      setSuggestions(data.suggestions || ["Add more quantifiable achievements"]);
      setLoading(false);
      setActiveTab("preview");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to generate resume. Check if the server is running.");
    }
  };

  // ---- Simulate ATS scan locally ----
  const scanATS = () => {
    let score = 50;
    if (formData.skills.length > 30) score += 15;
    if (formData.experience.length > 50) score += 10;
    if (formData.education.length > 10) score += 5;
    if (formData.summary.length > 40) score += 5;
    if (formData.linkedin) score += 5;
    if (formData.github) score += 5;
    if (formData.certifications.length > 10) score += 5;
    score = Math.min(score, 100);
    setAtsScore(score);

    const strs = [];
    const sug = [];
    if (formData.skills.length > 30) strs.push("Strong technical skills section");
    else sug.push("Expand your skills list with more relevant technologies");
    if (formData.experience.length > 50) strs.push("Detailed work experience");
    else sug.push("Add more detail to work experience with action verbs");
    if (formData.summary.length > 40) strs.push("Clear professional summary");
    else sug.push("Write a concise professional summary (2-3 sentences)");
    if (formData.linkedin) strs.push("LinkedIn profile included");
    else sug.push("Add your LinkedIn profile URL");
    if (formData.certifications.length > 10) strs.push("Relevant certifications listed");
    else sug.push("Include any professional certifications");
    setStrengths(strs);
    setSuggestions(sug);
    setActiveTab("ats");
  };

  // ---- Save / Share / Download ----
  const saveResume = () => {
    const history = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    const entry = {
      id: Date.now(),
      name: formData.name || "Untitled",
      resume: generatedResume,
      template,
      date: new Date().toLocaleString(),
    };
    history.unshift(entry);
    localStorage.setItem("resumeHistory", JSON.stringify(history));
    setResumeHistory(history);
    alert("Resume saved successfully!");
  };

  const shareResume = async () => {
    try {
      const text = `
${formData.name}
${formData.title ? formData.title : ""}
${formData.email} | ${formData.phone} | ${formData.location}
${formData.linkedin ? "LinkedIn: " + formData.linkedin : ""}
${formData.github ? "GitHub: " + formData.github : ""}

${generatedResume}
`;
      await navigator.clipboard.writeText(text.trim());
      alert("Resume copied to clipboard!");
    } catch {
      alert("Failed to copy. Try again.");
    }
  };

  const downloadPDF = async () => {
    const el = resumePreviewRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${formData.name || "Resume"}_Resume.pdf`);
  };

  const loadHistoryItem = (item) => {
    setGeneratedResume(item.resume);
    setTemplate(item.template || "modern");
    setActiveTab("preview");
  };

  const deleteHistoryItem = (id) => {
    const history = resumeHistory.filter((h) => h.id !== id);
    localStorage.setItem("resumeHistory", JSON.stringify(history));
    setResumeHistory(history);
  };

  // ---- Current theme ----
  const theme = TEMPLATES[template];

  // ---- Render section content for preview ----
  const renderSectionContent = (key) => {
    const content = generatedResume || "";
    if (!content) return <p style={{ color: "#999", fontStyle: "italic" }}>Generate your resume to see content here.</p>;

    const sectionLabels = {
      summary: /summary|profile|objective/i,
      skills: /skills|technologies|proficiencies/i,
      experience: /experience|employment|work history/i,
      education: /education|academic/i,
      projects: /projects|portfolio/i,
      certifications: /certifications|certificates/i,
      achievements: /achievements|awards|honors/i,
      languages: /languages/i,
      interests: /interests|hobbies/i,
    };

    // For the purpose of preview, render the full content
    // In a real app you'd parse the AI output but we render it as-is
    if (content.length > 0 && key === "summary") {
      return <p style={{ lineHeight: 1.7 }}>{content.split("\n").slice(0, 4).join(" ")}</p>;
    }

    // Render content by sections (simple split approach)
    const lines = content.split("\n");
    const relevant = [];

    let capturing = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if this line starts a new section
      const isSectionHeader = Object.entries(sectionLabels).some(([k, regex]) => {
        return regex.test(trimmed) && trimmed.length < 50 && !trimmed.startsWith("•") && !trimmed.startsWith("-");
      });

      if (isSectionHeader) {
        capturing = sectionLabels[key].test(trimmed);
        if (capturing) relevant.push(trimmed);
        continue;
      }

      // Stop capturing if we hit a different section header
      const isOtherSection = Object.entries(sectionLabels).some(([k, regex]) => {
        return k !== key && regex.test(trimmed) && trimmed.length < 50 && !trimmed.startsWith("•") && !trimmed.startsWith("-");
      });

      if (isOtherSection && capturing) {
        capturing = false;
        continue;
      }

      if (capturing) relevant.push(trimmed);
    }

    if (relevant.length === 0 && key === "summary") {
      return <p style={{ lineHeight: 1.7 }}>{content.slice(0, 300)}...</p>;
    }

    return (
      <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
        {relevant.slice(0, 8).map((line, i) => (
          <li key={i}>{line}</li>
        ))}
        {relevant.length === 0 && <li style={{ color: "#999", fontStyle: "italic" }}>No data for this section yet.</li>}
      </ul>
    );
  };

  // ---- SECTION HEADER STYLES based on template ----
  const getSectionHeaderStyle = () => {
    switch (theme.sectionStyle) {
      case "underline":
        return { borderBottom: `3px solid ${theme.primary}`, paddingBottom: "4px", marginBottom: "12px" };
      case "bar-left":
        return { borderLeft: `5px solid ${theme.primary}`, paddingLeft: "12px", marginBottom: "12px" };
      case "line":
        return { borderBottom: `1px solid ${theme.accent}`, paddingBottom: "4px", marginBottom: "12px" };
      case "pill":
        return {
          background: theme.primary,
          color: theme.headerText,
          padding: "8px 16px",
          borderRadius: "20px",
          marginBottom: "12px",
          display: "inline-block",
        };
      default:
        return { borderBottom: `2px solid ${theme.primary}`, paddingBottom: "4px", marginBottom: "12px" };
    }
  };

  // ---- RESUME PREVIEW JSX ----
  const resumePreviewJSX = (
    <div
      ref={resumePreviewRef}
      className="resume-preview-print"
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        color: theme.text,
        background: theme.bg,
        padding: "40px 50px",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "1100px",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: theme.headerBg,
          color: theme.headerText,
          padding: "28px 30px",
          borderRadius: "10px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            crossOrigin="anonymous"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${theme.headerText}`,
              flexShrink: 0,
            }}
          />
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>
            {formData.name || "Your Name"}
          </h1>
          {formData.title && (
            <p style={{ margin: "4px 0 8px", fontSize: "16px", opacity: 0.85 }}>
              {formData.title}
            </p>
          )}
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
            {formData.email && `📧 ${formData.email}`}
            {formData.phone && ` | 📱 ${formData.phone}`}
            {formData.location && ` | 📍 ${formData.location}`}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", opacity: 0.8 }}>
            {formData.website && `🌐 ${formData.website} | `}
            {formData.linkedin && `🔗 ${formData.linkedin} | `}
            {formData.github && `💻 ${formData.github}`}
          </p>
        </div>
      </div>

      {/* SECTIONS in user-defined order */}
      {sectionOrder.map((key) => {
        if (!visibleSections[key]) return null;
        const title = SECTION_TITLES[key];
        return (
          <div key={key} style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: `${fontSize + 2}px`, fontWeight: 700, color: theme.primary, ...getSectionHeaderStyle() }}>
              {title}
            </h3>
            <div>{renderSectionContent(key)}</div>
          </div>
        );
      })}
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="rb-wrapper">
      {/* TOP NAV */}
      <div className="rb-navbar">
        <h1 className="rb-logo">🚀 AI Resume Builder Pro</h1>
        <div className="rb-nav-tabs">
          <button className={activeTab === "editor" ? "active" : ""} onClick={() => setActiveTab("editor")}>✏️ Editor</button>
          <button className={activeTab === "preview" ? "active" : ""} onClick={() => setActiveTab("preview")}>👁 Preview</button>
          <button className={activeTab === "ats" ? "active" : ""} onClick={() => { scanATS(); }}>🎯 ATS Score</button>
          <button className={activeTab === "cover" ? "active" : ""} onClick={() => setActiveTab("cover")}>📩 Cover Letter</button>
        </div>
        <div className="rb-nav-actions">
          <button onClick={downloadPDF} className="rb-btn rb-btn-primary">📥 Download PDF</button>
          <button onClick={saveResume} className="rb-btn rb-btn-warning">💾 Save</button>
          <button onClick={shareResume} className="rb-btn rb-btn-purple">📤 Share</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="rb-main">
        {/* EDITOR TAB */}
        {activeTab === "editor" && (
          <div className="rb-editor-layout">
            {/* LEFT: Form */}
            <div className="rb-editor-form">
              {/* TEMPLATE SELECTION */}
              <div className="rb-card">
                <h2>🎨 Template</h2>
                <div className="rb-template-grid">
                  {Object.entries(TEMPLATES).map(([key, t]) => (
                    <div
                      key={key}
                      className={`rb-template-card ${template === key ? "selected" : ""}`}
                      onClick={() => setTemplate(key)}
                      style={{ borderColor: template === key ? t.primary : "#ddd" }}
                    >
                      <div className="rb-template-preview" style={{ background: t.headerBg }}>
                        <div style={{ background: t.primary, height: "8px", width: "40%", borderRadius: "2px" }} />
                        <div style={{ background: t.accent, height: "4px", width: "70%", borderRadius: "2px", marginTop: "4px" }} />
                        <div style={{ background: t.accent, height: "4px", width: "50%", borderRadius: "2px", marginTop: "4px" }} />
                      </div>
                      <span style={{ color: t.primary, fontWeight: template === key ? 700 : 500 }}>{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FONT & SIZE */}
              <div className="rb-card">
                <h2>🔤 Typography</h2>
                <div className="rb-row">
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="rb-input">
                    {FONT_FAMILIES.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  <div className="rb-font-size-control">
                    <label>Size: {fontSize}px</label>
                    <input type="range" min="11" max="20" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* PROFILE PHOTO */}
              <div className="rb-card">
                <h2>📷 Profile Photo</h2>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {profileImage && (
                  <img src={profileImage} alt="profile" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginTop: "10px" }} />
                )}
              </div>

              {/* PERSONAL INFO */}
              <div className="rb-card">
                <h2>👤 Personal Info</h2>
                <div className="rb-form-grid">
                  <input name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className="rb-input" />
                  <input name="title" placeholder="Job Title (e.g. Software Engineer)" value={formData.title} onChange={handleChange} className="rb-input" />
                  <input name="email" placeholder="Email *" value={formData.email} onChange={handleChange} className="rb-input" />
                  <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="rb-input" />
                  <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="rb-input" />
                  <input name="website" placeholder="Portfolio Website" value={formData.website} onChange={handleChange} className="rb-input" />
                  <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} className="rb-input" />
                  <input name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} className="rb-input" />
                </div>
              </div>

              {/* SECTION CONFIG */}
              <div className="rb-card">
                <div className="rb-card-header" onClick={() => setShowSectionConfig(!showSectionConfig)} style={{ cursor: "pointer" }}>
                  <h2>📑 Resume Sections</h2>
                  <span>{showSectionConfig ? "▲" : "▼"}</span>
                </div>
                {showSectionConfig && (
                  <div className="rb-section-config">
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>Toggle visibility & drag to reorder sections</p>
                    {sectionOrder.map((key, index) => (
                      <div key={key} className="rb-section-row">
                        <div className="rb-section-move">
                          <button onClick={() => moveSection(index, -1)} disabled={index === 0} title="Move up">▲</button>
                          <button onClick={() => moveSection(index, 1)} disabled={index === sectionOrder.length - 1} title="Move down">▼</button>
                        </div>
                        <label className="rb-toggle">
                          <input type="checkbox" checked={visibleSections[key]} onChange={() => toggleSection(key)} />
                          <span className="rb-toggle-slider" />
                        </label>
                        <span>{SECTION_TITLES[key]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TEXT AREA SECTIONS */}
              {Object.entries(SECTION_TITLES).map(([key, title]) => {
                if (key === "summary") return null;
                if (!visibleSections[key]) return null;
                return (
                  <div key={key} className="rb-card">
                    <h2>{title}</h2>
                    <textarea
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      className="rb-textarea"
                      placeholder={`Enter your ${title.toLowerCase()}...`}
                    />
                  </div>
                );
              })}

              {/* SUMMARY */}
              <div className="rb-card">
                <h2>📝 Professional Summary</h2>
                <textarea
                  name="summary"
                  value={formData.summary || ""}
                  onChange={handleChange}
                  className="rb-textarea"
                  rows={4}
                  placeholder="Write a concise 2-3 sentence professional summary..."
                />
              </div>

              <button onClick={generateResume} className="rb-btn rb-btn-generate" disabled={loading}>
                {loading ? "⏳ Generating..." : "🤖 Generate AI Resume"}
              </button>
            </div>

            {/* RIGHT: Live Mini Preview */}
            <div className="rb-editor-preview">
              <h3 style={{ marginBottom: "15px", textAlign: "center", color: "#666" }}>Live Preview</h3>
              <div style={{ transform: "scale(0.55)", transformOrigin: "top center" }}>
                {resumePreviewJSX}
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW TAB */}
        {activeTab === "preview" && (
          <div className="rb-preview-tab">
            {generatedResume ? (
              <div className="rb-preview-full">{resumePreviewJSX}</div>
            ) : (
              <div className="rb-empty-state">
                <h2>No resume generated yet</h2>
                <p>Go to the Editor tab, fill in your details, and click "Generate AI Resume".</p>
                <button onClick={() => setActiveTab("editor")} className="rb-btn rb-btn-primary">✏️ Go to Editor</button>
              </div>
            )}
          </div>
        )}

        {/* ATS SCORE TAB */}
        {activeTab === "ats" && (
          <div className="rb-ats-tab">
            <div className="rb-card rb-ats-score-card">
              <h2>🎯 ATS Compatibility Score</h2>
              <div className="rb-ats-circle" style={{ background: `conic-gradient(#10b981 ${atsScore}%, #e5e7eb ${atsScore}%)` }}>
                <span>{atsScore}%</span>
              </div>
              <div className="rb-ats-meter">
                <progress value={atsScore} max={100} />
              </div>
            </div>

            <div className="rb-card">
              <h2>✅ Strengths</h2>
              <ul>
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
                {strengths.length === 0 && <li style={{ color: "#999" }}>No strengths identified yet.</li>}
              </ul>
            </div>

            <div className="rb-card">
              <h2>🚀 Improvement Suggestions</h2>
              <ul>
                {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                {suggestions.length === 0 && <li style={{ color: "#999" }}>No suggestions — your resume looks great!</li>}
              </ul>
            </div>
          </div>
        )}

        {/* COVER LETTER TAB */}
        {activeTab === "cover" && (
          <div className="rb-cover-tab">
            <div className="rb-card">
              <h2>📩 AI-Generated Cover Letter</h2>
              {coverLetter ? (
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
                  {coverLetter}
                </div>
              ) : (
                <div className="rb-empty-state">
                  <h2>No cover letter yet</h2>
                  <p>Generate your resume first to get an AI-written cover letter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RESUME HISTORY */}
      <div className="rb-history-panel">
        <h2>🕒 Resume History</h2>
        {resumeHistory.length === 0 && <p style={{ color: "#999" }}>No saved resumes yet.</p>}
        <div className="rb-history-grid">
          {resumeHistory.map((item) => (
            <div key={item.id} className="rb-history-card">
              <strong>{item.name}</strong>
              <span>{item.date}</span>
              <span className="rb-history-template">{item.template || "modern"}</span>
              <div className="rb-history-actions">
                <button onClick={() => loadHistoryItem(item)} className="rb-btn-small">👁 View</button>
                <button onClick={() => deleteHistoryItem(item.id)} className="rb-btn-small rb-btn-danger">🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
