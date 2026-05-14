export default function Loader({ label = "Thinking..." }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          width: "18px",
          height: "18px",
          border: "2px solid #ffffff15",
          borderTop: "2px solid #CBFF5E",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.85rem",
          color: "#ffffff50",
        }}
      >
        {label}
      </span>
    </div>
  );
}
