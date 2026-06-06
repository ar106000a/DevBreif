import { useState } from "react";
import type { Brief } from "../../pages/App";

interface BriefCardProps {
  brief: Brief;
  isActive: boolean;
  deleteConfirm: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function BriefCard({
  brief,
  isActive,
  deleteConfirm,
  onSelect,
  onDelete,
}: BriefCardProps) {
  const [threadOpen, setThreadOpen] = useState(false);

  const date = new Date(brief.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const hasThread = brief.chat_history && brief.chat_history.length > 0;

  return (
    <div style={{ marginBottom: "2px" }}>
      {/* Card row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.6rem 0.6rem",
          borderRadius: threadOpen ? "8px 8px 0 0" : "8px",
          background: isActive ? "#CBFF5E12" : "transparent",
          border: `1px solid ${isActive ? "#CBFF5E25" : "transparent"}`,
          borderBottom: threadOpen
            ? "1px solid #ffffff08"
            : isActive
              ? "1px solid #CBFF5E25"
              : "1px solid transparent",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onClick={onSelect}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = "#ffffff08";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "28px",
            height: "28px",
            minWidth: "28px",
            borderRadius: "6px",
            background: isActive ? "#CBFF5E20" : "#ffffff08",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
          }}
        >
          📋
        </div>

        {/* Text */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 500,
              color: isActive ? "#CBFF5E" : "#ffffff80",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {brief.title}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              color: "#ffffff25",
              marginTop: "1px",
            }}
          >
            {date}
          </div>
        </div>

        {/* Thread toggle */}
        {hasThread && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setThreadOpen((prev) => !prev);
            }}
            title={threadOpen ? "Hide conversation" : "Show conversation"}
            style={{
              background: threadOpen ? "#ffffff12" : "transparent",
              border: "1px solid transparent",
              borderRadius: "5px",
              padding: "3px 5px",
              cursor: "pointer",
              color: threadOpen ? "#ffffff60" : "#ffffff20",
              fontSize: "0.6rem",
              transition: "all 0.15s ease",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: threadOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff60";
              e.currentTarget.style.borderColor = "#ffffff15";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = threadOpen
                ? "#ffffff60"
                : "#ffffff20";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 4l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title={deleteConfirm ? "Click again to confirm" : "Delete brief"}
          style={{
            background: deleteConfirm ? "#ff5f5620" : "transparent",
            border: `1px solid ${deleteConfirm ? "#ff5f5640" : "transparent"}`,
            borderRadius: "5px",
            padding: "3px 5px",
            cursor: "pointer",
            color: deleteConfirm ? "#ff5f56" : "#ffffff20",
            fontSize: "0.7rem",
            fontFamily: "'DM Mono', monospace",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!deleteConfirm) {
              e.currentTarget.style.color = "#ff5f56";
              e.currentTarget.style.borderColor = "#ff5f5630";
            }
          }}
          onMouseLeave={(e) => {
            if (!deleteConfirm) {
              e.currentTarget.style.color = "#ffffff20";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}
        >
          {deleteConfirm ? "confirm?" : "✕"}
        </button>
      </div>

      {/* Chat thread */}
      {hasThread && threadOpen && (
        <div
          style={{
            background: "#0a0a0a",
            border: `1px solid ${isActive ? "#CBFF5E25" : "#ffffff08"}`,
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            padding: "0.6rem 0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#ffffff10 transparent",
          }}
        >
          {brief.chat_history!.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.4rem",
                alignItems: "flex-start",
              }}
            >
              {/* Role indicator */}
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.58rem",
                  color: msg.role === "ai" ? "#CBFF5E40" : "#ffffff20",
                  paddingTop: "2px",
                  minWidth: "18px",
                  flexShrink: 0,
                }}
              >
                {msg.role === "ai" ? "AI" : "You"}
              </div>

              {/* Message */}
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  color: msg.role === "ai" ? "#ffffff40" : "#ffffff25",
                  lineHeight: 1.5,
                  fontWeight: 300,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
