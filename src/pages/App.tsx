import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/app/Sidebar";
import BriefInput from "../components/app/BriefInput";
import BriefResult from "../components/app/BriefResult";
import api from "../lib/api";

export interface Brief {
  id: string;
  title: string;
  idea: string;
  features: string[];
  stack: string[];
  timeline: string;
  questions: string[];
  is_public: boolean; // add this
  explanation?: string | null;
  created_at: string;
}

type AppView = "input" | "result";

export default function App() {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [activeBrief, setActiveBrief] = useState<Brief | null>(null);
  const [view, setView] = useState<AppView>("input");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingBriefs, setLoadingBriefs] = useState(true);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  });

  // Fetch saved briefs — wire to Supabase later
  useEffect(() => {
    const fetchBriefs = async () => {
      setLoadingBriefs(true);
      try {
        const res = await api.get("/app/brief/list");
        setBriefs(res.data.briefs);
      } catch {
        setBriefs([]);
      } finally {
        setLoadingBriefs(false);
      }
    };
    fetchBriefs();
  }, []);

  const saveBrief = async (brief: Brief) => {
    try {
      const res = await api.post("/app/brief/save", {
        title: brief.title,
        idea: brief.idea,
        features: brief.features,
        stack: brief.stack,
        timeline: brief.timeline,
        questions: brief.questions,
      });
      // Use the ID from DB, not the frontend-generated one
      const saved = { ...brief, id: res.data.brief.id };
      setBriefs((prev) => [saved, ...prev]);
      return saved;
    } catch (error: any) {
      // Still show locally if save fails
      console.log(
        "brief not saved in db",
        error.response?.data || error.message,
      );
      setBriefs((prev) => [brief, ...prev]);
      return brief;
    }
  };
  const handleExplanationGenerated = (id: string, explanation: string) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, explanation } : b)),
    );
    if (activeBrief?.id === id) {
      setActiveBrief((prev) => (prev ? { ...prev, explanation } : null));
    }
  };

  const deleteBrief = async (id: string) => {
    try {
      await api.delete(`/api/brief/${id}`);
      setBriefs((prev) => prev.filter((b) => b.id !== id));
      if (activeBrief?.id === id) {
        setActiveBrief(null);
        setView("input");
      }
    } catch {
      console.error("Failed to delete brief");
    }
  };

  const handleGenerated = async (brief: Brief) => {
    const saved = await saveBrief(brief);
    setActiveBrief(saved);
    setView("result");
  };

  const handleSelectBrief = (brief: Brief) => {
    setActiveBrief(brief);
    setView("result");
  };

  const handleNewBrief = () => {
    setActiveBrief(null);
    setView("input");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };
  // In App.tsx
  const toggleShare = async (id: string) => {
    try {
      const res = await api.patch(`/api/brief/${id}/toggle-share`);
      setBriefs((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, is_public: res.data.is_public } : b,
        ),
      );
      if (activeBrief?.id === id) {
        setActiveBrief((prev) =>
          prev ? { ...prev, is_public: res.data.is_public } : null,
        );
      }
    } catch {
      console.error("Failed to toggle share");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#080808",
        fontFamily: "'DM Sans', sans-serif",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        briefs={briefs}
        activeBriefId={activeBrief?.id ?? null}
        loading={loadingBriefs}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onSelect={handleSelectBrief}
        onDelete={deleteBrief}
        onNewBrief={handleNewBrief}
        onLogout={handleLogout}
      />

      {/* Main area */}
      <main
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.25s ease",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1.25rem 2rem",
            borderBottom: "1px solid #ffffff0f",
            position: "sticky",
            top: 0,
            background: "#080808ee",
            backdropFilter: "blur(12px)",
            zIndex: 10,
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            style={{
              background: "transparent",
              border: "1px solid #ffffff15",
              borderRadius: "6px",
              padding: "0.4rem 0.6rem",
              cursor: "pointer",
              color: "#ffffff50",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ffffff30";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ffffff15";
              e.currentTarget.style.color = "#ffffff50";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="4"
                width="12"
                height="1.5"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="2"
                y="7.25"
                width="12"
                height="1.5"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="2"
                y="10.5"
                width="12"
                height="1.5"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Logo */}
          <span
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) navigate("/");
              navigate("/app");
            }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              cursor: "pointer",
            }}
          >
            dev<span style={{ color: "#CBFF5E" }}>brief</span>
          </span>

          {/* Breadcrumb */}
          {activeBrief && view === "result" && (
            <>
              <span style={{ color: "#ffffff20", fontSize: "0.85rem" }}>/</span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#ffffff50",
                  fontFamily: "'DM Mono', monospace",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activeBrief.title}
              </span>
            </>
          )}

          {/* New brief button — right side */}
          {view === "result" && (
            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={handleNewBrief}
                style={{
                  background: "#CBFF5E",
                  color: "#080808",
                  border: "none",
                  padding: "0.5rem 1.1rem",
                  borderRadius: "6px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                + New brief
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "2.5rem 2rem",
            maxWidth: "780px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {view === "input" && (
            <BriefInput
              loading={loading}
              setLoading={setLoading}
              onGenerated={handleGenerated}
            />
          )}
          {view === "result" && activeBrief && (
            // Pass to BriefResult:
            <BriefResult
              brief={activeBrief}
              onNewBrief={handleNewBrief}
              onToggleShare={toggleShare}
              onExplanationGenerated={handleExplanationGenerated}
            />
          )}
        </div>
      </main>
    </div>
  );
}
