import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        formData
      );

      toast.success(res.data.message || "Registered successfully 🚀");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <ToastContainer />

      <div style={styles.card}>

        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Start your journey with us</p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div style={styles.field}>
            <input
              type="text"
              name="name"
              placeholder=" "
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Full Name</label>
          </div>

          {/* EMAIL */}
          <div style={styles.field}>
            <input
              type="email"
              name="email"
              placeholder=" "
              onChange={handleChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Email</label>
          </div>

          {/* PASSWORD */}
          <div style={styles.field}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              onChange={handleChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>Password</label>

            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p style={styles.footer}>
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const styles = {

  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial"
  },

  card: {
    width: "380px",
    padding: "35px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    borderRadius: "18px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.2)",
    textAlign: "center"
  },

  title: {
    color: "white",
    marginBottom: "5px"
  },

  subtitle: {
    color: "#eee",
    marginBottom: "25px"
  },

  field: {
    position: "relative",
    marginBottom: "18px"
  },

  input: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.9)"
  },

  label: {
    position: "absolute",
    left: "12px",
    top: "12px",
    fontSize: "13px",
    color: "#777",
    pointerEvents: "none"
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#00c6ff",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  footer: {
    marginTop: "15px",
    fontSize: "13px",
    color: "white"
  }
};

export default Register;