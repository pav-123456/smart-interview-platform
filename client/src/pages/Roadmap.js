import React, { useState, useRef } from "react";
import axios from "axios";

// ─── Resource Database (real links, keyed by topic keywords) ─────────────────
const RESOURCES = {
  // Frontend
  "react": {
    videos:  [
      { title:"React Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=bMknfKXIFA8", duration:"12h", platform:"YouTube" },
      { title:"React – The Complete Guide (Udemy)", url:"https://www.udemy.com/course/react-the-complete-guide-incl-redux/", duration:"68h", platform:"Udemy" },
    ],
    books:   [
      { title:"Learning React – Alex Banks", url:"https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/", pages:"350p" },
      { title:"Road to React – Robin Wieruch", url:"https://www.roadtoreact.com/", pages:"280p" },
    ],
    projects:[
      { title:"Build a Todo App with React Hooks", url:"https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react/", level:"Beginner" },
      { title:"Build a Netflix Clone with React", url:"https://www.youtube.com/watch?v=x_EEwGe-a9o", level:"Intermediate" },
      { title:"Build a Full E-Commerce App", url:"https://www.youtube.com/watch?v=cDkQxwjfYFk", level:"Advanced" },
    ],
    practice:[ { title:"React Challenges – Frontend Mentor", url:"https://www.frontendmentor.io/challenges?type=free" } ],
  },
  "javascript": {
    videos:  [
      { title:"JavaScript Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=PkZNo7MFNFg", duration:"3.5h", platform:"YouTube" },
      { title:"JavaScript – The Complete Guide (Udemy)", url:"https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/", duration:"52h", platform:"Udemy" },
    ],
    books:   [
      { title:"Eloquent JavaScript – Marijn Haverbeke", url:"https://eloquentjavascript.net/", pages:"450p" },
      { title:"You Don't Know JS – Kyle Simpson", url:"https://github.com/getify/You-Dont-Know-JS", pages:"Free" },
    ],
    projects:[
      { title:"30 Days JS Challenge", url:"https://javascript30.com/", level:"Beginner" },
      { title:"Build a Weather App with JS", url:"https://www.youtube.com/watch?v=MIYQR-Ybrn4", level:"Beginner" },
      { title:"Build a Chat App with Socket.io", url:"https://www.youtube.com/watch?v=rxzOqP9YwmM", level:"Advanced" },
    ],
    practice:[ { title:"JavaScript Exercises – Exercism", url:"https://exercism.org/tracks/javascript" } ],
  },
  "css": {
    videos:  [
      { title:"CSS Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=1Rs2ND1ryYc", duration:"11h", platform:"YouTube" },
      { title:"Advanced CSS & Sass (Udemy)", url:"https://www.udemy.com/course/advanced-css-and-sass/", duration:"28h", platform:"Udemy" },
    ],
    books:   [
      { title:"CSS: The Definitive Guide – Eric Meyer", url:"https://www.oreilly.com/library/view/css-the-definitive/9781098117603/", pages:"820p" },
    ],
    projects:[
      { title:"Build 10 CSS Projects", url:"https://www.youtube.com/watch?v=8MgpE2DTTKA", level:"Beginner" },
      { title:"CSS Grid & Flexbox Challenges", url:"https://cssgridgarden.com/", level:"Beginner" },
    ],
    practice:[ { title:"CSS Battles", url:"https://cssbattle.dev/" } ],
  },
  "node": {
    videos:  [
      { title:"Node.js Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=Oe421EPjeBE", duration:"8h", platform:"YouTube" },
      { title:"NodeJS – The Complete Guide (Udemy)", url:"https://www.udemy.com/course/nodejs-the-complete-guide/", duration:"40h", platform:"Udemy" },
    ],
    books:   [
      { title:"Node.js Design Patterns – Casciaro", url:"https://www.nodejsdesignpatterns.com/", pages:"660p" },
    ],
    projects:[
      { title:"REST API with Node & Express", url:"https://www.youtube.com/watch?v=pKd0Rpw7O48", level:"Beginner" },
      { title:"Build an Auth System with JWT", url:"https://www.youtube.com/watch?v=mbsmsi7l3r4", level:"Intermediate" },
    ],
    practice:[ { title:"Node.js Exercises – HackerRank", url:"https://www.hackerrank.com/domains/tutorials/10-days-of-javascript" } ],
  },
  "python": {
    videos:  [
      { title:"Python Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=rfscVS0vtbw", duration:"4.5h", platform:"YouTube" },
      { title:"100 Days of Python (Udemy)", url:"https://www.udemy.com/course/100-days-of-code/", duration:"55h", platform:"Udemy" },
    ],
    books:   [
      { title:"Automate the Boring Stuff – Al Sweigart", url:"https://automatetheboringstuff.com/", pages:"Free Online" },
      { title:"Python Crash Course – Eric Matthes", url:"https://nostarch.com/python-crash-course-3rd-edition", pages:"540p" },
    ],
    projects:[
      { title:"Build a Web Scraper with BeautifulSoup", url:"https://www.youtube.com/watch?v=XVv6mJpFOb0", level:"Beginner" },
      { title:"Build a Django REST API", url:"https://www.youtube.com/watch?v=c708Nf0cHrs", level:"Intermediate" },
      { title:"Build an ML Price Predictor", url:"https://www.youtube.com/watch?v=Wqmtf9SA_kk", level:"Advanced" },
    ],
    practice:[ { title:"Python Exercises – Codewars", url:"https://www.codewars.com/kata/search/python" } ],
  },
  "machine learning": {
    videos:  [
      { title:"ML with Python – freeCodeCamp", url:"https://www.youtube.com/watch?v=7eh4d6sabA0", duration:"10h", platform:"YouTube" },
      { title:"ML A-Z (Udemy)", url:"https://www.udemy.com/course/machinelearning/", duration:"44h", platform:"Udemy" },
    ],
    books:   [
      { title:"Hands-On ML – Aurélien Géron", url:"https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/", pages:"850p" },
      { title:"Pattern Recognition – Bishop", url:"https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/", pages:"738p" },
    ],
    projects:[
      { title:"House Price Prediction (Kaggle)", url:"https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques", level:"Beginner" },
      { title:"Image Classifier with TensorFlow", url:"https://www.tensorflow.org/tutorials/images/classification", level:"Intermediate" },
      { title:"Build a Recommendation System", url:"https://www.youtube.com/watch?v=3ecNC-So0r4", level:"Advanced" },
    ],
    practice:[ { title:"Kaggle Learn – Free ML Courses", url:"https://www.kaggle.com/learn" } ],
  },
  "docker": {
    videos:  [
      { title:"Docker Full Course – TechWorld with Nana", url:"https://www.youtube.com/watch?v=3c-iBn73dDE", duration:"3h", platform:"YouTube" },
      { title:"Docker & Kubernetes (Udemy)", url:"https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/", duration:"21h", platform:"Udemy" },
    ],
    books:   [
      { title:"Docker Deep Dive – Nigel Poulton", url:"https://nigelpoulton.com/books/", pages:"200p" },
    ],
    projects:[
      { title:"Dockerize a Node.js App", url:"https://nodejs.org/en/docs/guides/nodejs-docker-webapp", level:"Beginner" },
      { title:"Multi-container App with Docker Compose", url:"https://www.youtube.com/watch?v=HG6yIjqMVvE", level:"Intermediate" },
    ],
    practice:[ { title:"Play with Docker Labs", url:"https://labs.play-with-docker.com/" } ],
  },
  "aws": {
    videos:  [
      { title:"AWS Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=ulprqHHWlng", duration:"5h", platform:"YouTube" },
      { title:"AWS Certified Solutions Architect (Udemy)", url:"https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", duration:"27h", platform:"Udemy" },
    ],
    books:   [
      { title:"AWS in Action – Wittig", url:"https://www.manning.com/books/amazon-web-services-in-action-third-edition", pages:"650p" },
    ],
    projects:[
      { title:"Deploy a Web App on AWS EC2", url:"https://aws.amazon.com/getting-started/hands-on/deploy-nodejs-web-app/", level:"Beginner" },
      { title:"Build a Serverless API with Lambda", url:"https://www.youtube.com/watch?v=71cd5XerKss", level:"Intermediate" },
    ],
    practice:[ { title:"AWS Free Tier – Hands-on Labs", url:"https://aws.amazon.com/free/" } ],
  },
  "sql": {
    videos:  [
      { title:"SQL Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=HXV3zeQKqGY", duration:"4.5h", platform:"YouTube" },
    ],
    books:   [
      { title:"Learning SQL – Alan Beaulieu", url:"https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/", pages:"400p" },
    ],
    projects:[
      { title:"Build a Sales Analytics Dashboard (SQL)", url:"https://www.youtube.com/watch?v=qfyynHBFOsM", level:"Intermediate" },
    ],
    practice:[ { title:"SQL Practice – SQLZoo", url:"https://sqlzoo.net/" }, { title:"LeetCode SQL Problems", url:"https://leetcode.com/problemset/database/" } ],
  },
  "typescript": {
    videos:  [
      { title:"TypeScript Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=30LWjhZzg50", duration:"8h", platform:"YouTube" },
    ],
    books:   [
      { title:"Programming TypeScript – Boris Cherny", url:"https://www.oreilly.com/library/view/programming-typescript/9781492037644/", pages:"320p" },
    ],
    projects:[
      { title:"Build a REST API with TypeScript & Express", url:"https://www.youtube.com/watch?v=zRo2tvQpus8", level:"Intermediate" },
    ],
    practice:[ { title:"TypeScript Exercises", url:"https://typescript-exercises.github.io/" } ],
  },
  "figma": {
    videos:  [
      { title:"Figma Full Course – freeCodeCamp", url:"https://www.youtube.com/watch?v=jwCmIBJ8Jtc", duration:"3h", platform:"YouTube" },
      { title:"UI/UX Design Bootcamp (Udemy)", url:"https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/", duration:"25h", platform:"Udemy" },
    ],
    books:   [
      { title:"Don't Make Me Think – Steve Krug", url:"https://sensible.com/dont-make-me-think/", pages:"216p" },
    ],
    projects:[
      { title:"Design a Mobile Banking App in Figma", url:"https://www.youtube.com/watch?v=5IanQIwhA2E", level:"Intermediate" },
    ],
    practice:[ { title:"Daily UI Design Challenges", url:"https://www.dailyui.co/" } ],
  },
  "default": {
    videos:  [
      { title:"CS50 – Harvard's Intro to Computer Science", url:"https://cs50.harvard.edu/x/", duration:"12h", platform:"edX" },
      { title:"The Odin Project – Full Stack Curriculum", url:"https://www.theodinproject.com/", duration:"Self-paced", platform:"Free" },
    ],
    books:   [
      { title:"Clean Code – Robert C. Martin", url:"https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882", pages:"464p" },
      { title:"The Pragmatic Programmer", url:"https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/", pages:"352p" },
    ],
    projects:[
      { title:"Build Your Portfolio Website", url:"https://www.youtube.com/watch?v=r_hYR53r61M", level:"Beginner" },
      { title:"Contribute to Open Source on GitHub", url:"https://github.com/firstcontributions/first-contributions", level:"Intermediate" },
    ],
    practice:[ { title:"LeetCode – DSA Practice", url:"https://leetcode.com/" }, { title:"HackerRank Coding Challenges", url:"https://www.hackerrank.com/" } ],
  },
};

