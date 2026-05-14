import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a1a",
          border: `1px solid ${isSuccess ? "#CBFF5E40" : "#ff5f5640"}`,
          borderRadius: "10px",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
          color: "#ffffffcc",
          zIndex: 999,
          animation: "slideUp 0.25s ease",
          boxShadow: "0 8px 32px #00000060",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{isSuccess ? "✓" : "✕"}</span>
        {message}
      </div>
    </>
  );
}
