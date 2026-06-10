import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

function InterviewHistory() {

  // =====================================
  // STATES
  // =====================================

  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================
  // API URL
  // =====================================

  const API =
    "http://localhost:5000/api/history";

  // =====================================
  // FETCH HISTORY
  // =====================================

  const fetchHistory = async () => {

    try {

      setLoading(true);

      setError("");

      console.log(
        "📦 Fetching interview history..."
      );

      const response =
        await fetch(API);

      // =====================================
      // RESPONSE CHECK
      // =====================================

      if (!response.ok) {

        throw new Error(
          "Failed to fetch history"
        );
      }

      const data =
        await response.json();

      console.log(
        "📦 HISTORY RESPONSE:",
        data
      );

      // =====================================
      // SUCCESS
      // =====================================

      if (data.success) {

        // FILTER INVALID DATA
        const validInterviews =
          (data.interviews || [])
            .filter(
              (item) =>
                item &&
                item._id
            );

        console.log(
          "✅ VALID INTERVIEWS:",
          validInterviews
        );

        setInterviews(
          validInterviews
        );

      } else {

        setInterviews([]);

        setError(
          data.message ||
          "No history found"
        );
      }

    } catch (error) {

      console.log(
        "❌ FETCH ERROR:",
        error
      );

      setError(
        "Failed to fetch interview history"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    fetchHistory();

  }, []);

  // =====================================
  // REFRESH HISTORY
  // =====================================

  const refreshHistory =
    async () => {

      try {

        setRefreshing(true);

        await fetchHistory();

      } catch (error) {

        console.log(
          "❌ REFRESH ERROR:",
          error
        );

      } finally {

        setRefreshing(false);
      }
    };

  // =====================================
  // DELETE SINGLE INTERVIEW
  // =====================================

  const deleteInterview =
    async (id) => {

      try {

        console.log(
          "🗑 DELETE CLICKED:",
          id
        );

        // =====================================
        // VALIDATION
        // =====================================

        if (
          !id ||
          id === "undefined"
        ) {

          alert(
            "Invalid Interview ID"
          );

          return;
        }

        // =====================================
        // CONFIRM DELETE
        // =====================================

        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this interview?"
          );

        if (!confirmDelete) {

          return;
        }

        // =====================================
        // LOADING STATE
        // =====================================

        setDeletingId(id);

        // =====================================
        // DELETE REQUEST
        // =====================================

        const response =
          await fetch(
            `${API}/delete/${id}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        console.log(
          "🗑 DELETE RESPONSE:",
          data
        );

        // =====================================
        // SUCCESS
        // =====================================

        if (data.success) {

          alert(
            "✅ Interview deleted successfully"
          );

          // =====================================
          // REMOVE FROM UI INSTANTLY
          // =====================================

          const updatedInterviews =
            interviews.filter(
              (item) =>
                item._id !== id
            );

          setInterviews(
            updatedInterviews
          );

          // =====================================
          // REFRESH DATABASE DATA
          // =====================================

          await fetchHistory();

        } else {

          alert(
            data.message ||
            "Delete failed"
          );
        }

      } catch (error) {

        console.log(
          "❌ DELETE ERROR:",
          error
        );

        alert(
          "Failed to delete interview"
        );

      } finally {

        setDeletingId(null);
      }
    };

  // =====================================
  // DELETE ALL HISTORY
  // =====================================

  const deleteAllHistory =
    async () => {

      try {

        const confirmDelete =
          window.confirm(
            "⚠ Are you sure you want to delete ALL interview history?"
          );

        if (!confirmDelete) {

          return;
        }

        setLoading(true);

        const response =
          await fetch(
            `${API}/delete-all`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        console.log(
          "🗑 DELETE ALL RESPONSE:",
          data
        );

        if (data.success) {

          alert(
            "✅ All interview history deleted"
          );

          setInterviews([]);

        } else {

          alert(
            data.message
          );
        }

      } catch (error) {

        console.log(
          "❌ DELETE ALL ERROR:",
          error
        );

        alert(
          "Failed to delete all history"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredInterviews =
    useMemo(() => {

      return interviews.filter(
        (item) => {

          const role =
            item.role || "";

          const question =
            item.question || "";

          return (

            role
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            question
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    }, [interviews, search]);

  // =====================================
  // SCORE EXTRACTION
  // =====================================

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

  // =====================================
  // ANALYTICS
  // =====================================

  const totalInterviews =
    interviews.length;

  const scores =
    interviews.map((item) =>
      extractScore(
        item.feedback
      )
    );

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const averageScore =
    scores.length > 0
      ? (
          scores.reduce(
            (a, b) => a + b,
            0
          ) / scores.length
        ).toFixed(1)
      : 0;

  // =====================================
  // UI
  // =====================================

  return (

    <div style={mainContainer}>

      <div style={mainCard}>

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <h1 style={title}>
          📜 Interview History Dashboard
        </h1>

        <p style={subtitle}>
          Track your AI interview performance and progress
        </p>

        {/* ===================================== */}
        {/* STATS */}
        {/* ===================================== */}

        <div style={statsContainer}>

          <div style={statCard}>

            <h3>
              📁 Total Interviews
            </h3>

            <p style={statNumber}>
              {totalInterviews}
            </p>

          </div>

          <div style={statCard}>

            <h3>
              🏆 Best Score
            </h3>

            <p style={statNumber}>
              {bestScore}/10
            </p>

          </div>

          <div style={statCard}>

            <h3>
              📊 Average Score
            </h3>

            <p style={statNumber}>
              {averageScore}/10
            </p>

          </div>

        </div>

        {/* ===================================== */}
        {/* ACTION BUTTONS */}
        {/* ===================================== */}

        <div style={actionContainer}>

          <button
            onClick={refreshHistory}
            style={refreshButton}
          >

            {
              refreshing
              ? "🔄 Refreshing..."
              : "🔄 Refresh"
            }

          </button>

          <button
            onClick={deleteAllHistory}
            style={deleteAllButton}
          >
            🗑 Delete All History
          </button>

        </div>

        <br />

        {/* ===================================== */}
        {/* SEARCH */}
        {/* ===================================== */}

        <input
          type="text"
          placeholder="🔍 Search by role or question..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={searchInput}
        />

        <br />
        <br />

        {/* ===================================== */}
        {/* ERROR */}
        {/* ===================================== */}

        {error && (

          <div style={errorBox}>
            ❌ {error}
          </div>

        )}

        {/* ===================================== */}
        {/* LOADING */}
        {/* ===================================== */}

        {loading && (

          <div style={loadingBox}>
            ⏳ Loading interview history...
          </div>

        )}

        {/* ===================================== */}
        {/* EMPTY */}
        {/* ===================================== */}

        {!loading &&
          filteredInterviews.length === 0 && (

          <div style={emptyBox}>
            📭 No interview history found
          </div>

        )}

        {/* ===================================== */}
        {/* HISTORY CARDS */}
        {/* ===================================== */}

        {filteredInterviews.map(
          (item) => {

            console.log(
              "📦 INTERVIEW ITEM:",
              item
            );

            return (

              <div
                key={item._id}
                style={historyCard}
              >

                {/* ===================================== */}
                {/* TOP */}
                {/* ===================================== */}

                <div style={topSection}>

                  <div>

                    <h2 style={roleText}>
                      💼 {
                        item.role ||
                        "Unknown Role"
                      }
                    </h2>

                    <p style={dateText}>

                      🕒 {

                        item.createdAt

                        ? new Date(
                            item.createdAt
                          ).toLocaleString()

                        : "No Date"
                      }

                    </p>

                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >

                    {/* PDF DOWNLOAD */}

                    <button
                      onClick={() => {

                        window.open(
                          `http://localhost:5000/api/pdf/download/${item._id}`,
                          "_blank"
                        );

                      }}
                      style={downloadButton}
                    >
                      📄 Download Report
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() => {

                        deleteInterview(
                          item._id
                        );

                      }}
                      disabled={
                        deletingId === item._id
                      }
                      style={{
                        ...deleteButton,

                        opacity:
                          deletingId === item._id
                          ? 0.6
                          : 1,
                      }}
                    >

                      {
                        deletingId === item._id

                        ? "Deleting..."

                        : "🗑 Delete"
                      }

                    </button>

                  </div>

                </div>

                {/* ===================================== */}
                {/* QUESTION */}
                {/* ===================================== */}

                <div style={sectionBox}>

                  <h3 style={sectionTitle}>
                    📌 Interview Question
                  </h3>

                  <div style={contentBox}>
                    {item.question}
                  </div>

                </div>

                {/* ===================================== */}
                {/* ANSWER */}
                {/* ===================================== */}

                <div style={sectionBox}>

                  <h3 style={sectionTitle}>
                    ✍ Candidate Answer
                  </h3>

                  <div style={contentBox}>
                    {item.answer}
                  </div>

                </div>

                {/* ===================================== */}
                {/* FEEDBACK */}
                {/* ===================================== */}

                <div style={sectionBox}>

                  <h3 style={sectionTitle}>
                    🤖 AI Feedback
                  </h3>

                  <div
                    style={{
                      ...contentBox,
                      background:
                        "#dcfce7",
                      borderLeft:
                        "5px solid green",
                    }}
                  >
                    {item.feedback}
                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

