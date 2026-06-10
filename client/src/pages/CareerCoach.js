import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  FaRobot,
  FaPaperPlane,
  FaTrash,
  FaMicrophone,
  FaDownload,
  FaUserGraduate,
  FaBriefcase,
  FaChartLine,
} from "react-icons/fa";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
  }

  .career-coach-root {
    min-height: 100vh;
    display: flex;
    background: linear-gradient(135deg, #0f172a, #1e293b, #111827);
    color: white;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .career-coach-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 10%, rgba(37,99,235,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(139,92,246,0.14) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 60% 30%, rgba(16,185,129,0.08) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .sidebar {
    width: 300px;
    padding: 28px 22px;
    border-right: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  .sidebar-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.3px;
    color: #e2e8f0;
  }

  .sidebar-title svg {
    color: #60a5fa;
  }

  .btn-clear {
    width: 100%;
    padding: 12px;
    margin-top: 22px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.2px;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px rgba(239,68,68,0.25);
  }

  .btn-clear:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239,68,68,0.4);
  }

  .btn-export {
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px rgba(139,92,246,0.25);
  }

  .btn-export:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139,92,246,0.4);
  }

  .section-title {
    margin-top: 28px;
    margin-bottom: 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    font-family: 'Syne', sans-serif;
  }

  .quick-btn {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.85);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 9px;
    transition: all 0.25s ease;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
    margin-bottom: 8px;
  }

  .quick-btn:hover {
    background: rgba(37,99,235,0.2);
    border-color: rgba(37,99,235,0.45);
    transform: translateX(3px);
  }

  .main-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .chat-header {
    padding: 22px 28px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(15px);
  }

  .chat-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #f1f5f9;
  }

  .chat-header p {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    margin-top: 4px;
    letter-spacing: 0.5px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .career-card {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
    padding: 16px 14px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.09);
    text-align: center;
    transition: all 0.3s ease;
    cursor: default;
  }

  .career-card:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.18);
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  }

  .career-card svg {
    color: #60a5fa;
    margin-bottom: 8px;
  }

  .career-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 4px;
  }

  .career-card p {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #e2e8f0;
    letter-spacing: -1px;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }

  .chat-messages::-webkit-scrollbar {
    width: 4px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  .empty-state {
    text-align: center;
    margin: auto;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    opacity: 0.7;
  }

  .empty-state svg {
    color: #3b82f6;
    filter: drop-shadow(0 0 20px rgba(59,130,246,0.5));
    animation: float 3s ease-in-out infinite;
  }

  .empty-state h2 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #e2e8f0;
    letter-spacing: -0.5px;
  }

  .empty-state p {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    max-width: 320px;
    line-height: 1.6;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .msg-row {
    display: flex;
    margin-bottom: 18px;
    animation: fadeIn 0.35s ease;
  }

  .msg-row.user { justify-content: flex-end; }
  .msg-row.ai { justify-content: flex-start; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg-bubble {
    max-width: 75%;
    padding: 14px 18px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
    font-size: 14px;
  }

  .msg-bubble.user {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    border-color: rgba(79,70,229,0.4);
    border-radius: 20px 20px 4px 20px;
  }

  .msg-bubble.ai {
    background: rgba(255,255,255,0.07);
    border-radius: 20px 20px 20px 4px;
  }

  .msg-time {
    opacity: 0.5;
    display: block;
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.3px;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.06);
    border-radius: 20px 20px 20px 4px;
    border: 1px solid rgba(255,255,255,0.08);
    width: fit-content;
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    animation: fadeIn 0.3s ease;
  }

  .dot {
    width: 7px;
    height: 7px;
    background: #60a5fa;
    border-radius: 50%;
    animation: bounce 1s infinite;
    flex-shrink: 0;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .input-area {
    padding: 18px 24px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(15px);
  }

  .chat-input {
    flex: 1;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    outline: none;
    background: rgba(255,255,255,0.07);
    color: #f1f5f9;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s ease;
  }

  .chat-input::placeholder { color: rgba(255,255,255,0.3); }

  .chat-input:focus {
    border-color: rgba(37,99,235,0.5);
    background: rgba(255,255,255,0.1);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }

  .btn-send {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: white;
    border: none;
    padding: 14px 22px;
    border-radius: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px rgba(37,99,235,0.3);
    flex-shrink: 0;
  }

  .btn-send:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37,99,235,0.5);
  }

  .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-mic {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px rgba(16,185,129,0.25);
    flex-shrink: 0;
  }

  .btn-mic:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.4); }
  .btn-mic.active { background: linear-gradient(135deg, #ef4444, #dc2626); animation: pulse 1s infinite; }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 4px 15px rgba(239,68,68,0.3); }
    50% { box-shadow: 0 4px 25px rgba(239,68,68,0.7); }
  }
`;

function CareerCoach() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("careerChat")) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-save to localStorage and scroll
  useEffect(() => {
    localStorage.setItem("careerChat", JSON.stringify(chat));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async (overrideText) => {
    const userText = overrideText || message;
    if (!userText.trim()) return;

    setChat((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setMessage("");
    setLoading(true);
    setAiTyping(true);

    try {
      // ✅ LOCAL BACKEND (Express/Flask) — use this when running locally
      const res = await fetch("http://localhost:5000/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      const data = await res.json();
      const reply =
        data.reply || "Sorry, I couldn't generate a response. Please try again.";

      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          {
            sender: "ai",
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setAiTyping(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setChat((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Unable to connect to AI server. Please try again.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setAiTyping(false);
      }, 500);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setChat([]);
    localStorage.removeItem("careerChat");
  };

  const quickPrompt = (text) => {
    setMessage(text);
  };

  const exportChat = () => {
    const content = chat
      .map((m) => `[${m.time}] ${m.sender === "user" ? "You" : "AI Coach"}: ${m.text}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `career-chat-${new Date().toLocaleDateString().replace(/\//g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser. Try Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <>
      <style>{style}</style>
      <div className="career-coach-root">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-title">
            <FaRobot /> Career Coach
          </div>

          <button onClick={clearChat} className="btn-clear">
            <FaTrash /> Clear Chat
          </button>

          <button onClick={exportChat} className="btn-export">
            <FaDownload /> Export Chat
          </button>

          <div className="section-title">Quick Questions</div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { icon: "📄", label: "Resume Review", prompt: "Review my resume and suggest improvements" },
              { icon: "💼", label: "Interview Questions", prompt: "Generate interview questions for a React Developer" },
              { icon: "🚀", label: "Career Roadmap", prompt: "Create a roadmap for Full Stack Development" },
              { icon: "👨‍💼", label: "LinkedIn Tips", prompt: "How can I improve my LinkedIn profile?" },
              { icon: "💰", label: "Salary Negotiation", prompt: "How do I negotiate a higher salary offer?" },
              { icon: "🎯", label: "Skill Gap Analysis", prompt: "What skills should I learn for a Data Science career?" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => quickPrompt(item.prompt)}
                className="quick-btn"
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat */}
        <div className="main-chat">
          {/* Header */}
          <div className="chat-header">
            <h1>🤖 AI Career Coach Assistant</h1>
            <p>Resume • Interview • Jobs • Career Growth • Skill Development</p>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="career-card">
                <FaBriefcase size={24} />
                <h3>Career Match</h3>
                <p>92%</p>
              </div>
              <div className="career-card">
                <FaChartLine size={24} />
                <h3>Skill Growth</h3>
                <p>+18%</p>
              </div>
              <div className="career-card">
                <FaUserGraduate size={24} />
                <h3>Resume Score</h3>
                <p>88/100</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chat.length === 0 && !aiTyping && (
              <div className="empty-state">
                <FaRobot size={72} />
                <h2>Welcome to AI Career Coach</h2>
                <p>
                  Ask anything about jobs, interviews, resumes, careers, skills,
                  or learning paths. I'm here to guide you.
                </p>
              </div>
            )}

            {chat.map((msg, index) => (
              <div key={index} className={`msg-row ${msg.sender}`}>
                <div className={`msg-bubble ${msg.sender}`}>
                  <div>{msg.text}</div>
                  {msg.time && <small className="msg-time">{msg.time}</small>}
                </div>
              </div>
            ))}

            {aiTyping && (
              <div className="typing-indicator">
                🤖 AI Typing
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={isListening ? "🎤 Listening..." : "Ask your career question..."}
            />

            <button
              onClick={toggleVoice}
              className={`btn-mic ${isListening ? "active" : ""}`}
              title="Voice input"
            >
              <FaMicrophone />
            </button>

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="btn-send"
              title="Send message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CareerCoach;