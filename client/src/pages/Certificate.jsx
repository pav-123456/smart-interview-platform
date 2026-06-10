import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── helpers ────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");

function formatDate(d = new Date()) {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── StarBurst Seal (pure SVG — canvas-safe) ─────────────────────────────────
function Seal({ score }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16 - 90;
    const r = i % 2 === 0 ? 54 : 38;
    const rad = (angle * Math.PI) / 180;
    return `${60 + r * Math.cos(rad)},${60 + r * Math.sin(rad)}`;
  }).join(" ");

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points={pts} fill="#1e40af" />
      <circle cx="60" cy="60" r="32" fill="#1e40af" stroke="#fbbf24" strokeWidth="3" />
      <circle cx="60" cy="60" r="28" fill="#1d4ed8" />
      <text x="60" y="55" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily="Georgia,serif">
        SCORE
      </text>
      <text x="60" y="71" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700" fontFamily="Georgia,serif">
        {score ?? "–"}
      </text>
      <text x="60" y="82" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="Georgia,serif">
        /100
      </text>
    </svg>
  );
}

// ─── Ribbon (NO gradient — flat color only) ───────────────────────────────────
function Ribbon({ text = "Certificate of Achievement" }) {
  return (
    <div style={{
      background: "#1e40af",       // flat — no gradient
      color: "#fff",
      padding: "14px 60px",
      fontSize: "22px",
      fontFamily: "Georgia,serif",
      letterSpacing: "2px",
      fontWeight: "700",
      textTransform: "uppercase",
      display: "inline-block",
      position: "relative",
    }}>
      <span style={{
        position:"absolute",left:0,top:0,width:0,height:0,
        borderTop:"26px solid transparent",
        borderBottom:"26px solid transparent",
        borderLeft:"22px solid #f1f5f9",
      }}/>
      {text}
      <span style={{
        position:"absolute",right:0,top:0,width:0,height:0,
        borderTop:"26px solid transparent",
        borderBottom:"26px solid transparent",
        borderRight:"22px solid #f1f5f9",
      }}/>
    </div>
  );
}

// ─── Ornamental divider (SVG lines — NO CSS gradient) ─────────────────────────
function OrnDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"18px auto", maxWidth:460 }}>
      {/* Replace CSS gradient divs with an SVG line */}
      <svg width="200" height="2" style={{ flex:1 }}>
        <line x1="0" y1="1" x2="200" y2="1" stroke="#c7a84f" strokeWidth="1" />
      </svg>
      <svg width="22" height="22" viewBox="0 0 22 22">
        <polygon points="11,2 13.5,9 21,9 15,14 17.5,21 11,16.5 4.5,21 7,14 1,9 8.5,9" fill="#c7a84f"/>
      </svg>
      <svg width="200" height="2" style={{ flex:1 }}>
        <line x1="0" y1="1" x2="200" y2="1" stroke="#c7a84f" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Corner ornament ─────────────────────────────────────────────────────────
function Corner({ pos }) {
  const s = {
    position:"absolute",
    width:72,
    height:72,
    ...(pos.top    !== undefined ? { top:    pos.top    } : {}),
    ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
    ...(pos.left   !== undefined ? { left:   pos.left   } : {}),
    ...(pos.right  !== undefined ? { right:  pos.right  } : {}),
  };
  const bTop   = pos.top    !== undefined;
  const bLeft  = pos.left   !== undefined;
  const bBottom= pos.bottom !== undefined;
  const bRight = pos.right  !== undefined;

  return (
    <div style={s}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <polyline
          points={bTop && bLeft   ? "4,36 4,4 36,4"
                : bTop && bRight  ? "36,4 68,4 68,36"
                : bBottom && bLeft  ? "4,36 4,68 36,68"
                : "36,68 68,68 68,36"}
          fill="none" stroke="#c7a84f" strokeWidth="4" strokeLinecap="round"
        />
        <polyline
          points={bTop && bLeft   ? "12,32 12,12 32,12"
                : bTop && bRight  ? "40,12 60,12 60,32"
                : bBottom && bLeft  ? "12,40 12,60 32,60"
                : "40,60 60,60 60,40"}
          fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"
        />
        <circle cx={bLeft ? 4 : 68} cy={bTop ? 4 : 68} r="4" fill="#c7a84f" />
      </svg>
    </div>
  );
}

// ─── Signature block ─────────────────────────────────────────────────────────
function Signature({ label, name, title }) {
  return (
    <div style={{ textAlign:"center", minWidth:160 }}>
      <p style={{
        fontFamily:"'Dancing Script',cursive,Georgia,serif",
        fontSize:"22px",
        color:"#1e40af",
        margin:"0 0 4px",
        borderBottom:"1.5px solid #1e40af",
        paddingBottom:6,
      }}>{name}</p>
      <p style={{ margin:0, fontSize:"11px", fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"1px" }}>{label}</p>
      <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#6b7280" }}>{title}</p>
    </div>
  );
}

