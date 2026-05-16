import { useEffect, useState } from "react";
import Toast from "../ui/Toast";

interface ShareToggleProps {
  briefId: string;
  isPublic: boolean;
  onToggle: (id: string) => void;
}

export default function ShareToggle({
  briefId,
  isPublic,
  onToggle,
}: ShareToggleProps) {
  const [copying, setCopying] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [localIsPublic, setLocalIsPublic] = useState(isPublic);

  useEffect(() => {
    setLocalIsPublic(isPublic);
  }, [isPublic]);

  const publicUrl = `${window.location.origin}/brief/${briefId}`;

  const handleToggle = async () => {
    const nextPublic = !localIsPublic;
    setLocalIsPublic(nextPublic);
    onToggle(briefId);

    if (nextPublic) {
      try {
        await navigator.clipboard.writeText(publicUrl);
        setToast({
          message: "Brief is now public — link copied!",
          type: "success",
        });
      } catch {
        setToast({ message: "Brief is now public", type: "success" });
      }
    } else {
      setToast({ message: "Brief is now private", type: "success" });
    }
  };

  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(publicUrl);
      setToast({ message: "Link copied to clipboard", type: "success" });
    } catch {
      setToast({ message: "Failed to copy link", type: "error" });
    } finally {
      setTimeout(() => setCopying(false), 1500);
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: localIsPublic ? "#CBFF5E12" : "transparent",
            border: `1px solid ${localIsPublic ? "#CBFF5E40" : "#ffffff15"}`,
            borderRadius: "8px",
            padding: "0.55rem 1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            color: localIsPublic ? "#CBFF5E" : "#ffffff50",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!localIsPublic) {
              e.currentTarget.style.borderColor = "#ffffff30";
              e.currentTarget.style.color = "#ffffff";
            }
          }}
          onMouseLeave={(e) => {
            if (!localIsPublic) {
              e.currentTarget.style.borderColor = "#ffffff15";
              e.currentTarget.style.color = "#ffffff50";
            }
          }}
        >
          {/* Toggle pill */}
          <div
            style={{
              width: "28px",
              height: "16px",
              borderRadius: "100px",
              background: localIsPublic ? "#CBFF5E" : "#ffffff20",
              position: "relative",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: localIsPublic ? "14px" : "2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: localIsPublic ? "#080808" : "#ffffff60",
                transition: "left 0.2s ease",
              }}
            />
          </div>
          {localIsPublic ? "Public" : "Private"}
        </button>

        {/* Copy link button — only when public */}
        {localIsPublic && (
          <button
            onClick={handleCopyLink}
            title="Copy share link"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid #ffffff15",
              borderRadius: "8px",
              padding: "0.55rem 0.65rem",
              color: copying ? "#CBFF5E" : "#ffffff40",
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderColor: copying ? "#CBFF5E40" : "#ffffff15",
            }}
            onMouseEnter={(e) => {
              if (!copying) {
                e.currentTarget.style.borderColor = "#ffffff30";
                e.currentTarget.style.color = "#ffffff";
              }
            }}
            onMouseLeave={(e) => {
              if (!copying) {
                e.currentTarget.style.borderColor = "#ffffff15";
                e.currentTarget.style.color = "#ffffff40";
              }
            }}
          >
            {copying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7l3.5 3.5L12 3"
                  stroke="#CBFF5E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5.5 8.5L8.5 5.5M8 2H12V6M12 2L7.5 6.5M6 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
