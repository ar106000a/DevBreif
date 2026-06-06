import { useNavigate } from "react-router-dom";
import type { Brief } from "../../pages/App";

type AppView = "input" | "result";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggle: () => void;
  activeBrief: Brief | null;
  view: AppView;
  onNewBrief: () => void;
}

export default function TopBar({
  onToggle,
  activeBrief,
  view,
  onNewBrief,
}: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.25rem",
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
        onClick={onToggle}
        style={{
          background: "transparent",
          border: "1px solid #ffffff15",
          borderRadius: "6px",
          padding: "0.4rem 0.6rem",
          cursor: "pointer",
          color: "#ffffff50",
          display: "flex",
          alignItems: "center",
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
        className="app-logo"
        onClick={() => navigate("/app")}
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

      <style>{`
        @media (max-width: 480px) { .app-logo { display: none; } }
        .btn-text-short { display: none; }
        @media (max-width: 480px) {
          .btn-text-full { display: none; }
          .btn-text-short { display: inline; }
        }
      `}</style>

      {/* Breadcrumb */}
      {activeBrief && view === "result" && (
        <>
          <span style={{ color: "#ffffff20", fontSize: "0.85rem" }}>/</span>
          <span
            style={{
              fontSize: "0.85rem",
              color: "#ffffff50",
              fontFamily: "'DM Mono', monospace",
              maxWidth: "clamp(100px, 30vw, 300px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activeBrief.title}
          </span>
        </>
      )}

      {/* New brief button */}
      {view === "result" && (
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={onNewBrief}
            style={{
              background: "#CBFF5E",
              color: "#080808",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "opacity 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span className="btn-text-full">+ New brief</span>
            <span className="btn-text-short">+</span>
          </button>
        </div>
      )}
    </div>
  );
}