// ─── QR placeholder (pure divs — canvas-safe) ────────────────────────────────
function QRPlaceholder() {
  return (
    <div style={{
      width:72,height:72,border:"2px solid #d1d5db",borderRadius:4,
      display:"flex",alignItems:"center",justifyContent:"center",
      flexDirection:"column",gap:2,
      background:"#fff",
    }}>
      {[...Array(5)].map((_,r)=>(
        <div key={r} style={{display:"flex",gap:2}}>
          {[...Array(5)].map((_,c)=>{
            const filled = (r===0||r===4||c===0||c===4)||(r===1&&c===1)||(r===3&&c===3)||(r===2&&c===2);
            return <div key={c} style={{ width:10,height:10,background:filled?"#1e3a8a":"#e5e7eb" }}/>;
          })}
        </div>
      ))}
      <p style={{ margin:0,fontSize:"8px",color:"#9ca3af",marginTop:2 }}>VERIFY</p>
    </div>
  );
}

// ─── Main Certificate ─────────────────────────────────────────────────────────
export default function Certificate() {
  const certRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Read data from localStorage or use defaults
  let data = {};
  try { data = JSON.parse(localStorage.getItem("certificate") || "{}"); } catch(_){}

  const name          = data.name          || "Alexandra Johnson";
  const role          = data.role          || "Advanced Full-Stack Development";
  const score         = data.score         ?? 94;
  const organization  = data.organization  || "TechPro Academy";
  const certificateId = data.certificateId || "CERT-2024-0047";
  const issuerName    = data.issuerName    || "Dr. Michael Chen";
  const issuerTitle   = data.issuerTitle   || "Director, Learning & Certification";

  // ── Download PDF ────────────────────────────────────────────────────────────
  const downloadPDF = async () => {
    if (!certRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: false,
        foreignObjectRendering: false,
        // Strip box-shadow and any remaining problematic styles before capture
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("certificate-inner");
          if (el) {
            el.style.boxShadow = "none";
            el.style.backgroundImage = "none";
          }
          // Also strip from every element
          clonedDoc.querySelectorAll("*").forEach((node) => {
            node.style.boxShadow = "none";
            node.style.backgroundImage = "none";
          });
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation:"landscape", unit:"mm", format:"a4" });
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`certificate-${certificateId}.pdf`);
    } catch(err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please use the Print button instead.");
    } finally {
      setLoading(false);
    }
  };

  // ── Print ────────────────────────────────────────────────────────────────────
  const printCert = () => window.print();

  const gradeBadge = score >= 90
    ? { label:"With Distinction", color:"#15803d", bg:"#dcfce7" }
    : score >= 75
    ? { label:"With Merit",       color:"#b45309", bg:"#fef3c7" }
    : { label:"Pass",             color:"#dc2626", bg:"#fee2e2" };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @media print {
          .cert-actions { display:none !important; }
          body { background:#fff !important; margin:0; }
          #cert-root { padding:0 !important; background:#fff !important; }
          #certificate-inner { box-shadow:none !important; }
        }
      `}</style>

      <div id="cert-root" style={{ padding:"32px 20px", background:"#f1f5f9", minHeight:"100vh" }}>

        {/* ── Action buttons ── */}
        <div className="cert-actions" style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:28 }}>
          <button
            onClick={downloadPDF}
            disabled={loading}
            style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"10px 22px", background:"#1e40af", color:"#fff",
              border:"none", borderRadius:8, cursor:"pointer",
              fontSize:"14px", fontWeight:600, opacity:loading?0.7:1,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            {loading ? "Generating…" : "Download PDF"}
          </button>

          <button
            onClick={printCert}
            style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"10px 22px", background:"#111827", color:"#fff",
              border:"none", borderRadius:8, cursor:"pointer",
              fontSize:"14px", fontWeight:600,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
        </div>

        {/* ── Certificate ── */}
        <div
          ref={certRef}
          id="certificate-inner"
          style={{
            width: 960,
            margin: "0 auto",
            background: "#ffffff",           // flat white — no gradient
            border: "16px solid #1e3a8a",
            borderRadius: 4,
            padding: "48px 56px 40px",
            position: "relative",
            boxSizing: "border-box",
            // box-shadow removed from render target — only used visually
            fontFamily: "Georgia,serif",
          }}
        >
          {/* inner gold border */}
          <div style={{
            position:"absolute", inset:10,
            border:"2px solid #c7a84f",
            borderRadius:2,
            pointerEvents:"none",
          }}/>

          {/* corner ornaments */}
          <Corner pos={{ top:6,  left:6  }}/>
          <Corner pos={{ top:6,  right:6 }}/>
          <Corner pos={{ bottom:6, left:6  }}/>
          <Corner pos={{ bottom:6, right:6 }}/>

          {/* cert ID + QR — top-right */}
          <div style={{
            position:"absolute", top:28, right:44,
            display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8,
          }}>
            <div style={{ textAlign:"right" }}>
              <p style={{ margin:0, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", color:"#9ca3af" }}>
                Certificate No.
              </p>
              <p style={{ margin:0, fontSize:"13px", fontWeight:700, color:"#374151", fontFamily:"monospace" }}>
                {certificateId}
              </p>
            </div>
            <QRPlaceholder/>
          </div>

          {/* issuing org */}
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <p style={{ margin:0, fontSize:"12px", letterSpacing:"4px", textTransform:"uppercase", color:"#6b7280" }}>
              {organization}
            </p>
          </div>

          {/* ribbon */}
          <div style={{ textAlign:"center", margin:"0 0 4px" }}>
            <Ribbon/>
          </div>

          <OrnDivider/>

          {/* presented to */}
          <p style={{ textAlign:"center", fontSize:"15px", color:"#6b7280", margin:"0 0 8px", letterSpacing:"1px" }}>
            This certificate is proudly presented to
          </p>

          {/* recipient name */}
          <div style={{ textAlign:"center", margin:"0 0 6px" }}>
            <span style={{
              display:"inline-block",
              fontSize:"42px",
              fontFamily:"'Dancing Script',cursive,Georgia,serif",
              fontWeight:700,
              color:"#111827",
              borderBottom:"2px solid #c7a84f",
              paddingBottom:4,
              lineHeight:1.2,
            }}>
              {name}
            </span>
          </div>

          {/* body copy */}
          <p style={{ textAlign:"center", fontSize:"15px", color:"#374151", maxWidth:560, margin:"18px auto 0", lineHeight:1.7 }}>
            In recognition of the successful and exemplary completion of the course
          </p>

          {/* course title */}
          <h2 style={{
            textAlign:"center", fontSize:"26px", color:"#1e40af",
            margin:"10px 0 0", fontFamily:"Georgia,serif", fontWeight:700, letterSpacing:"0.5px",
          }}>
            {role}
          </h2>

          {/* score row */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:20, margin:"20px 0 4px" }}>
            <Seal score={score}/>
            <div style={{ textAlign:"left" }}>
              <p style={{ margin:0, fontSize:"11px", textTransform:"uppercase", letterSpacing:"2px", color:"#9ca3af" }}>
                Final Score
              </p>
              <p style={{ margin:0, fontSize:"38px", fontWeight:700, color:"#16a34a", lineHeight:1 }}>
                {score}<span style={{ fontSize:"20px", color:"#6b7280" }}>/100</span>
              </p>
              <p style={{
                margin:"4px 0 0", fontSize:"13px", fontWeight:600,
                color: gradeBadge.color,
                background: gradeBadge.bg,
                display:"inline-block", padding:"2px 10px", borderRadius:12,
              }}>
                {gradeBadge.label}
              </p>
            </div>
          </div>

          <OrnDivider/>

          {/* date + signature + stamp */}
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"flex-end",
            padding:"0 16px", marginTop:4,
          }}>
            <div style={{ textAlign:"center" }}>
              <p style={{ margin:0, fontSize:"11px", textTransform:"uppercase", letterSpacing:"1px", color:"#9ca3af" }}>
                Date of Issue
              </p>
              <p style={{ margin:"4px 0 0", fontSize:"15px", color:"#374151", fontWeight:600 }}>
                {formatDate()}
              </p>
            </div>

            <Signature label="Authorized Signature" name={issuerName} title={issuerTitle}/>

            <div style={{ textAlign:"center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="#1e40af" strokeWidth="3"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#c7a84f" strokeWidth="1.5" strokeDasharray="4 3"/>
                <text x="40" y="34" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e40af" fontFamily="Arial,sans-serif">OFFICIALLY</text>
                <text x="40" y="45" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af" fontFamily="Arial,sans-serif">CERTIFIED</text>
                <text x="40" y="57" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="Arial,sans-serif">{new Date().getFullYear()}</text>
              </svg>
            </div>
          </div>

          {/* footer */}
          <div style={{
            marginTop:24, borderTop:"1px solid #e5e7eb", paddingTop:10,
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <p style={{ margin:0, fontSize:"10px", color:"#9ca3af" }}>
              Verify at: verify.{organization.toLowerCase().replace(/\s/g,"")}.com/{certificateId}
            </p>
            <p style={{ margin:0, fontSize:"10px", color:"#9ca3af", textAlign:"center" }}>
              This certificate confirms the above-named individual has met all requirements.
            </p>
            <p style={{ margin:0, fontSize:"10px", color:"#9ca3af" }}>
              Issued by {organization}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
