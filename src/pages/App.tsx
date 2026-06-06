import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/app/Sidebar";
import TopBar from "../components/app/Topbar";
import BriefInput from "../components/app/BriefInput";
import BriefResult from "../components/app/BriefResult";
import { useBriefs } from "../hooks/useBriefs";
import api from "../lib/api";

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export interface Brief {
  id: string;
  title: string;
  idea: string;
  features: string[];
  stack: string[];
  timeline: string;
  questions: string[];
  cost: string;
  team: string;
  is_public: boolean;
  explanation?: string | null;
  created_at: string;
  description: string;
  risks: string[];
  chat_history?: ChatMessage[];
  project_type?: "product" | "personal" | "data" | "system";
}

type AppView = "input" | "result";

export default function App() {
  const navigate = useNavigate();
  const {
    briefs,
    loadingBriefs,
    saveBrief,
    deleteBrief,
    toggleShare,
    updateExplanation,
  } = useBriefs();

  const [activeBrief, setActiveBrief] = useState<Brief | null>(null);
  const [view, setView] = useState<AppView>("input");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.log("Logout request failed:", err);
    } finally {
      navigate("/auth");
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
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleNewBrief = () => {
    setActiveBrief(null);
    setView("input");
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleDelete = async (id: string) => {
    const deleted = await deleteBrief(id);
    if (deleted && activeBrief?.id === id) {
      setActiveBrief(null);
      setView("input");
    }
  };

  const handleToggleShare = async (id: string) => {
    const newState = await toggleShare(id);
    if (activeBrief?.id === id) {
      setActiveBrief((prev) =>
        prev ? { ...prev, is_public: newState } : null,
      );
    }
  };

  const handleExplanationGenerated = (id: string, explanation: string) => {
    updateExplanation(id, explanation);
    if (activeBrief?.id === id) {
      setActiveBrief((prev) => (prev ? { ...prev, explanation } : null));
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
      <Sidebar
        briefs={briefs}
        activeBriefId={activeBrief?.id ?? null}
        loading={loadingBriefs}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onSelect={handleSelectBrief}
        onDelete={handleDelete}
        onNewBrief={handleNewBrief}
        onLogout={handleLogout}
      />

      <main
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.25s ease",
          width: "100%",
        }}
      >
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          activeBrief={activeBrief}
          view={view}
          onNewBrief={handleNewBrief}
        />

        <div
          style={{
            flex: 1,
            padding: "max(1.5rem, 5vw) max(1rem, 5vw)",
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
            <BriefResult
              brief={activeBrief}
              onNewBrief={handleNewBrief}
              onToggleShare={handleToggleShare}
              onExplanationGenerated={handleExplanationGenerated}
            />
          )}
        </div>
      </main>
    </div>
  );
}