// Match resources to a topic string
function getResources(topic) {
  const t = topic.toLowerCase();
  for (const key of Object.keys(RESOURCES)) {
    if (key !== "default" && t.includes(key)) return RESOURCES[key];
  }
  return RESOURCES["default"];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PHASE_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#f43f5e","#a855f7"];

const TECH_SUGGESTIONS = [
  "Full Stack Developer","Frontend Developer","Backend Developer",
  "Data Scientist","DevOps Engineer","ML Engineer","Cloud Architect",
  "Android Developer","iOS Developer","Cybersecurity Analyst","UI/UX Designer",
  "React Developer","Python Developer","Java Developer",
];

const PLATFORM_COLORS = {
  "YouTube":  { bg:"rgba(239,68,68,0.12)",   color:"#f87171",  icon:"▶" },
  "Udemy":    { bg:"rgba(168,85,247,0.12)",   color:"#c084fc",  icon:"🎓" },
  "edX":      { bg:"rgba(37,99,235,0.12)",    color:"#60a5fa",  icon:"🏛" },
  "Free":     { bg:"rgba(34,197,94,0.12)",    color:"#4ade80",  icon:"✓"  },
  "default":  { bg:"rgba(99,102,241,0.12)",   color:"#a5b4fc",  icon:"🔗" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseRoadmapToPhases(raw) {
  const lines = raw.split("\n");
  const phases = [];
  let current = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const isHeader =
      /^(phase|week|month|step|stage)\s*\d*/i.test(trimmed) ||
      /^\*\*(phase|week|month|step|stage)/i.test(trimmed) ||
      /^#+\s/.test(trimmed);

    if (isHeader) {
      if (current) phases.push(current);
      current = { title: trimmed.replace(/^#+\s*/, "").replace(/\*\*/g,""), items:[] };
    } else if (current) {
      const clean = trimmed.replace(/^[-*•]\s*/, "").replace(/\*\*/g,"");
      if (clean) current.items.push(clean);
    } else {
      current = { title:"Overview", items:[trimmed] };
    }
  });

  if (current) phases.push(current);
  return phases.length > 0 ? phases : [{ title:"Roadmap", items: lines.filter(Boolean) }];
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  return (
    <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginTop:5 }}>
      <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, transition:"width 1.2s ease" }}/>
    </div>
  );
}

