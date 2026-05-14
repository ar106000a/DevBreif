import { useState } from "react";
import type { Brief } from "../../pages/App";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import api from "../../lib/api";

interface BriefInputProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
  onGenerated: (brief: Brief) => void;
}

const EXAMPLES = [
  "A project management tool for freelancers to track clients, invoices, and deadlines in one place.",
  "A SaaS app where restaurants can manage their menu, orders, and staff shifts from one dashboard.",
  "A habit tracking app where users set daily goals, log progress, and get weekly AI-powered insights.",
];

export default function BriefInput({
  loading,
  setLoading,
  onGenerated,
}: BriefInputProps) {
  const [idea, setIdea] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [charWarning, setCharWarning] = useState(false);

  const MAX = 500;

  const handleChange = (val: string) => {
    if (val.length > MAX) {
      setCharWarning(true);
      return;
    }
    setCharWarning(false);
    setIdea(val);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError("Please describe your idea first.");
      return;
    }
    if (idea.trim().split(" ").length < 5) {
      setError("Give a bit more detail — at least a sentence.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/app/brief/generate", { idea: idea.trim() });
      const parsed = res.data.brief;

      const brief: Brief = {
        id: crypto.randomUUID(), // temp ID, replaced after save
        title: parsed.title,
        idea: idea.trim(),
        features: parsed.features,
        stack: parsed.stack,
        timeline: parsed.timeline,
        questions: parsed.questions,
        is_public: parsed.is_public ?? false,
        created_at: new Date().toISOString(),
      };

      onGenerated(brief);
    } catch (err: any) {
      setError(err.message || "Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Heading */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 0.5rem",
            color: "#ffffff",
          }}
        >
          What are you building?
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            color: "#ffffff40",
            fontWeight: 300,
            margin: 0,
          }}
        >
          Describe your idea in plain English. No technical knowledge needed.
        </p>
      </div>

      {/* Textarea */}
      <div style={{ position: "relative", marginBottom: "0.75rem" }}>
        <textarea
          value={idea}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="e.g. A project management tool for freelancers to track clients, invoices, and deadlines in one place..."
          rows={6}
          disabled={loading}
          style={{
            width: "100%",
            background: "#111111",
            border: `1px solid ${error ? "#ff5f5650" : charWarning ? "#EF9F2750" : "#ffffff15"}`,
            borderRadius: "12px",
            padding: "1.1rem 1.25rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            color: "#ffffff",
            resize: "vertical",
            outline: "none",
            lineHeight: 1.65,
            boxSizing: "border-box",
            transition: "border-color 0.2s ease",
            opacity: loading ? 0.6 : 1,
            minHeight: "140px",
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#CBFF5E40";
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#ffffff15";
          }}
        />

        {/* Char count */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "1rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: charWarning ? "#EF9F27" : "#ffffff20",
            transition: "color 0.2s",
          }}
        >
          {idea.length}/{MAX}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            color: "#ff5f56",
            marginBottom: "0.75rem",
            paddingLeft: "2px",
          }}
        >
          {error}
        </div>
      )}

      {/* Actions row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        <Button
          size="lg"
          variant="primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate brief →"}
        </Button>

        {loading && <Loader label="AI is thinking..." />}
      </div>

      {/* Examples */}
      <div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#ffffff25",
            letterSpacing: "0.05em",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          Try an example
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                setIdea(ex);
                setError(null);
              }}
              disabled={loading}
              style={{
                background: "transparent",
                border: "1px solid #ffffff0f",
                borderRadius: "8px",
                padding: "0.65rem 1rem",
                textAlign: "left",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                color: "#ffffff40",
                cursor: "pointer",
                transition: "all 0.15s ease",
                lineHeight: 1.5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#CBFF5E30";
                e.currentTarget.style.color = "#ffffff70";
                e.currentTarget.style.background = "#CBFF5E08";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ffffff0f";
                e.currentTarget.style.color = "#ffffff40";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ color: "#CBFF5E50", marginRight: "0.5rem" }}>
                →
              </span>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