// =====================================
// STYLES
// =====================================

const mainContainer = {

  minHeight: "100vh",

  background:
    "linear-gradient(to right, #dbeafe, #f8fafc)",

  padding: "40px",

  fontFamily: "Arial",
};

const mainCard = {

  maxWidth: "1200px",

  margin: "auto",
};

const title = {

  textAlign: "center",

  color: "#1e293b",

  fontSize: "38px",
};

const subtitle = {

  textAlign: "center",

  color: "#64748b",

  marginBottom: "35px",
};

const statsContainer = {

  display: "flex",

  gap: "20px",

  flexWrap: "wrap",

  marginBottom: "30px",
};

const statCard = {

  flex: 1,

  minWidth: "250px",

  background: "white",

  padding: "25px",

  borderRadius: "18px",

  textAlign: "center",

  boxShadow:
    "0 6px 16px rgba(0,0,0,0.08)",
};

const statNumber = {

  fontSize: "28px",

  fontWeight: "bold",

  color: "#2563eb",
};

const actionContainer = {

  display: "flex",

  gap: "15px",

  flexWrap: "wrap",
};

const refreshButton = {

  background: "#2563eb",

  color: "white",

  border: "none",

  padding: "12px 18px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "bold",
};

const deleteAllButton = {

  background: "#dc2626",

  color: "white",

  border: "none",

  padding: "12px 18px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "bold",
};

