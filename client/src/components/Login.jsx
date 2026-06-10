import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactTyped } from "react-typed";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PasswordStrength from "./PasswordStrength";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  // ================= LOAD EMAIL =================
  useEffect(() => {
    const saved = localStorage.getItem("email");
    if (saved) {
      setUser((p) => ({ ...p, email: saved }));
      setRemember(true);
    }
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });

    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(value)) {
        setEmailError("Invalid Email");
      } else {
        setEmailError("");
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (emailError) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        user
      );

      localStorage.setItem("token", res.data.token);

      if (remember) localStorage.setItem("email", user.email);
      else localStorage.removeItem("email");

      toast.success("Login successful 🚀");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 900);
    } catch (err) {
      setAttempts((prev) => prev + 1);
      toast.error(err?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <ToastContainer />

      {/* 🎬 VIDEO BACKGROUND */}
      <video autoPlay loop muted style={styles.video}>
        <source src="/login-bg.mp4.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div style={{ ...styles.overlay, background: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)" }}></div>

      <div style={styles.content}>
        {/* LOGIN CARD */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.logoContainer}>
              <div style={styles.logo}>AI</div>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              style={styles.themeButton}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <h2 style={styles.title}>Welcome Back</h2>

          <div style={styles.subtitle}>
            <ReactTyped
              strings={[
                "AI Interview Platform",
                "Practice Interviews",
                "Get Instant Feedback",
              ]}
              typeSpeed={50}
              backSpeed={30}
              loop
            />
          </div>

          <form onSubmit={submitHandler}>
            {/* EMAIL */}
            <div style={styles.field}>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={changeHandler}
                required
                style={styles.input}
                placeholder=" "
              />
              <label style={styles.label}>Email</label>
            </div>

            {emailError && <small style={styles.error}>{emailError}</small>}

            {/* PASSWORD */}
            <div style={styles.field}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={changeHandler}
                required
                style={styles.input}
                placeholder=" "
              />

              <label style={styles.label}>Password</label>

              <span
                style={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <PasswordStrength password={user.password} />

            {/* REMEMBER */}
            <div style={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span>Remember me</span>
            </div>

            <div style={styles.actions}>
              <a href="/forgot-password" style={styles.link}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              style={styles.registerButton}
            >
              Create Account
            </button>
          </form>

          <p style={styles.footer}>
            New user?{" "}
            <span
              style={styles.linkText}
              onClick={() => (window.location.href = "/register")}
            >
              Register Now
            </span>
          </p>

          <p style={styles.attempts}>Failed Attempts: {attempts}</p>
        </div>

        {/* PREVIEW CARD */}
        <div style={styles.previewCard}>
          <h3 style={styles.previewTitle}>Platform Features</h3>
          <ul style={styles.previewList}>
            <li>AI Mock Interviews</li>
            <li>Voice Interaction</li>
            <li>Certificates</li>
            <li>Performance Tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ================= CLEAN PROFESSIONAL STYLES ================= */

const styles = {
  wrapper: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: "sans-serif",
  },

  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -2,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },

  content: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    padding: "24px",
    flexWrap: "wrap",
  },

  card: {
    position: "relative",
    width: "380px",
    padding: "35px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center",
    color: "white",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "8px",
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },

  logo: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,198,255,0.5)",
  },

  themeButton: {
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    borderRadius: "10px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: "1",
  },

  title: {
    color: "white",
    marginBottom: "8px",
    fontSize: "24px",
  },

  subtitle: {
    color: "#eee",
    marginBottom: "25px",
    fontSize: "14px",
    minHeight: "22px",
  },

  field: {
    position: "relative",
    marginBottom: "18px",
  },

  input: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.9)",
  },

  label: {
    position: "absolute",
    left: "12px",
    top: "12px",
    fontSize: "13px",
    color: "#777",
    pointerEvents: "none",
    transition: "0.2s",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer",
  },

  error: {
    display: "block",
    marginTop: "-10px",
    marginBottom: "12px",
    color: "#ff6b6b",
    textAlign: "left",
    fontSize: "12px",
  },

  remember: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    color: "white",
    fontSize: "13px",
    marginBottom: "15px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px",
  },

  link: {
    color: "#00c6ff",
    fontSize: "13px",
    textDecoration: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },

  registerButton: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid white",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  footer: {
    marginTop: "15px",
    fontSize: "13px",
    color: "white",
  },

  linkText: {
    color: "#00c6ff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  attempts: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#e5e7eb",
  },

  previewCard: {
    width: "300px",
    padding: "20px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    backdropFilter: "blur(12px)",
  },

  previewTitle: {
    marginTop: 0,
    marginBottom: "14px",
    fontSize: "20px",
  },

  previewList: {
    margin: 0,
    paddingLeft: "20px",
    lineHeight: "1.9",
    fontSize: "14px",
  },
};

export default Login;
