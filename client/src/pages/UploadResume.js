import React, { useState } from "react";
import {
  FaUpload,
  FaFilePdf,
  FaCheckCircle,
  FaDownload,
  FaRobot,
  FaStar,
} from "react-icons/fa";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setResult(data.message);
      setText(data.extractedText);
      setAnalysis(data.analysis);

      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("Upload Failed");
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const element = document.createElement("a");

    const fileContent = `
Resume Analysis Report

Status:
${result}

AI Analysis:
${analysis}

Resume Text:
${text}
`;

    const fileBlob = new Blob([fileContent], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(fileBlob);
    element.download = "Resume_Report.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "50px",
        background:
          "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(15px)",
          borderRadius: "25px",
          padding: "40px",
          color: "white",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          🤖 AI Resume Analyzer
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Upload your resume and get instant AI-powered feedback
        </p>

        <div
          style={{
            border: "2px dashed #60a5fa",
            borderRadius: "20px",
            padding: "40px",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          <FaUpload size={40} />

          <h3>Upload PDF Resume</h3>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          {file && (
            <div
              style={{
                marginTop: "15px",
              }}
            >
              <FaFilePdf size={25} />
              <p>{file.name}</p>
            </div>
          )}
        </div>

        <button
          onClick={uploadFile}
          style={{
            marginTop: "25px",
            width: "100%",
            padding: "15px",
            background:
              "linear-gradient(90deg,#2563eb,#3b82f6)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Analyze Resume
        </button>

        {loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <h3>🔄 AI is analyzing your resume...</h3>

            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#334155",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#38bdf8",
                  animation:
                    "loading 2s infinite linear",
                }}
              />
            </div>
          </div>
        )}

        {result && (
          <>
            <div
              style={{
                marginTop: "35px",
                background:
                  "rgba(255,255,255,0.1)",
                borderRadius: "15px",
                padding: "20px",
              }}
            >
              <h2>
                <FaCheckCircle /> Upload Status
              </h2>

              <p>{result}</p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  background:
                    "rgba(255,255,255,0.1)",
                  padding: "20px",
                  borderRadius: "15px",
                  textAlign: "center",
                }}
              >
                <FaStar size={35} />

                <h2>ATS Score</h2>

                <h1>87%</h1>
              </div>

              <div
                style={{
                  background:
                    "rgba(255,255,255,0.1)",
                  padding: "20px",
                  borderRadius: "15px",
                  textAlign: "center",
                }}
              >
                <FaRobot size={35} />

                <h2>AI Rating</h2>

                <h1>9/10</h1>
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
                background:
                  "rgba(255,255,255,0.1)",
                padding: "25px",
                borderRadius: "15px",
              }}
            >
              <h2>📄 Extracted Resume Text</h2>

              <div
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {text}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
                background:
                  "rgba(255,255,255,0.1)",
                padding: "25px",
                borderRadius: "15px",
              }}
            >
              <h2>🤖 AI Analysis</h2>

              <p
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {analysis}
              </p>
            </div>

            <button
              onClick={downloadReport}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background: "#10b981",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              <FaDownload /> Download Report
            </button>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
}