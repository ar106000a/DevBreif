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
  const date = new Date(brief.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 0.6rem",
        borderRadius: "8px",
        marginBottom: "2px",
        background: isActive ? "#CBFF5E12" : "transparent",
        border: `1px solid ${isActive ? "#CBFF5E25" : "transparent"}`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        group: "card",
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
  );
}