const searchInput = {

  width: "100%",

  padding: "15px",

  borderRadius: "12px",

  border:
    "1px solid #cbd5e1",

  fontSize: "16px",

  outline: "none",
};

const loadingBox = {

  background: "#fef9c3",

  padding: "18px",

  borderRadius: "12px",

  textAlign: "center",

  fontWeight: "bold",
};

const errorBox = {

  background: "#fee2e2",

  color: "#991b1b",

  padding: "18px",

  borderRadius: "12px",

  marginBottom: "20px",

  fontWeight: "bold",
};

const emptyBox = {

  background: "white",

  padding: "30px",

  borderRadius: "15px",

  textAlign: "center",

  fontWeight: "bold",
};

const historyCard = {

  background: "white",

  padding: "30px",

  borderRadius: "18px",

  marginBottom: "30px",

  boxShadow:
    "0 6px 18px rgba(0,0,0,0.08)",
};

const topSection = {

  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center",

  flexWrap: "wrap",

  marginBottom: "20px",
};

const roleText = {

  color: "#2563eb",

  marginBottom: "5px",
};

const dateText = {

  color: "#64748b",

  fontSize: "14px",
};

const deleteButton = {

  background: "#dc2626",

  color: "white",

  border: "none",

  padding: "10px 16px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "bold",
};

const downloadButton = {

  background: "#2563eb",

  color: "white",

  border: "none",

  padding: "10px 16px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "bold",

  transition: "0.3s",
};

const sectionBox = {

  marginTop: "25px",
};

const sectionTitle = {

  marginBottom: "12px",

  color: "#1e293b",
};

const contentBox = {

  background: "#f8fafc",

  padding: "20px",

  borderRadius: "12px",

  whiteSpace: "pre-wrap",

  lineHeight: "2",

  fontSize: "15px",

  color: "#334155",
};

export default InterviewHistory;