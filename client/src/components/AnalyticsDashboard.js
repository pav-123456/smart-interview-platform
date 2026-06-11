import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";

// =========================================
// ADVANCED ANALYTICS DASHBOARD
// =========================================

function AnalyticsDashboard() {
  // =========================================
  // STATES
  // =========================================
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("all"); // all, week, month, year
  const [selectedRole, setSelectedRole] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [sortBy] = useState("date"); // date, score, role
  const [chartType, setChartType] = useState("line"); // line, area, bar
  const [showPredictions, setShowPredictions] = useState(true);
  const refreshIntervalRef = useRef(null);

  // =========================================
  // API
  // =========================================
  const API = "http://localhost:5000/api/history";

  // =========================================
  // FETCH DATA WITH ERROR HANDLING
  // =========================================
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("📊 ANALYTICS DATA:", data);

      if (data.success) {
        setInterviews(data.interviews || []);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("❌ ANALYTICS ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // AUTO REFRESH
  // =========================================
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(fetchHistory, 30000); // 30 seconds
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, fetchHistory]);

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // =========================================
  // UTILITY FUNCTIONS
  // =========================================
  const extractScore = useCallback((feedback) => {
    const match = feedback?.match(/(\d+)\/10/);
    return match ? Number(match[1]) : 0;
  }, []);

  const extractDetailedMetrics = useCallback((feedback) => {
    // Extract multiple metrics from feedback
    const communication = feedback?.match(/communication[:\s]+(\d+)/i)?.[1] || 5;
    const technical = feedback?.match(/technical[:\s]+(\d+)/i)?.[1] || 5;
    const problemSolving = feedback?.match(/problem[- ]solving[:\s]+(\d+)/i)?.[1] || 5;
    const confidence = feedback?.match(/confidence[:\s]+(\d+)/i)?.[1] || 5;

    return {
      communication: Number(communication),
      technical: Number(technical),
      problemSolving: Number(problemSolving),
      confidence: Number(confidence),
    };
  }, []);

  // =========================================
  // DATE FILTERING
  // =========================================
  const filteredInterviews = useMemo(() => {
    let filtered = [...interviews];

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(
        (item) => new Date(item.createdAt) >= cutoffDate
      );
    }

    // Role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((item) => item.role === selectedRole);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return extractScore(b.feedback) - extractScore(a.feedback);
        case "role":
          return a.role.localeCompare(b.role);
        case "date":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [interviews, dateRange, selectedRole, sortBy, extractScore]);

  // =========================================
  // ADVANCED ANALYTICS
  // =========================================
  const analytics = useMemo(() => {
    if (filteredInterviews.length === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        improvementRate: 0,
        successRate: 0,
        consistencyScore: 0,
        trendDirection: "neutral",
      };
    }

    const scores = filteredInterviews.map((item) => extractScore(item.feedback));
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = (totalScore / scores.length).toFixed(2);

    // Calculate improvement rate (comparing first half vs second half)
    const midPoint = Math.floor(scores.length / 2);
    const firstHalf = scores.slice(0, midPoint);
    const secondHalf = scores.slice(midPoint);

    const firstHalfAvg = firstHalf.length
      ? firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length
      : 0;
    const secondHalfAvg = secondHalf.length
      ? secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length
      : 0;

    const improvementRate =
      firstHalfAvg > 0
        ? (((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1)
        : 0;

    // Success rate (scores >= 7)
    const successfulInterviews = scores.filter((s) => s >= 7).length;
    const successRate = ((successfulInterviews / scores.length) * 100).toFixed(1);

    // Consistency score (lower standard deviation = higher consistency)
    const mean = totalScore / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = Math.max(0, (10 - stdDev)).toFixed(1);

    // Trend direction
    const trendDirection =
      improvementRate > 5 ? "up" : improvementRate < -5 ? "down" : "neutral";

    return {
      totalInterviews: filteredInterviews.length,
      averageScore,
      improvementRate,
      successRate,
      consistencyScore,
      trendDirection,
      scores,
    };
  }, [filteredInterviews, extractScore]);

  // =========================================
  // CHART DATA
  // =========================================
  const scoreData = useMemo(() => {
    return filteredInterviews.map((item, index) => ({
      name: `Interview ${filteredInterviews.length - index}`,
      score: extractScore(item.feedback),
      role: item.role,
      date: new Date(item.createdAt).toLocaleDateString(),
      timestamp: new Date(item.createdAt).getTime(),
    })).reverse();
  }, [filteredInterviews, extractScore]);

  // =========================================
  // PREDICTION DATA (LINEAR REGRESSION)
  // =========================================
  const predictionData = useMemo(() => {
    if (scoreData.length < 3) return [];

    const n = scoreData.length;
    const sumX = scoreData.reduce((sum, _, i) => sum + i, 0);
    const sumY = scoreData.reduce((sum, d) => sum + d.score, 0);
    const sumXY = scoreData.reduce((sum, d, i) => sum + i * d.score, 0);
    const sumX2 = scoreData.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate predictions for next 3 interviews
    return [
      ...scoreData,
      {
        name: `Predicted ${n + 1}`,
        predictedScore: Math.min(10, Math.max(0, slope * n + intercept)),
        isPrediction: true,
      },
      {
        name: `Predicted ${n + 2}`,
        predictedScore: Math.min(10, Math.max(0, slope * (n + 1) + intercept)),
        isPrediction: true,
      },
      {
        name: `Predicted ${n + 3}`,
        predictedScore: Math.min(10, Math.max(0, slope * (n + 2) + intercept)),
        isPrediction: true,
      },
    ];
  }, [scoreData]);

  // =========================================
  // PIE CHART DATA
  // =========================================
  const pieData = useMemo(() => {
    const excellent = filteredInterviews.filter(
      (item) => extractScore(item.feedback) >= 8
    ).length;
    const good = filteredInterviews.filter((item) => {
      const score = extractScore(item.feedback);
      return score >= 6 && score < 8;
    }).length;
    const average = filteredInterviews.filter((item) => {
      const score = extractScore(item.feedback);
      return score >= 4 && score < 6;
    }).length;
    const poor = filteredInterviews.filter(
      (item) => extractScore(item.feedback) < 4
    ).length;

    return [
      { name: "Excellent (8-10)", value: excellent, color: "#10b981" },
      { name: "Good (6-7)", value: good, color: "#3b82f6" },
      { name: "Average (4-5)", value: average, color: "#f59e0b" },
      { name: "Poor (0-3)", value: poor, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [filteredInterviews, extractScore]);

  // =========================================
  // ROLE PERFORMANCE
  // =========================================
  const rolePerformance = useMemo(() => {
    const roleMap = {};

    filteredInterviews.forEach((item) => {
      const role = item.role;
      const score = extractScore(item.feedback);

      if (!roleMap[role]) {
        roleMap[role] = {
          total: 0,
          count: 0,
          scores: [],
          maxScore: 0,
          minScore: 10,
        };
      }

      roleMap[role].total += score;
      roleMap[role].count += 1;
      roleMap[role].scores.push(score);
      roleMap[role].maxScore = Math.max(roleMap[role].maxScore, score);
      roleMap[role].minScore = Math.min(roleMap[role].minScore, score);
    });

    return Object.keys(roleMap)
      .map((role) => ({
        role,
        average: Number((roleMap[role].total / roleMap[role].count).toFixed(1)),
        count: roleMap[role].count,
        maxScore: roleMap[role].maxScore,
        minScore: roleMap[role].minScore,
        consistency: (10 - Math.sqrt(
          roleMap[role].scores.reduce(
            (sum, s) => sum + Math.pow(s - roleMap[role].total / roleMap[role].count, 2),
            0
          ) / roleMap[role].count
        )).toFixed(1),
      }))
      .sort((a, b) => b.average - a.average);
  }, [filteredInterviews, extractScore]);

  // =========================================
  // RADAR CHART DATA (SKILLS ANALYSIS)
  // =========================================
  const skillsRadarData = useMemo(() => {
    if (filteredInterviews.length === 0) return [];

    const metrics = {
      communication: [],
      technical: [],
      problemSolving: [],
      confidence: [],
      overall: [],
    };

    filteredInterviews.forEach((item) => {
      const detailed = extractDetailedMetrics(item.feedback);
      metrics.communication.push(detailed.communication);
      metrics.technical.push(detailed.technical);
      metrics.problemSolving.push(detailed.problemSolving);
      metrics.confidence.push(detailed.confidence);
      metrics.overall.push(extractScore(item.feedback));
    });

    return [
      {
        skill: "Communication",
        score:
          metrics.communication.reduce((a, b) => a + b, 0) /
          metrics.communication.length,
        fullMark: 10,
      },
      {
        skill: "Technical",
        score:
          metrics.technical.reduce((a, b) => a + b, 0) / metrics.technical.length,
        fullMark: 10,
      },
      {
        skill: "Problem Solving",
        score:
          metrics.problemSolving.reduce((a, b) => a + b, 0) /
          metrics.problemSolving.length,
        fullMark: 10,
      },
      {
        skill: "Confidence",
        score:
          metrics.confidence.reduce((a, b) => a + b, 0) / metrics.confidence.length,
        fullMark: 10,
      },
      {
        skill: "Overall",
        score: metrics.overall.reduce((a, b) => a + b, 0) / metrics.overall.length,
        fullMark: 10,
      },
    ];
  }, [filteredInterviews, extractScore, extractDetailedMetrics]);

  // =========================================
  // TIME SERIES DATA (WEEKLY AGGREGATION)
  // =========================================
  const timeSeriesData = useMemo(() => {
    if (filteredInterviews.length === 0) return [];

    const weeklyData = {};

    filteredInterviews.forEach((item) => {
      const date = new Date(item.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          scores: [],
          count: 0,
        };
      }

      weeklyData[weekKey].scores.push(extractScore(item.feedback));
      weeklyData[weekKey].count += 1;
    });

    return Object.values(weeklyData)
      .map((week) => ({
        week: new Date(week.week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        average: (
          week.scores.reduce((a, b) => a + b, 0) / week.scores.length
        ).toFixed(1),
        count: week.count,
        max: Math.max(...week.scores),
        min: Math.min(...week.scores),
      }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));
  }, [filteredInterviews, extractScore]);

  // =========================================
  // BEST & WORST PERFORMANCES
  // =========================================
  const bestPerformance = useMemo(() => {
    if (filteredInterviews.length === 0) return null;
    return filteredInterviews.reduce((best, current) => {
      const bestScore = extractScore(best.feedback);
      const currentScore = extractScore(current.feedback);
      return currentScore > bestScore ? current : best;
    });
  }, [filteredInterviews, extractScore]);

  const worstPerformance = useMemo(() => {
    if (filteredInterviews.length === 0) return null;
    return filteredInterviews.reduce((worst, current) => {
      const worstScore = extractScore(worst.feedback);
      const currentScore = extractScore(current.feedback);
      return currentScore < worstScore ? current : worst;
    });
  }, [filteredInterviews, extractScore]);

  // =========================================
  // AI INSIGHTS GENERATOR
  // =========================================
  const aiInsights = useMemo(() => {
    const insights = [];

    if (analytics.trendDirection === "up") {
      insights.push({
        type: "success",
        icon: "📈",
        text: `Excellent progress! Your scores improved by ${analytics.improvementRate}% over time.`,
      });
    } else if (analytics.trendDirection === "down") {
      insights.push({
        type: "warning",
        icon: "⚠️",
        text: `Scores declined by ${Math.abs(analytics.improvementRate)}%. Focus on consistent practice.`,
      });
    }

    if (analytics.successRate >= 70) {
      insights.push({
        type: "success",
        icon: "🎯",
        text: `Outstanding! ${analytics.successRate}% of your interviews scored 7 or above.`,
      });
    } else if (analytics.successRate < 50) {
      insights.push({
        type: "info",
        icon: "💡",
        text: `Success rate is ${analytics.successRate}%. Consider targeted practice in weak areas.`,
      });
    }

    if (analytics.consistencyScore >= 7) {
      insights.push({
        type: "success",
        icon: "🎖️",
        text: `High consistency score of ${analytics.consistencyScore}/10. Your performance is stable!`,
      });
    } else {
      insights.push({
        type: "info",
        icon: "🔄",
        text: `Consistency score: ${analytics.consistencyScore}/10. Work on maintaining steady performance.`,
      });
    }

    if (rolePerformance.length > 0) {
      const bestRole = rolePerformance[0];
      insights.push({
        type: "info",
        icon: "🏆",
        text: `Your strongest role is ${bestRole.role} with an average of ${bestRole.average}/10.`,
      });

      if (rolePerformance.length > 1) {
        const worstRole = rolePerformance[rolePerformance.length - 1];
        if (worstRole.average < 6) {
          insights.push({
            type: "warning",
            icon: "📚",
            text: `Focus on improving ${worstRole.role} interviews (current avg: ${worstRole.average}/10).`,
          });
        }
      }
    }

    // Skill-specific insights
    const weakestSkill = skillsRadarData.reduce((min, skill) =>
      skill.score < min.score ? skill : min
    , skillsRadarData[0] || { skill: "N/A", score: 0 });

    if (weakestSkill.score < 6) {
      insights.push({
        type: "info",
        icon: "🎓",
        text: `${weakestSkill.skill} needs improvement. Consider focused practice in this area.`,
      });
    }

    return insights;
  }, [analytics, rolePerformance, skillsRadarData]);

  // =========================================
  // EXPORT FUNCTIONS
  // =========================================
  const exportToCSV = useCallback(() => {
    const headers = ["Date", "Role", "Score", "Feedback"];
    const rows = filteredInterviews.map((item) => [
      new Date(item.createdAt).toLocaleString(),
      item.role,
      extractScore(item.feedback),
      item.feedback.replace(/,/g, ";"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredInterviews, extractScore]);

  const exportToJSON = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      analytics,
      interviews: filteredInterviews,
      rolePerformance,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-analytics-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredInterviews, analytics, rolePerformance]);

  // =========================================
  // UNIQUE ROLES
  // =========================================
  const uniqueRoles = useMemo(() => {
    return [...new Set(interviews.map((item) => item.role))];
  }, [interviews]);

  // =========================================
  // CUSTOM TOOLTIP
  // =========================================
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: "3px 0" }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // =========================================
  // RENDER
  // =========================================
  return (
    <div style={mainContainer}>
      <div style={mainCard}>
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}
        <div style={headerSection}>
          <div>
            <h1 style={title}>📊 Advanced Interview Analytics</h1>
            <p style={subtitle}>
              AI-Powered Performance Intelligence & Predictive Insights
            </p>
          </div>
          <div style={headerActions}>
            <button
              onClick={fetchHistory}
              style={actionButton}
              disabled={loading}
            >
              🔄 Refresh
            </button>
            <button onClick={exportToCSV} style={actionButton}>
              📥 CSV
            </button>
            <button onClick={exportToJSON} style={actionButton}>
              📦 JSON
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* FILTERS & CONTROLS */}
        {/* ========================================= */}
        <div style={controlPanel}>
          <div style={filterGroup}>
            <label style={filterLabel}>📅 Time Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={selectInput}
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div style={filterGroup}>
            <label style={filterLabel}>💼 Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={selectInput}
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div style={filterGroup}>
            <label style={filterLabel}>📊 Chart Type:</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={selectInput}
            >
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>

          <div style={filterGroup}>
            <label style={filterLabel}>🔄 Auto Refresh:</label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={checkboxInput}
            />
          </div>

          <div style={filterGroup}>
            <label style={filterLabel}>🔮 Predictions:</label>
            <input
              type="checkbox"
              checked={showPredictions}
              onChange={(e) => setShowPredictions(e.target.checked)}
              style={checkboxInput}
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* LOADING & ERROR */}
        {/* ========================================= */}
        {loading && (
          <div style={loadingBox}>
            <div style={spinner}></div>
            <p>Loading advanced analytics...</p>
          </div>
        )}

        {error && (
          <div style={errorBox}>
            ❌ Error: {error}
            <button onClick={fetchHistory} style={retryButton}>
              Retry
            </button>
          </div>
        )}

        {/* ========================================= */}
        {/* ADVANCED STATS GRID */}
        {/* ========================================= */}
        <div style={statsGrid}>
          <div style={{ ...statCard, ...statCardPrimary }}>
            <div style={statIcon}>📁</div>
            <h3 style={statLabel}>Total Interviews</h3>
            <p style={statNumber}>{analytics.totalInterviews}</p>
            <p style={statSubtext}>Analyzed sessions</p>
          </div>

          <div style={{ ...statCard, ...statCardSuccess }}>
            <div style={statIcon}>⭐</div>
            <h3 style={statLabel}>Average Score</h3>
            <p style={statNumber}>{analytics.averageScore}/10</p>
            <p style={statSubtext}>Overall performance</p>
          </div>

          <div
            style={{
              ...statCard,
              ...(analytics.improvementRate >= 0
                ? statCardSuccess
                : statCardWarning),
            }}
          >
            <div style={statIcon}>
              {analytics.trendDirection === "up"
                ? "📈"
                : analytics.trendDirection === "down"
                ? "📉"
                : "➡️"}
            </div>
            <h3 style={statLabel}>Improvement Rate</h3>
            <p style={statNumber}>
              {analytics.improvementRate > 0 ? "+" : ""}
              {analytics.improvementRate}%
            </p>
            <p style={statSubtext}>Trend analysis</p>
          </div>

          <div style={{ ...statCard, ...statCardInfo }}>
            <div style={statIcon}>🎯</div>
            <h3 style={statLabel}>Success Rate</h3>
            <p style={statNumber}>{analytics.successRate}%</p>
            <p style={statSubtext}>Scores ≥ 7/10</p>
          </div>

          <div style={{ ...statCard, ...statCardPurple }}>
            <div style={statIcon}>🎖️</div>
            <h3 style={statLabel}>Consistency</h3>
            <p style={statNumber}>{analytics.consistencyScore}/10</p>
            <p style={statSubtext}>Performance stability</p>
          </div>

          <div style={{ ...statCard, ...statCardOrange }}>
            <div style={statIcon}>🏆</div>
            <h3 style={statLabel}>Best Role</h3>
            <p style={statNumber}>
              {rolePerformance[0]?.role.substring(0, 15) || "N/A"}
            </p>
            <p style={statSubtext}>
              {rolePerformance[0]?.average || 0}/10 avg
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* AI INSIGHTS BANNER */}
        {/* ========================================= */}
        {aiInsights.length > 0 && (
          <div style={insightsBanner}>
            <h3 style={insightsBannerTitle}>🤖 AI-Powered Insights</h3>
            <div style={insightsGrid}>
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  style={{
                    ...insightCard,
                    ...(insight.type === "success"
                      ? insightCardSuccess
                      : insight.type === "warning"
                      ? insightCardWarning
                      : insightCardInfo),
                  }}
                >
                  <span style={insightIcon}>{insight.icon}</span>
                  <p style={insightText}>{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* MAIN SCORE CHART */}
        {/* ========================================= */}
        <div style={chartCard}>
          <div style={chartHeader}>
            <h2 style={chartTitle}>📈 Performance Trajectory</h2>
            <div style={chartLegend}>
              <span style={legendItem}>
                <span style={{ ...legendDot, background: "#3b82f6" }}></span>
                Actual Score
              </span>
              {showPredictions && (
                <span style={legendItem}>
                  <span style={{ ...legendDot, background: "#10b981" }}></span>
                  Predicted
                </span>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            {chartType === "line" ? (
              <LineChart data={showPredictions ? predictionData : scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
                {showPredictions && (
                  <Line
                    type="monotone"
                    dataKey="predictedScore"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                )}
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis domain={[0, 10]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            ) : (
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis domain={[0, 10]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* ========================================= */}
        {/* TWO COLUMN LAYOUT */}
        {/* ========================================= */}
        <div style={twoColumnGrid}>
          {/* PIE CHART */}
          <div style={chartCard}>
            <h2 style={chartTitle}>🎯 Performance Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* RADAR CHART */}
          <div style={chartCard}>
            <h2 style={chartTitle}>🎯 Skills Analysis</h2>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="skill"
                  style={{ fontSize: "12px", fill: "#6b7280" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  style={{ fontSize: "10px" }}
                />
                <Radar
                  name="Skills"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========================================= */}
        {/* ROLE PERFORMANCE BAR CHART */}
        {/* ========================================= */}
        <div style={chartCard}>
          <h2 style={chartTitle}>📊 Role-wise Performance Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={rolePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="role"
                stroke="#6b7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="average" fill="#10b981" name="Average Score" />
              <Bar dataKey="maxScore" fill="#3b82f6" name="Max Score" />
              <Bar dataKey="minScore" fill="#ef4444" name="Min Score" />
              <Line
                type="monotone"
                dataKey="consistency"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Consistency"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ========================================= */}
        {/* TIME SERIES ANALYSIS */}
        {/* ========================================= */}
        {timeSeriesData.length > 0 && (
          <div style={chartCard}>
            <h2 style={chartTitle}>📅 Weekly Performance Trends</h2>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis domain={[0, 10]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                  name="Weekly Average"
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Weekly Max"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Weekly Min"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ========================================= */}
        {/* PERFORMANCE HIGHLIGHTS */}
        {/* ========================================= */}
        <div style={twoColumnGrid}>
          {bestPerformance && (
            <div style={{ ...activityCard, ...bestPerformanceCard }}>
              <h2 style={chartTitle}>🏆 Best Performance</h2>
              <div style={performanceDetails}>
                <p>
                  <strong>Role:</strong> {bestPerformance.role}
                </p>
                <p>
                  <strong>Score:</strong>{" "}
                  {extractScore(bestPerformance.feedback)}/10
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(bestPerformance.createdAt).toLocaleDateString()}
                </p>
                <div style={feedbackBox}>
                  <strong>Feedback:</strong>
                  <p style={feedbackText}>
                    {bestPerformance.feedback.substring(0, 200)}...
                  </p>
                </div>
              </div>
            </div>
          )}

          {worstPerformance && (
            <div style={{ ...activityCard, ...worstPerformanceCard }}>
              <h2 style={chartTitle}>📚 Area for Improvement</h2>
              <div style={performanceDetails}>
                <p>
                  <strong>Role:</strong> {worstPerformance.role}
                </p>
                <p>
                  <strong>Score:</strong>{" "}
                  {extractScore(worstPerformance.feedback)}/10
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(worstPerformance.createdAt).toLocaleDateString()}
                </p>
                <div style={feedbackBox}>
                  <strong>Learning Points:</strong>
                  <p style={feedbackText}>
                    {worstPerformance.feedback.substring(0, 200)}...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* DETAILED ROLE TABLE */}
        {/* ========================================= */}
        <div style={chartCard}>
          <h2 style={chartTitle}>📋 Detailed Role Statistics</h2>
          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={tableHeader}>Role</th>
                  <th style={tableHeader}>Interviews</th>
                  <th style={tableHeader}>Average</th>
                  <th style={tableHeader}>Max</th>
                  <th style={tableHeader}>Min</th>
                  <th style={tableHeader}>Consistency</th>
                  <th style={tableHeader}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rolePerformance.map((role, index) => (
                  <tr key={index} style={tableRow}>
                    <td style={tableCell}>
                      <strong>{role.role}</strong>
                    </td>
                    <td style={tableCell}>{role.count}</td>
                    <td style={tableCell}>
                      <span
                        style={{
                          ...scoreBadge,
                          background:
                            role.average >= 8
                              ? "#10b981"
                              : role.average >= 6
                              ? "#3b82f6"
                              : role.average >= 4
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        {role.average}/10
                      </span>
                    </td>
                    <td style={tableCell}>{role.maxScore}</td>
                    <td style={tableCell}>{role.minScore}</td>
                    <td style={tableCell}>{role.consistency}/10</td>
                    <td style={tableCell}>
                      {role.average >= 7 ? "✅ Strong" : "⚠️ Needs Work"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================= */}
        {/* FOOTER INFO */}
        {/* ========================================= */}
        <div style={footerInfo}>
          <p style={footerText}>
            📊 Analytics powered by advanced AI algorithms | Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
          <p style={footerText}>
            {filteredInterviews.length} interviews analyzed | Data range:{" "}
            {dateRange === "all" ? "All time" : `Last ${dateRange}`}
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================================
// STYLES
// =========================================

const mainContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "40px 20px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const mainCard = {
  maxWidth: "1400px",
  margin: "auto",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "20px",
};

const title = {
  fontSize: "42px",
  color: "#ffffff",
  margin: "0",
  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
};

const subtitle = {
  color: "#e0e7ff",
  fontSize: "16px",
  margin: "10px 0 0 0",
};

const headerActions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const actionButton = {
  background: "rgba(255,255,255,0.2)",
  border: "2px solid rgba(255,255,255,0.3)",
  color: "#ffffff",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
};

const controlPanel = {
  background: "rgba(255,255,255,0.95)",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "30px",
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  alignItems: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const filterGroup = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const filterLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const selectInput = {
  padding: "8px 15px",
  borderRadius: "8px",
  border: "2px solid #e5e7eb",
  fontSize: "14px",
  cursor: "pointer",
  background: "#ffffff",
  transition: "all 0.3s ease",
};

const checkboxInput = {
  width: "20px",
  height: "20px",
  cursor: "pointer",
};

const loadingBox = {
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center",
  marginBottom: "30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const spinner = {
  width: "50px",
  height: "50px",
  border: "5px solid #e5e7eb",
  borderTop: "5px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto 15px",
};

const errorBox = {
  background: "#fee2e2",
  border: "2px solid #ef4444",
  color: "#991b1b",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
};

const retryButton = {
  background: "#ef4444",
  color: "#ffffff",
  border: "none",
  padding: "8px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const statCard = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  position: "relative",
  overflow: "hidden",
};

const statCardPrimary = {
  borderTop: "4px solid #3b82f6",
};

const statCardSuccess = {
  borderTop: "4px solid #10b981",
};

const statCardWarning = {
  borderTop: "4px solid #f59e0b",
};

const statCardInfo = {
  borderTop: "4px solid #06b6d4",
};

const statCardPurple = {
  borderTop: "4px solid #8b5cf6",
};

const statCardOrange = {
  borderTop: "4px solid #f97316",
};

const statIcon = {
  fontSize: "36px",
  marginBottom: "10px",
};

const statLabel = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "10px 0",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "10px 0",
};

const statSubtext = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "5px 0 0 0",
};

const insightsBanner = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "35px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const insightsBannerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  marginBottom: "20px",
  textAlign: "center",
};

const insightsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "15px",
};

const insightCard = {
  background: "rgba(255,255,255,0.95)",
  padding: "20px",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const insightCardSuccess = {
  borderLeft: "5px solid #10b981",
};

const insightCardWarning = {
  borderLeft: "5px solid #f59e0b",
};

const insightCardInfo = {
  borderLeft: "5px solid #3b82f6",
};

const insightIcon = {
  fontSize: "28px",
  flexShrink: 0,
};

const insightText = {
  fontSize: "14px",
  color: "#374151",
  margin: 0,
  lineHeight: "1.6",
};

const chartCard = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "35px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const chartHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  flexWrap: "wrap",
  gap: "15px",
};

const chartTitle = {
  fontSize: "22px",
  color: "#1f2937",
  margin: "0 0 25px 0",
  fontWeight: "700",
};

const chartLegend = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
};

const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  color: "#6b7280",
};

const legendDot = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  display: "inline-block",
};

const twoColumnGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
  gap: "30px",
  marginBottom: "35px",
};

const activityCard = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const bestPerformanceCard = {
  borderLeft: "5px solid #10b981",
};

const worstPerformanceCard = {
  borderLeft: "5px solid #f59e0b",
};

const performanceDetails = {
  fontSize: "14px",
  lineHeight: "2",
  color: "#374151",
};

const feedbackBox = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "15px",
};

const feedbackText = {
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: "1.6",
  marginTop: "10px",
};

const tableContainer = {
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const tableHeaderRow = {
  background: "#f9fafb",
  borderBottom: "2px solid #e5e7eb",
};

const tableHeader = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "700",
  color: "#374151",
  textTransform: "uppercase",
  fontSize: "12px",
  letterSpacing: "0.5px",
};

const tableRow = {
  borderBottom: "1px solid #e5e7eb",
  transition: "background 0.2s ease",
};

const tableCell = {
  padding: "15px",
  color: "#6b7280",
};

const scoreBadge = {
  padding: "5px 12px",
  borderRadius: "20px",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "12px",
  display: "inline-block",
};

const tooltipStyle = {
  background: "rgba(0,0,0,0.9)",
  border: "none",
  borderRadius: "10px",
  padding: "15px",
  color: "#ffffff",
  fontSize: "13px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const footerInfo = {
  background: "rgba(255,255,255,0.95)",
  padding: "20px",
  borderRadius: "15px",
  textAlign: "center",
  marginTop: "30px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const footerText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "5px 0",
};

export default AnalyticsDashboard;