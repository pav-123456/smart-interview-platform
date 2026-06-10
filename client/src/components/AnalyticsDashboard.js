import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

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
} from "recharts";

function AnalyticsDashboard() {

  // =========================================
  // STATES
  // =========================================

  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================================
  // API
  // =========================================

  const API =
    "http://localhost:5000/api/history";

  // =========================================
  // FETCH DATA
  // =========================================

  const fetchHistory = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(API);

      const data =
        await response.json();

      console.log(
        "📊 ANALYTICS DATA:",
        data
      );

      if (data.success) {

        setInterviews(
          data.interviews || []
        );
      }

    } catch (error) {

      console.log(
        "❌ ANALYTICS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // LOAD
  // =========================================

  useEffect(() => {

    fetchHistory();

  }, []);

  // =========================================
  // EXTRACT SCORE
  // =========================================

  const extractScore =
    (feedback) => {

      const match =
        feedback?.match(
          /(\d+)\/10/
        );

      return match
        ? Number(match[1])
        : 0;
    };

  // =========================================
  // SCORE DATA
  // =========================================

  const scoreData =
    interviews.map(
      (item, index) => ({

        name:
          `Interview ${index + 1}`,

        score:
          extractScore(
            item.feedback
          ),

        role:
          item.role,
      })
    );

  // =========================================
  // PIE CHART DATA
  // =========================================

  const pieData = [

    {
      name: "Excellent",
      value:
        interviews.filter(
          (item) =>
            extractScore(
              item.feedback
            ) >= 8
        ).length,
    },

    {
      name: "Average",
      value:
        interviews.filter(
          (item) => {

            const score =
              extractScore(
                item.feedback
              );

            return (
              score >= 5 &&
              score < 8
            );
          }
        ).length,
    },

    {
      name: "Poor",
      value:
        interviews.filter(
          (item) =>
            extractScore(
              item.feedback
            ) < 5
        ).length,
    },
  ];

  // =========================================
  // ROLE PERFORMANCE
  // =========================================

  const rolePerformance =
    useMemo(() => {

      const roleMap = {};

      interviews.forEach(
        (item) => {

          const role =
            item.role;

          const score =
            extractScore(
              item.feedback
            );

          if (!roleMap[role]) {

            roleMap[role] = {
              total: 0,
              count: 0,
            };
          }

          roleMap[role].total += score;

          roleMap[role].count += 1;
        }
      );

      return Object.keys(roleMap)
        .map((role) => ({

          role,

          average:
            (
              roleMap[role]
                .total /
              roleMap[role]
                .count
            ).toFixed(1),
        }));

    }, [interviews]);

  // =========================================
  // BEST ROLE
  // =========================================

  const bestRole =
    rolePerformance.length > 0

      ? rolePerformance.reduce(
          (prev, current) =>

            Number(
              prev.average
            ) >

            Number(
              current.average
            )

              ? prev
              : current
        )

      : null;

  // =========================================
  // RECENT INTERVIEW
  // =========================================

  const latestInterview =
    interviews[0];

  // =========================================
  // COLORS
  // =========================================

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
  ];

  // =========================================
  // UI
  // =========================================

  return (

    <div style={mainContainer}>

      <div style={mainCard}>

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <h1 style={title}>
          📊 Interview Analytics Dashboard
        </h1>

        <p style={subtitle}>
          AI-powered performance insights
        </p>

        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading && (

          <div style={loadingBox}>
            Loading analytics...
          </div>

        )}

        {/* ========================================= */}
        {/* STATS */}
        {/* ========================================= */}

        <div style={statsGrid}>

          <div style={statCard}>
            <h3>
              📁 Total Interviews
            </h3>

            <p style={statNumber}>
              {interviews.length}
            </p>
          </div>

          <div style={statCard}>
            <h3>
              🏆 Best Role
            </h3>

            <p style={statNumber}>
              {
                bestRole
                ? bestRole.role
                : "N/A"
              }
            </p>
          </div>

          <div style={statCard}>
            <h3>
              ⭐ Best Average
            </h3>

            <p style={statNumber}>
              {
                bestRole
                ? `${bestRole.average}/10`
                : "0"
              }
            </p>
          </div>

        </div>

        {/* ========================================= */}
        {/* SCORE LINE CHART */}
        {/* ========================================= */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            📈 Score Progress
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={scoreData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* ========================================= */}
        {/* PIE CHART */}
        {/* ========================================= */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            🥧 Interview Quality Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >

                {
                  pieData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* ========================================= */}
        {/* ROLE BAR CHART */}
        {/* ========================================= */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            📊 Role-wise Performance
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={rolePerformance}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="role"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="average"
                fill="#16a34a"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* ========================================= */}
        {/* RECENT ACTIVITY */}
        {/* ========================================= */}

        <div style={activityCard}>

          <h2 style={chartTitle}>
            🕒 Recent Activity
          </h2>

          {
            latestInterview ? (

              <div>

                <p>
                  💼 Role:
                  {" "}
                  <strong>
                    {
                      latestInterview.role
                    }
                  </strong>
                </p>

                <p>
                  ⭐ Score:
                  {" "}
                  <strong>
                    {
                      extractScore(
                        latestInterview.feedback
                      )
                    }/10
                  </strong>
                </p>

                <p>
                  📅 Date:
                  {" "}
                  <strong>
                    {
                      new Date(
                        latestInterview.createdAt
                      ).toLocaleString()
                    }
                  </strong>
                </p>

              </div>

            ) : (

              <p>
                No recent interviews
              </p>

            )
          }

        </div>

        {/* ========================================= */}
        {/* AI INSIGHTS */}
        {/* ========================================= */}

        <div style={insightCard}>

          <h2 style={chartTitle}>
            🤖 AI Insights
          </h2>

          <ul style={insightList}>

            <li>
              Your strongest role is
              {" "}
              <strong>
                {
                  bestRole
                  ? bestRole.role
                  : "N/A"
                }
              </strong>
            </li>

            <li>
              Continue improving communication skills
            </li>

            <li>
              Practice technical rounds daily
            </li>

            <li>
              Focus on explaining projects clearly
            </li>

          </ul>

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

  background:
    "linear-gradient(to right, #dbeafe, #f8fafc)",

  padding: "40px",

  fontFamily: "Arial",
};

const mainCard = {

  maxWidth: "1300px",

  margin: "auto",
};

const title = {

  textAlign: "center",

  fontSize: "40px",

  color: "#1e293b",
};

const subtitle = {

  textAlign: "center",

  color: "#64748b",

  marginBottom: "40px",
};

const loadingBox = {

  background: "#fef9c3",

  padding: "15px",

  borderRadius: "10px",

  textAlign: "center",

  fontWeight: "bold",
};

const statsGrid = {

  display: "flex",

  gap: "20px",

  flexWrap: "wrap",

  marginBottom: "35px",
};

const statCard = {

  flex: 1,

  minWidth: "250px",

  background: "white",

  padding: "25px",

  borderRadius: "18px",

  textAlign: "center",

  boxShadow:
    "0 6px 18px rgba(0,0,0,0.08)",
};

const statNumber = {

  fontSize: "28px",

  fontWeight: "bold",

  color: "#2563eb",
};

const chartCard = {

  background: "white",

  padding: "30px",

  borderRadius: "18px",

  marginBottom: "35px",

  boxShadow:
    "0 6px 18px rgba(0,0,0,0.08)",
};

const chartTitle = {

  marginBottom: "25px",

  color: "#1e293b",
};

const activityCard = {

  background: "#eff6ff",

  padding: "25px",

  borderRadius: "18px",

  marginBottom: "30px",
};

const insightCard = {

  background: "#dcfce7",

  padding: "25px",

  borderRadius: "18px",
};

const insightList = {

  lineHeight: "2",
};

export default AnalyticsDashboard;