function PlatformBadge({ platform }) {
  const p = PLATFORM_COLORS[platform] || PLATFORM_COLORS["default"];
  return (
    <span style={{
      padding:"2px 8px", borderRadius:5, fontSize:"11px", fontWeight:600,
      background:p.bg, color:p.color, border:`1px solid ${p.color}44`,
    }}>
      {p.icon} {platform}
    </span>
  );
}

function ResourceLink({ href, children, type }) {
  const colors = {
    video:   "#ef4444",
    book:    "#f59e0b",
    project: "#10b981",
    practice:"#6366f1",
  };
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"9px 12px", borderRadius:8,
      background:"rgba(255,255,255,0.04)",
      border:`1px solid ${colors[type] || "#374151"}33`,
      textDecoration:"none", transition:"background 0.15s",
      borderLeft:`2px solid ${colors[type] || "#6366f1"}`,
    }}
    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
    onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
    >
      {children}
    </a>
  );
}

function ResourcePanel({ goal, learningStyle }) {
  const [tab, setTab] = useState("videos");
  const res = getResources(goal);

  const tabs = [
    { id:"videos",   label:"📹 Videos",   data: res.videos   || [] },
    { id:"books",    label:"📚 Books",    data: res.books    || [] },
    { id:"projects", label:"🛠 Projects", data: res.projects || [] },
    { id:"practice", label:"💡 Practice", data: res.practice || [] },
  ];

  // Highlight the tab matching their learning style
  const styleMap = { "Video Courses":"videos", "Books":"books", "Projects":"projects", "Mixed":"videos" };
  const preferred = styleMap[learningStyle] || "videos";

  const active = tabs.find(t => t.id === tab);

  return (
    <div style={{
      background:"#111827", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:14, overflow:"hidden", marginBottom:16,
    }}>
      {/* Header */}
      <div style={{
        padding:"14px 18px",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <div style={{ fontWeight:700, fontSize:"14px", color:"#f1f5f9" }}>
          📦 Learning Resources
        </div>
        <div style={{
          fontSize:"11px", color:"#6b7280",
          background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)",
          padding:"3px 10px", borderRadius:20,
        }}>
          Matched to: <span style={{ color:"#a5b4fc" }}>{goal || "your goal"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:"flex", gap:4, padding:"10px 14px",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(0,0,0,0.2)", flexWrap:"wrap",
      }}>
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding:"6px 14px", borderRadius:7, fontSize:"12px", fontWeight:600,
              border:"1px solid transparent", cursor:"pointer", fontFamily:"inherit",
              background: tab === t.id ? "rgba(99,102,241,0.25)" : "transparent",
              color: tab === t.id ? "#a5b4fc" : "#64748b",
              borderColor: tab === t.id ? "rgba(99,102,241,0.4)" : "transparent",
              position:"relative",
            }}
          >
            {t.label}
            {t.id === preferred && (
              <span style={{
                position:"absolute", top:-4, right:-4,
                width:8, height:8, borderRadius:"50%",
                background:"#10b981", border:"1.5px solid #111827",
              }}/>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {active?.id === "videos" && active.data.map((r,i) => (
          <ResourceLink key={i} href={r.url} type="video">
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(239,68,68,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:"14px" }}>▶</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"13px", fontWeight:600, color:"#e2e8f0", marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {r.title}
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <PlatformBadge platform={r.platform}/>
                <span style={{ fontSize:"11px", color:"#6b7280" }}>⏱ {r.duration}</span>
              </div>
            </div>
            <span style={{ fontSize:"11px", color:"#6366f1", flexShrink:0 }}>→</span>
          </ResourceLink>
        ))}

        {active?.id === "books" && active.data.map((r,i) => (
          <ResourceLink key={i} href={r.url} type="book">
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:"16px" }}>📖</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"13px", fontWeight:600, color:"#e2e8f0", marginBottom:2 }}>{r.title}</div>
              <span style={{
                fontSize:"11px", padding:"2px 8px", borderRadius:5,
                background:"rgba(245,158,11,0.1)", color:"#fbbf24",
                border:"1px solid rgba(245,158,11,0.2)",
              }}>📄 {r.pages}</span>
            </div>
            <span style={{ fontSize:"11px", color:"#f59e0b", flexShrink:0 }}>→</span>
          </ResourceLink>
        ))}

        {active?.id === "projects" && active.data.map((r,i) => (
          <ResourceLink key={i} href={r.url} type="project">
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(16,185,129,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:"14px" }}>🛠</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"13px", fontWeight:600, color:"#e2e8f0", marginBottom:2 }}>{r.title}</div>
              <span style={{
                fontSize:"11px", padding:"2px 8px", borderRadius:5,
                background: r.level==="Beginner" ? "rgba(34,197,94,0.12)" : r.level==="Advanced" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                color: r.level==="Beginner" ? "#4ade80" : r.level==="Advanced" ? "#f87171" : "#fbbf24",
              }}>{r.level}</span>
            </div>
            <span style={{ fontSize:"11px", color:"#10b981", flexShrink:0 }}>→</span>
          </ResourceLink>
        ))}

        {active?.id === "practice" && active.data.map((r,i) => (
          <ResourceLink key={i} href={r.url} type="practice">
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(99,102,241,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:"14px" }}>💡</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"13px", fontWeight:600, color:"#e2e8f0" }}>{r.title}</div>
              <div style={{ fontSize:"11px", color:"#6b7280", marginTop:2 }}>Hands-on practice platform</div>
            </div>
            <span style={{ fontSize:"11px", color:"#6366f1", flexShrink:0 }}>→</span>
          </ResourceLink>
        ))}

        {active?.data.length === 0 && (
          <div style={{ textAlign:"center", padding:"20px", color:"#6b7280", fontSize:"13px" }}>
            No resources for this category yet.
          </div>
        )}

        {/* Browse more */}
        <div style={{
          marginTop:4, padding:"9px 12px", borderRadius:8,
          background:"rgba(99,102,241,0.06)", border:"1px dashed rgba(99,102,241,0.25)",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <span style={{ fontSize:"12px", color:"#6b7280" }}>
            Want more resources?
          </span>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { label:"Coursera", url:`https://www.coursera.org/search?query=${encodeURIComponent(goal)}` },
              { label:"YouTube", url:`https://www.youtube.com/results?search_query=${encodeURIComponent(goal+" tutorial")}` },
              { label:"GitHub", url:`https://github.com/search?q=${encodeURIComponent(goal)}&type=repositories` },
            ].map(l => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                style={{
                  fontSize:"11px", fontWeight:600,
                  padding:"4px 10px", borderRadius:6,
                  background:"rgba(99,102,241,0.15)", color:"#a5b4fc",
                  border:"1px solid rgba(99,102,241,0.3)", textDecoration:"none",
                }}>
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseCard({ phase, index, color, goal }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      background:"rgba(255,255,255,0.03)",
      border:`1px solid ${color}33`,
      borderLeft:`3px solid ${color}`,
      borderRadius:12, marginBottom:12, overflow:"hidden",
    }}>
      <div onClick={() => setOpen(o=>!o)} style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"13px 18px", cursor:"pointer",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:26, height:26, borderRadius:"50%",
            background:color, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:"11px", fontWeight:800, color:"#fff", flexShrink:0,
          }}>{index+1}</div>
          <span style={{ fontWeight:600, fontSize:"14px", color:"#f1f5f9" }}>{phase.title}</span>
          <span style={{
            fontSize:"11px", padding:"2px 8px", borderRadius:10,
            background:`${color}18`, color:color, border:`1px solid ${color}33`,
          }}>{phase.items.length} tasks</span>
        </div>
        <span style={{ color:"#475569", fontSize:"16px" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && phase.items.length > 0 && (
        <div style={{ padding:"0 18px 14px" }}>
          {phase.items.map((item, i) => {
            const searchQuery = encodeURIComponent(item);
            const ytUrl   = `https://www.youtube.com/results?search_query=${searchQuery}`;
            const googleUrl = `https://www.google.com/search?q=${searchQuery}+tutorial`;

            return (
              <div key={i} style={{
                padding:"8px 0",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
                display:"flex", alignItems:"flex-start", gap:10,
              }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:color, marginTop:8, flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <span style={{ color:"#cbd5e1", fontSize:"13px", lineHeight:1.6 }}>{item}</span>
                  <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                    <a href={ytUrl} target="_blank" rel="noreferrer" style={{
                      fontSize:"10px", fontWeight:600, padding:"2px 8px", borderRadius:4,
                      background:"rgba(239,68,68,0.1)", color:"#f87171",
                      border:"1px solid rgba(239,68,68,0.2)", textDecoration:"none",
                    }}>▶ YouTube</a>
                    <a href={googleUrl} target="_blank" rel="noreferrer" style={{
                      fontSize:"10px", fontWeight:600, padding:"2px 8px", borderRadius:4,
                      background:"rgba(99,102,241,0.1)", color:"#a5b4fc",
                      border:"1px solid rgba(99,102,241,0.2)", textDecoration:"none",
                    }}>🔍 Search</a>
                    <a href={`https://www.freecodecamp.org/news/search/?query=${searchQuery}`} target="_blank" rel="noreferrer" style={{
                      fontSize:"10px", fontWeight:600, padding:"2px 8px", borderRadius:4,
                      background:"rgba(16,185,129,0.1)", color:"#34d399",
                      border:"1px solid rgba(16,185,129,0.2)", textDecoration:"none",
                    }}>📝 Article</a>
                    <a href={`https://leetcode.com/search/?q=${searchQuery}`} target="_blank" rel="noreferrer" style={{
                      fontSize:"10px", fontWeight:600, padding:"2px 8px", borderRadius:4,
                      background:"rgba(245,158,11,0.1)", color:"#fbbf24",
                      border:"1px solid rgba(245,158,11,0.2)", textDecoration:"none",
                    }}>⚡ Practice</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Roadmap() {
  const [formData, setFormData] = useState({
    goal:"", experience:"Beginner", duration:"6 Months",
    salary:"", learningStyle:"Mixed", currentSkills:"", preferredStack:"",
  });
  const [roadmap, setRoadmap]   = useState("");
  const [phases, setPhases]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState("visual");
  const [suggestions, setSuggestions] = useState([]);
  const [copied, setCopied]     = useState(false);
  const outputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "goal") {
      setSuggestions(value.length > 1
        ? TECH_SUGGESTIONS.filter(s => s.toLowerCase().includes(value.toLowerCase()))
        : []);
    }
  };

  const generateRoadmap = async () => {
    if (!formData.goal.trim()) return alert("Please enter your career goal");
    setLoading(true); setRoadmap(""); setPhases([]);
    try {
      const res = await axios.post("http://localhost:5000/api/roadmap", formData);
      const raw = res.data.roadmap;
      setRoadmap(raw);
      setPhases(parseRoadmapToPhases(raw));
      setActiveTab("visual");
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior:"smooth" }), 200);
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap. Please check your server.");
    } finally { setLoading(false); }
  };

  const copyRoadmap = async () => {
    await navigator.clipboard.writeText(roadmap);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([roadmap], { type:"text/plain" })),
      download: `Roadmap-${formData.goal.replace(/\s+/g,"-")}.txt`,
    });
    a.click();
  };

  const downloadJSON = () => {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([JSON.stringify({ formData, phases, generated:new Date().toISOString() }, null, 2)], { type:"application/json" })),
      download: `Roadmap-${formData.goal.replace(/\s+/g,"-")}.json`,
    });
    a.click();
  };

  const totalItems = phases.reduce((s,p) => s + p.items.length, 0);

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}body{margin:0;}
        .rm-input{width:100%;padding:11px 13px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:9px;color:#f1f5f9;font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s;}
        .rm-input:focus{border-color:#6366f1;}
        .rm-input::placeholder{color:#475569;}
        .rm-input option{background:#1e293b;}
        .rm-genbtn{width:100%;padding:13px;background:#6366f1;color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity 0.2s,transform 0.15s;margin-top:4px;}
        .rm-genbtn:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);}
        .rm-genbtn:disabled{opacity:0.5;cursor:not-allowed;}
        .rm-tab{padding:7px 15px;border-radius:7px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#64748b;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;transition:all 0.15s;}
        .rm-tab.on{background:rgba(99,102,241,0.2);border-color:rgba(99,102,241,0.4);color:#a5b4fc;}
        .rm-act{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#94a3b8;transition:all 0.15s;}
        .rm-act:hover{background:rgba(255,255,255,0.09);color:#e2e8f0;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.35s ease both;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:10px;}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#0a0f1e", padding:"28px 16px", fontFamily:"'Inter',system-ui,sans-serif", color:"#e2e8f0", fontSize:"14px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <span style={{ display:"inline-block", background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:20, padding:"4px 14px", fontSize:"11px", color:"#a5b4fc", fontWeight:700, letterSpacing:"1px", marginBottom:12 }}>
            ✦ AI-POWERED CAREER PLANNING
          </span>
          <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:"#f1f5f9", letterSpacing:"-1px", margin:"0 0 8px" }}>
            Career Roadmap Generator
          </h1>
          <p style={{ color:"#64748b", fontSize:"14px", maxWidth:460, margin:"0 auto" }}>
            Get a personalized learning roadmap with curated books, video courses, projects & practice links — all in one place.
          </p>
        </div>

        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", gap:22, alignItems:"flex-start", flexWrap:"wrap" }}>

          {/* ── LEFT FORM ── */}
          <div style={{ width:290, flexShrink:0, background:"#111827", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20 }}>
            <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", color:"#6b7280", textTransform:"uppercase", marginBottom:14 }}>
              Configure roadmap
            </div>

            {/* Goal + autocomplete */}
            <div style={{ position:"relative", marginBottom:10 }}>
              <label style={{ fontSize:"10px", color:"#64748b", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.8px" }}>Career Goal *</label>
              <input className="rm-input" name="goal" placeholder="e.g. Full Stack Developer" value={formData.goal} onChange={handleChange}/>
              {suggestions.length > 0 && (
                <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:20, background:"#1e293b", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, overflow:"hidden", marginTop:4, boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
                  {suggestions.map(s => (
                    <div key={s} onClick={() => { setFormData(p=>({...p,goal:s})); setSuggestions([]); }}
                      style={{ padding:"8px 13px", cursor:"pointer", fontSize:"13px", color:"#cbd5e1", borderBottom:"1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.15)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {[
              { name:"experience", label:"Experience", opts:["Beginner","Intermediate","Advanced"] },
              { name:"duration",   label:"Timeline",   opts:["3 Months","6 Months","12 Months","2 Years"] },
              { name:"learningStyle", label:"Learning Style", opts:["Projects","Video Courses","Books","Mixed"] },
            ].map(f => (
              <div key={f.name} style={{ marginBottom:10 }}>
                <label style={{ fontSize:"10px", color:"#64748b", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.8px" }}>{f.label}</label>
                <select className="rm-input" name={f.name} value={formData[f.name]} onChange={handleChange}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            {[
              { name:"salary",         placeholder:"Target Salary (e.g. ₹20 LPA)" },
              { name:"currentSkills",  placeholder:"Your current skills (HTML, CSS…)" },
              { name:"preferredStack", placeholder:"Preferred stack (MERN, MEAN…)" },
            ].map(f => (
              <div key={f.name} style={{ marginBottom:10 }}>
                <input className="rm-input" name={f.name} placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange}/>
              </div>
            ))}

            <button className="rm-genbtn" onClick={generateRoadmap} disabled={loading}>
              {loading ? "⏳ Generating…" : "🗺 Generate Roadmap"}
            </button>

            {loading && (
              <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:7 }}>
                {["Analysing career goal…","Building phase plan…","Matching resources…","Generating links…"].map((t,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:"11px", color:"#6b7280", animation:`pulse 1.4s ${i*0.25}s infinite` }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:PHASE_COLORS[i] }}/>
                    {t}
                  </div>
                ))}
              </div>
            )}

            {/* Quick resource links always visible */}
            <div style={{ marginTop:18, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:"10px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10 }}>Quick Links</div>
              {[
                { label:"freeCodeCamp", url:"https://www.freecodecamp.org/", color:"#10b981" },
                { label:"The Odin Project", url:"https://www.theodinproject.com/", color:"#f59e0b" },
                { label:"Roadmap.sh", url:"https://roadmap.sh/", color:"#6366f1" },
                { label:"MDN Docs", url:"https://developer.mozilla.org/", color:"#0ea5e9" },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:7, textDecoration:"none", marginBottom:4, transition:"background 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:l.color, flexShrink:0 }}/>
                  <span style={{ fontSize:"12px", color:"#94a3b8" }}>{l.label}</span>
                  <span style={{ marginLeft:"auto", fontSize:"10px", color:"#475569" }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT OUTPUT ── */}
          <div style={{ flex:1, minWidth:0 }} ref={outputRef}>

            {/* Stats */}
            {phases.length > 0 && (
              <div className="fu" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:18 }}>
                {[
                  { label:"Phases",      value:phases.length,      color:"#6366f1" },
                  { label:"Total Tasks", value:totalItems,          color:"#10b981" },
                  { label:"Timeline",    value:formData.duration,   color:"#f59e0b" },
                  { label:"Level",       value:formData.experience, color:"#0ea5e9" },
                ].map(s => (
                  <div key={s.label} style={{ background:"#111827", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:"10px", color:"#6b7280", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.8px" }}>{s.label}</div>
                    <div style={{ fontSize:"19px", fontWeight:700, color:s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs + actions */}
            {roadmap && (
              <div className="fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", gap:5 }}>
                  {[{id:"visual",label:"📊 Visual"},{id:"resources",label:"📦 Resources"},{id:"raw",label:"📄 Raw"}].map(t => (
                    <button key={t.id} className={`rm-tab ${activeTab===t.id?"on":""}`} onClick={()=>setActiveTab(t.id)}>{t.label}</button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="rm-act" onClick={copyRoadmap}>{copied?"✓ Copied":"⎘ Copy"}</button>
                  <button className="rm-act" onClick={downloadTxt}>↓ TXT</button>
                  <button className="rm-act" onClick={downloadJSON}>↓ JSON</button>
                </div>5
              </div>
            )}

            {/* ── VISUAL VIEW ── */}
            {roadmap && activeTab === "visual" && (
              <div className="fu">
                {/* Goal banner */}
                <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.22)", borderRadius:11, padding:"12px 16px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ fontSize:"10px", color:"#818cf8", textTransform:"uppercase", letterSpacing:"1px", marginBottom:2 }}>Roadmap for</div>
                    <div style={{ fontSize:"15px", fontWeight:700, color:"#e2e8f0" }}>{formData.goal}</div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {[formData.experience, formData.duration, formData.learningStyle].map(v => (
                      <span key={v} style={{ padding:"3px 10px", borderRadius:20, fontSize:"11px", background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.09)" }}>{v}</span>
                    ))}
                  </div>
                </div>

                {/* Phase overview bar */}
                <div style={{ background:"#111827", border:"1px solid rgba(255,255,255,0.06)", borderRadius:11, padding:"14px 16px", marginBottom:14 }}>
                  <div style={{ fontSize:"10px", color:"#6b7280", marginBottom:10, textTransform:"uppercase", letterSpacing:"1px" }}>Phase Overview</div>
                  {phases.map((p,i) => (
                    <div key={i} style={{ marginBottom:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:2 }}>
                        <span style={{ color:"#cbd5e1" }}>{p.title}</span>
                        <span style={{ color:"#6b7280" }}>{p.items.length} tasks</span>
                      </div>
                      <ProgressBar pct={Math.min(100,(p.items.length/Math.max(...phases.map(x=>x.items.length),1))*100)} color={PHASE_COLORS[i%PHASE_COLORS.length]}/>
                    </div>
                  ))}
                </div>

                {/* Phase cards */}
                {phases.map((phase,i) => (
                  <PhaseCard key={i} phase={phase} index={i} color={PHASE_COLORS[i%PHASE_COLORS.length]} goal={formData.goal}/>
                ))}
              </div>
            )}

            {/* ── RESOURCES VIEW ── */}
            {roadmap && activeTab === "resources" && (
              <div className="fu">
                <ResourcePanel goal={formData.goal} learningStyle={formData.learningStyle}/>
              </div>
            )}

            {/* ── RAW VIEW ── */}
            {roadmap && activeTab === "raw" && (
              <div className="fu" style={{ background:"#0d1117", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:18, maxHeight:620, overflowY:"auto" }}>
                <pre style={{ color:"#e2e8f0", fontSize:"13px", lineHeight:1.8, whiteSpace:"pre-wrap", margin:0, fontFamily:"'Fira Code','Courier New',monospace" }}>
                  {roadmap}
                </pre>
              </div>
            )}

            {/* Empty state */}
            {!roadmap && !loading && (
              <div style={{ textAlign:"center", padding:"70px 20px", background:"#111827", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🗺</div>
                <div style={{ fontSize:"17px", fontWeight:600, color:"#e2e8f0", marginBottom:8 }}>Your roadmap will appear here</div>
                <div style={{ color:"#64748b", maxWidth:320, margin:"0 auto", fontSize:"13px" }}>Fill in your career goal and click Generate. You'll get a full plan with books, videos, projects and practice links.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}