import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ===============================
// AUTH COMPONENTS
// ===============================
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
// ===============================
// DASHBOARD / FEATURES
// ===============================
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Interview from "./pages/Interview";
import MockInterview from "./pages/MockInterview";
import InterviewHistory from "./pages/InterviewHistory";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CertificatePage from "./pages/Certificate";
import CareerCoach from "./pages/CareerCoach";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobRecommendations from "./pages/JobRecommendations";
import Roadmap from "./pages/Roadmap";
// ===============================
// PROTECTED ROUTE COMPONENT
// ===============================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===============================
            PUBLIC ROUTES
        =============================== */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
        {/* ===============================
            PROTECTED ROUTES
        =============================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <InterviewHistory />
            </ProtectedRoute>
          }
        />
        <Route
  path="/career-coach"
  element={<CareerCoach />}
/>
<Route
  path="/resume-builder"
  element={<ResumeBuilder />}
/>
<Route
  path="/job-recommendations"
  element={<JobRecommendations />}
/>
<Route path="/roadmap" element={<Roadmap />} />
        {/* ===============================
            🏆 CERTIFICATE PAGE
        =============================== */}
        <Route
          path="/certificate"
          element={
            <ProtectedRoute>
              <CertificatePage />
            </ProtectedRoute>
          }
        />

        {/* ===============================
            FALLBACK ROUTE
        =============================== */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;