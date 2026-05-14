import { useState } from "react";
import type { Brief } from "../../pages/App";
import BriefCard from "./BriefCard";
import Loader from "../ui/Loader";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  briefs: Brief[];
  activeBriefId: string | null;
  loading: boolean;
  open: boolean;
  onToggle: () => void;
  onSelect: (brief: Brief) => void;
  onDelete: (id: string) => void;
  onNewBrief: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  briefs,
  activeBriefId,
  loading,
  open,
  onSelect,
  onDelete,
  onNewBrief,
  onLogout,
}: SidebarProps) {
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <>
      <style>{`
        .sidebar-wrap {
          width: 260px;
          min-width: 260px;
          transition: all 0.25s ease;
          overflow: hidden;
        }
        .sidebar-wrap.closed {
          width: 0;
          min-width: 0;
        }
        .sidebar-inner {
          width: 260px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0e0e0e;
          border-right: 1px solid #ffffff0f;
          overflow: hidden;
        }
        .brief-list {
          overflow-y: auto;
          flex: 1;
          padding: 0.5rem 0.75rem;
          scrollbar-width: thin;
          scrollbar-color: #ffffff15 transparent;
        }
        .brief-list::-webkit-scrollbar {
          width: 4px;
        }
        .brief-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .brief-list::-webkit-scrollbar-thumb {
          background: #ffffff15;
          border-radius: 4px;
        }
        .new-brief-btn:hover {
          background: #CBFF5E15 !important;
          border-color: #CBFF5E40 !important;
          color: #CBFF5E !important;
        }
        .logout-btn:hover {
          color: #ff5f56 !important;
          background: #ff5f5610 !important;
        }
      `}</style>

      <div className={`sidebar-wrap ${open ? "" : "closed"}`}>
        <div className="sidebar-inner">
          {/* Header */}
          <div
            style={{
              padding: "1.25rem 1rem 0.75rem",
              borderBottom: "1px solid #ffffff0f",
            }}
          >
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                paddingLeft: "0.25rem",
              }}
            >
              dev<span style={{ color: "#CBFF5E" }}>brief</span>
            </div>

            {/* New brief button */}
            <button
              className="new-brief-btn"
              onClick={onNewBrief}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.75rem",
                background: "transparent",
                border: "1px solid #ffffff15",
                borderRadius: "8px",
                color: "#ffffff60",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v12M1 7h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              New brief
            </button>
          </div>

          {/* Brief list */}
          <div className="brief-list">
            {/* Section label */}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                color: "#ffffff25",
                letterSpacing: "0.06em",
                padding: "0.85rem 0.25rem 0.5rem",
                textTransform: "uppercase",
              }}
            >
              Recent briefs
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{ padding: "1rem 0.25rem" }}>
                <Loader label="Loading briefs..." />
              </div>
            )}

            {/* Empty state */}
            {!loading && briefs.length === 0 && (
              <div
                style={{
                  padding: "2rem 0.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  💡
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.82rem",
                    color: "#ffffff30",
                    lineHeight: 1.6,
                  }}
                >
                  No briefs yet.
                  <br />
                  Generate your first one.
                </div>
              </div>
            )}

            {/* Brief cards */}
            {!loading &&
              briefs.map((brief) => (
                <BriefCard
                  key={brief.id}
                  brief={brief}
                  isActive={brief.id === activeBriefId}
                  deleteConfirm={deleteConfirm === brief.id}
                  onSelect={() => onSelect(brief)}
                  onDelete={() => handleDelete(brief.id)}
                />
              ))}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "0.75rem",
              borderTop: "1px solid #ffffff0f",
            }}
          >
            <button
              className="logout-btn"
              onClick={onLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.75rem",
                background: "transparent",
                border: "none",
                borderRadius: "8px",
                color: "#ffffff30",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9 10l3-3-3-3M13 7H5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
