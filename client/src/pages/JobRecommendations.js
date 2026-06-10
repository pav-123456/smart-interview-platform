import React, { useState, useMemo } from "react";

const JOBS_DATASET = [
  { title: "Frontend Developer", company: "Google", location: "Bangalore", type: "Full Time", skills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"], applyLink: "https://careers.google.com" },
  { title: "Backend Developer", company: "Infosys", location: "Hyderabad", type: "Full Time", skills: ["Node.js", "Express", "MongoDB", "REST API", "JavaScript"], applyLink: "https://infosys.com/careers" },
  { title: "Full Stack Developer", company: "TCS", location: "Mumbai", type: "Hybrid", skills: ["React", "Node.js", "JavaScript", "MongoDB", "CSS"], applyLink: "https://tcs.com/careers" },
  { title: "Data Scientist", company: "Google", location: "Bangalore", type: "Full Time", skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL"], applyLink: "https://careers.google.com" },
  { title: "DevOps Engineer", company: "Infosys", location: "Hyderabad", type: "Remote", skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"], applyLink: "https://infosys.com/careers" },
  { title: "React Native Developer", company: "TCS", location: "Mumbai", type: "Remote", skills: ["React Native", "JavaScript", "iOS", "Android", "Redux"], applyLink: "https://tcs.com/careers" },
  { title: "Python Developer", company: "Wipro", location: "Bangalore", type: "Hybrid", skills: ["Python", "Django", "REST API", "PostgreSQL", "Docker"], applyLink: "https://wipro.com/careers" },
  { title: "UI/UX Engineer", company: "Google", location: "Mumbai", type: "Full Time", skills: ["Figma", "CSS", "React", "HTML", "JavaScript"], applyLink: "https://careers.google.com" },
  { title: "ML Engineer", company: "Wipro", location: "Hyderabad", type: "Full Time", skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "SQL"], applyLink: "https://wipro.com/careers" },
  { title: "Cloud Architect", company: "Infosys", location: "Bangalore", type: "Remote", skills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"], applyLink: "https://infosys.com/careers" },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.jr-root{
  min-height:100vh;
  padding:40px 24px;
  background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%);
  color:white;
  font-family:'Inter',sans-serif;
}
.jr-inner{max-width:1100px;margin:0 auto;}
.jr-header{text-align:center;margin-bottom:36px;}
.jr-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(28px,5vw,46px);
  font-weight:800;
  letter-spacing:-1.5px;
  background:linear-gradient(135deg,#e2e8f0,#94a3b8);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:8px;
}
.jr-subtitle{color:#64748b;font-size:15px;letter-spacing:0.3px;}
.jr-search-box{
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,0.1);
  padding:24px;
  border-radius:20px;
  margin-bottom:24px;
}
.jr-skill-input{
  width:100%;padding:14px 18px;
  border-radius:12px;border:1px solid rgba(255,255,255,0.15);
  background:rgba(255,255,255,0.08);
  color:white;font-size:15px;font-family:'Inter',sans-serif;
  outline:none;margin-bottom:12px;
  transition:border-color 0.2s,background 0.2s;
}
.jr-skill-input::placeholder{color:rgba(255,255,255,0.35);}
.jr-skill-input:focus{border-color:rgba(59,130,246,0.6);background:rgba(255,255,255,0.11);}
.jr-find-btn{
  width:100%;padding:15px;
  background:linear-gradient(135deg,#2563eb,#4f46e5);
  color:white;border:none;border-radius:12px;
  font-size:16px;font-weight:600;cursor:pointer;
  font-family:'Syne',sans-serif;letter-spacing:0.3px;
  transition:all 0.25s;
  box-shadow:0 4px 20px rgba(37,99,235,0.35);
}
.jr-find-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(37,99,235,0.5);}
.jr-find-btn:disabled{opacity:0.55;cursor:not-allowed;}
.jr-filters{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:10px;margin-top:14px;
}
.jr-filter-input,.jr-filter-select{
  padding:11px 14px;border-radius:10px;
  border:1px solid rgba(255,255,255,0.12);
  background:rgba(255,255,255,0.07);
  color:white;font-size:13.5px;font-family:'Inter',sans-serif;
  outline:none;transition:border-color 0.2s;width:100%;
}
.jr-filter-select option{background:#1e293b;color:white;}
.jr-filter-input::placeholder{color:rgba(255,255,255,0.35);}
.jr-filter-input:focus,.jr-filter-select:focus{border-color:rgba(99,102,241,0.5);}
.jr-dashboard{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:14px;margin-bottom:26px;
}
.jr-stat{
  padding:20px;border-radius:16px;
  border:1px solid rgba(255,255,255,0.08);
  backdrop-filter:blur(10px);
  transition:transform 0.2s;
}
.jr-stat:hover{transform:translateY(-3px);}
.jr-stat-label{font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;opacity:0.6;margin-bottom:8px;}
.jr-stat-value{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;}
.jr-tabs{display:flex;gap:8px;margin-bottom:20px;}
.jr-tab{
  padding:9px 20px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.6);
  cursor:pointer;font-size:13px;font-weight:500;transition:all 0.2s;
  font-family:'Inter',sans-serif;
}
.jr-tab.active,.jr-tab:hover{background:rgba(37,99,235,0.25);border-color:rgba(37,99,235,0.4);color:white;}
.jr-card{
  background:white;color:#111;
  padding:24px;border-radius:20px;
  margin-bottom:16px;
  box-shadow:0 4px 24px rgba(0,0,0,0.25);
  animation:fadeUp 0.35s ease both;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.jr-card-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;}
.jr-job-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:6px;letter-spacing:-0.5px;}
.jr-meta{font-size:13px;color:#64748b;display:flex;flex-wrap:wrap;gap:12px;margin-top:4px;}
.jr-meta span{display:flex;align-items:center;gap:4px;}
.jr-badge{
  padding:10px 18px;border-radius:30px;
  font-weight:700;font-size:14px;white-space:nowrap;
  font-family:'Syne',sans-serif;letter-spacing:0.3px;
}
.jr-divider{height:1px;background:#e2e8f0;margin:18px 0;}
.jr-section-label{font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#64748b;margin-bottom:10px;}
.jr-skills-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.jr-skill-tag{padding:6px 13px;border-radius:20px;font-weight:600;font-size:13px;}
.jr-skill-matched{background:#dcfce7;color:#15803d;}
.jr-skill-missing{background:#fee2e2;color:#dc2626;}
.jr-progress-wrap{margin-bottom:16px;}
.jr-progress-bar{height:6px;background:#f1f5f9;border-radius:99px;overflow:hidden;}
.jr-progress-fill{height:100%;border-radius:99px;transition:width 0.6s ease;}
.jr-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;}
.jr-btn-save{
  padding:9px 18px;border-radius:10px;
  border:1.5px solid #e2e8f0;background:white;
  color:#64748b;font-size:13px;font-weight:600;cursor:pointer;
  transition:all 0.2s;font-family:'Inter',sans-serif;
}
.jr-btn-save:hover{border-color:#f43f5e;color:#f43f5e;background:#fff1f2;}
.jr-btn-save.saved{border-color:#f43f5e;color:#f43f5e;background:#fff1f2;}
.jr-btn-apply{
  padding:9px 22px;border-radius:10px;
  background:linear-gradient(135deg,#2563eb,#4f46e5);
  color:white;font-size:13px;font-weight:600;
  text-decoration:none;display:inline-flex;align-items:center;gap:6px;
  transition:all 0.2s;font-family:'Inter',sans-serif;
  box-shadow:0 2px 12px rgba(37,99,235,0.3);
}
.jr-btn-apply:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,99,235,0.5);}
.jr-empty{text-align:center;padding:70px 20px;color:#64748b;}
.jr-empty-icon{font-size:52px;margin-bottom:16px;opacity:0.5;}
.jr-saved-banner{
  background:linear-gradient(135deg,rgba(244,63,94,0.15),rgba(239,68,68,0.1));
  border:1px solid rgba(244,63,94,0.25);
  border-radius:14px;padding:14px 20px;margin-bottom:20px;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;
  font-size:13px;
}
.jr-type-badge{
  display:inline-block;padding:3px 10px;border-radius:6px;
  font-size:11px;font-weight:600;letter-spacing:0.5px;
  background:#eff6ff;color:#1d4ed8;margin-left:8px;
}
`;

export default function JobRecommendations() {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // STEP 10 — Filter states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [jobType, setJobType] = useState("");

  const getRecommendations = async () => {
    if (!skills.trim()) { alert("Please enter your skills"); return; }

    const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);

    setLoading(true);
    try {
      // Match logic runs client-side (no backend needed in artifact)
      const recommendations = JOBS_DATASET.map(job => {
        const lowerSkills = skillsArray.map(s => s.toLowerCase());
        const matchedSkills = job.skills.filter(s => lowerSkills.includes(s.toLowerCase()));
        const missingSkills = job.skills.filter(s => !lowerSkills.includes(s.toLowerCase()));
        const matchPercentage = Math.round((matchedSkills.length / job.skills.length) * 100);
        return { ...job, matchedSkills, missingSkills, matchPercentage };
      });
      recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
      setJobs(recommendations);
      setSearch(""); setLocation(""); setCompany(""); setJobType("");
      setActiveTab("all");
    } catch (e) {
      alert("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (job) => {
    setSavedJobs(prev =>
      prev.find(j => j.title === job.title && j.company === job.company)
        ? prev.filter(j => !(j.title === job.title && j.company === job.company))
        : [...prev, job]
    );
  };
  const isSaved = (job) => savedJobs.some(j => j.title === job.title && j.company === job.company);

  // STEP 11–14 — Apply all filters
  const filtered = useMemo(() => {
    let list = activeTab === "saved" ? savedJobs : jobs;
    if (search) list = list.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));
    if (location) list = list.filter(j => j.location === location);
    if (company) list = list.filter(j => j.company === company);
    if (jobType) list = list.filter(j => j.type === jobType);
    return list;
  }, [jobs, savedJobs, activeTab, search, location, company, jobType]);

  const bestMatch = jobs.length > 0 ? jobs[0] : null;
  const avgMatch = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.matchPercentage, 0) / jobs.length) : 0;

  return (
    <>
      <style>{css}</style>
      <div className="jr-root">
        <div className="jr-inner">

          {/* HEADER */}
          <div className="jr-header">
            <h1
  style={{
    textAlign: "center",
    fontSize: "48px",
    marginBottom: "10px",
    fontWeight: "800",
    background:
      "linear-gradient(90deg,#60a5fa,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  💼 AI Job Recommendations
</h1>

<p
  style={{
    textAlign: "center",
    color: "#cbd5e1",
    marginBottom: "40px",
    fontSize: "18px",
  }}
>
  Discover jobs that match your skills, track skill gaps,
  and receive AI-powered career recommendations.
</p>
          </div>

          {/* SEARCH BOX */}
          <div className="jr-search-box">
            <input
              className="jr-skill-input"
              type="text"
              placeholder="Enter your skills: React, JavaScript, MongoDB, Python..."
              value={skills}
              onChange={e => setSkills(e.target.value)}
              onKeyDown={e => e.key === "Enter" && getRecommendations()}
            />

            {/* STEP 10–14 — Filter Row */}
            <div className="jr-filters">
              <input
                className="jr-filter-input"
                placeholder="🔍 Search Job Title"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="jr-filter-select" value={location} onChange={e => setLocation(e.target.value)}>
                <option value="">📍 All Locations</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
                <option>Mumbai</option>
              </select>
              <select className="jr-filter-select" value={company} onChange={e => setCompany(e.target.value)}>
                <option value="">🏢 All Companies</option>
                <option>Google</option>
                <option>Infosys</option>
                <option>TCS</option>
                <option>Wipro</option>
              </select>
              <select className="jr-filter-select" value={jobType} onChange={e => setJobType(e.target.value)}>
                <option value="">💼 All Types</option>
                <option>Full Time</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            <button className="jr-find-btn" onClick={getRecommendations} disabled={loading} style={{ marginTop: "14px" }}>
              {loading ? "⏳ Finding Jobs..." : "🔍 Find Matching Jobs"}
            </button>
          </div>

          {/* DASHBOARD */}
          {jobs.length > 0 && (
            <div className="jr-dashboard">
              <div className="jr-stat" style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.3),rgba(37,99,235,0.15))", borderColor: "rgba(37,99,235,0.3)" }}>
                <div className="jr-stat-label">Total Jobs Found</div>
                <div className="jr-stat-value">{jobs.length}</div>
              </div>
              <div className="jr-stat" style={{ background: "linear-gradient(135deg,rgba(22,163,74,0.3),rgba(22,163,74,0.15))", borderColor: "rgba(22,163,74,0.3)" }}>
                <div className="jr-stat-label">Best Match</div>
                <div className="jr-stat-value">{bestMatch?.matchPercentage}%</div>
              </div>
              <div className="jr-stat" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(124,58,237,0.15))", borderColor: "rgba(124,58,237,0.3)" }}>
                <div className="jr-stat-label">Top Job</div>
                <div className="jr-stat-value" style={{ fontSize: "17px", marginTop: "4px" }}>{bestMatch?.title}</div>
              </div>
              <div className="jr-stat" style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.3),rgba(245,158,11,0.15))", borderColor: "rgba(245,158,11,0.3)" }}>
                <div className="jr-stat-label">Avg Match</div>
                <div className="jr-stat-value">{avgMatch}%</div>
              </div>
            </div>
          )}

          {/* TABS */}
          {jobs.length > 0 && (
            <div className="jr-tabs">
              <button className={`jr-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                All Jobs ({jobs.length})
              </button>
              <button className={`jr-tab ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>
                ❤️ Saved ({savedJobs.length})
              </button>
            </div>
          )}

          {/* SAVED BANNER */}
          {savedJobs.length > 0 && activeTab === "all" && (
            <div className="jr-saved-banner" style={{ color: "white" }}>
              <span>❤️ <strong>{savedJobs.length}</strong> job{savedJobs.length > 1 ? "s" : ""} saved</span>
              <button className="jr-tab" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={() => setActiveTab("saved")}>View Saved →</button>
            </div>
          )}

          {/* JOB CARDS */}
          {filtered.map((job, i) => {
            const pct = job.matchPercentage;
            const barColor = pct >= 75 ? "#16a34a" : pct >= 40 ? "#f59e0b" : "#ef4444";
            const badgeBg = pct >= 75 ? "#16a34a" : "#f59e0b";
            return (
              <div key={i} className="jr-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="jr-card-top">
                  <div>
                    <div className="jr-job-title">
                      {job.title}
                      <span className="jr-type-badge">{job.type}</span>
                    </div>
                    <div className="jr-meta">
                      <span>🏢 {job.company}</span>
                      <span>📍 {job.location}</span>
                    </div>
                  </div>
                  <div className="jr-badge" style={{ background: badgeBg, color: "white" }}>
                    {pct}% Match
                  </div>
                </div>

                {/* Progress bar */}
                <div className="jr-progress-wrap" style={{ marginTop: "16px" }}>
                  <div className="jr-progress-bar">
                    <div className="jr-progress-fill" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>

                <div className="jr-divider" />

                {/* MATCHED SKILLS */}
                <div className="jr-section-label">✅ Matched Skills</div>
                <div className="jr-skills-row">
                  {job.matchedSkills?.length > 0
                    ? job.matchedSkills.map((s, idx) => (
                        <span key={idx} className="jr-skill-tag jr-skill-matched">✓ {s}</span>
                      ))
                    : <span style={{ color: "#94a3b8", fontSize: "13px" }}>None matched</span>
                  }
                </div>

                {/* MISSING SKILLS */}
                <div className="jr-section-label">📚 Skills to Learn</div>
                <div className="jr-skills-row">
                  {job.missingSkills?.length > 0
                    ? job.missingSkills.map((s, idx) => (
                        <span key={idx} className="jr-skill-tag jr-skill-missing">✗ {s}</span>
                      ))
                    : <span style={{ color: "#16a34a", fontWeight: "600", fontSize: "13px" }}>🎉 No missing skills!</span>
                  }
                </div>

                {/* STEP 15 & 16 — Save + Apply */}
                <div className="jr-actions">
                  <button
                    className={`jr-btn-save ${isSaved(job) ? "saved" : ""}`}
                    onClick={() => toggleSave(job)}
                  >
                    {isSaved(job) ? "❤️ Saved" : "🤍 Save Job"}
                  </button>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="jr-btn-apply"
                  >
                    🚀 Apply Now
                  </a>
                </div>
              </div>
            );
          })}

          {/* EMPTY STATE */}
          {!loading && filtered.length === 0 && (
            <div className="jr-empty">
              <div className="jr-empty-icon">{activeTab === "saved" ? "❤️" : "🔍"}</div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", marginBottom: "10px", color: "#e2e8f0" }}>
                {activeTab === "saved" ? "No Saved Jobs Yet" : "No Recommendations Yet"}
              </h2>
              <p>{activeTab === "saved" ? "Save jobs you're interested in." : "Enter your skills above to discover matching jobs."}</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}