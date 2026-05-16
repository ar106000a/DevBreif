import type { Brief } from "../../pages/App";
import ExportMenu from "./ExportMenu";
import BlueprintDialog from "./BlueprintDialog";
import { useState } from "react";
import ShareToggle from "./ShareToggle";

// Add inside BriefResult props interface:
interface BriefResultProps {
  brief: Brief;
  onNewBrief: () => void;
  onToggleShare: (id: string) => void;
  onExplanationGenerated: (id: string, explanation: string) => void; // add
}

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: "1.75rem" }}>
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        color: "#ffffff30",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: "0.75rem",
      }}
    >
      {label}
    </div>
    {children}
  </div>
);

export default function BriefResult({
  brief,
  onNewBrief,
  onExplanationGenerated,
  onToggleShare,
}: BriefResultProps) {
  const [showBlueprint, setShowBlueprint] = useState(false);
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#CBFF5E60",
              letterSpacing: "0.05em",
              marginBottom: "0.4rem",
            }}
          >
            BRIEF GENERATED
          </div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            {brief.title}
          </h1>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              color: "#ffffff30",
              marginTop: "0.4rem",
            }}
          >
            {new Date(brief.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Share toggle */}
        <ShareToggle
          briefId={brief.id}
          isPublic={brief.is_public}
          onToggle={onToggleShare}
        />

        {/* Export */}
        <ExportMenu brief={brief} />
      </div>

      {/* Original idea */}
      <div
        style={{
          background: "#111111",
          border: "1px solid #ffffff0f",
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            color: "#ffffff25",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          YOUR IDEA
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.92rem",
            color: "#ffffff60",
            margin: 0,
            lineHeight: 1.65,
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          "{brief.idea}"
        </p>
      </div>

      {/* Timeline pill — prominent */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "#CBFF5E12",
          border: "1px solid #CBFF5E30",
          borderRadius: "100px",
          padding: "0.5rem 1.1rem",
          marginBottom: "2rem",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="#CBFF5E" strokeWidth="1.2" />
          <path
            d="M7 4.5V7l1.5 1.5"
            stroke="#CBFF5E"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.8rem",
            color: "#CBFF5E",
            letterSpacing: "0.02em",
          }}
        >
          {brief.timeline}
        </span>
      </div>

      {/*blueprint button*/}
      <button
        onClick={() => setShowBlueprint(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "transparent",
          border: "1px solid #CBFF5E30",
          borderRadius: "100px",
          padding: "0.5rem 1.1rem",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.78rem",
          color: "#CBFF5E80",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginLeft: "0.5rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#CBFF5E12";
          e.currentTarget.style.color = "#CBFF5E";
          e.currentTarget.style.borderColor = "#CBFF5E60";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#CBFF5E80";
          e.currentTarget.style.borderColor = "#CBFF5E30";
        }}
      >
        ✦ Get Blueprint
      </button>

      {/* Features */}
      <Section label="Core features">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {brief.features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                background: "#111111",
                border: "1px solid #ffffff0a",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                transition: "border-color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#ffffff18")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#ffffff0a")
              }
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  color: "#CBFF5E",
                  minWidth: "20px",
                  paddingTop: "1px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                  color: "#ffffff80",
                  lineHeight: 1.55,
                  fontWeight: 300,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Stack */}
      <Section label="Suggested stack">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {brief.stack.map((tech, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff08",
                border: "1px solid #ffffff12",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.82rem",
                color: "#ffffff70",
                transition: "all 0.15s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#CBFF5E30";
                e.currentTarget.style.color = "#CBFF5E";
                e.currentTarget.style.background = "#CBFF5E08";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ffffff12";
                e.currentTarget.style.color = "#ffffff70";
                e.currentTarget.style.background = "#ffffff08";
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </Section>

      {/* Questions */}
      <Section label="Questions to ask your developer">
        <div
          style={{
            background: "#111111",
            border: "1px solid #ffffff0a",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {brief.questions.map((question, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                borderBottom:
                  i < brief.questions.length - 1
                    ? "1px solid #ffffff08"
                    : "none",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ffffff04")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  color: "#CBFF5E50",
                  minWidth: "20px",
                  paddingTop: "2px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem",
                  color: "#ffffff60",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {question}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {showBlueprint && (
        <BlueprintDialog
          brief={brief}
          onClose={() => setShowBlueprint(false)}
          onExplanationGenerated={(explanation) => {
            onExplanationGenerated(brief.id, explanation);
          }}
        />
      )}
      {/* Bottom CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 0",
          borderTop: "1px solid #ffffff08",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            color: "#ffffff30",
            fontWeight: 300,
          }}
        >
          Ready to build? Share this brief with your developer.
        </div>
        <button
          onClick={onNewBrief}
          style={{
            background: "transparent",
            border: "1px solid #ffffff15",
            borderRadius: "8px",
            padding: "0.55rem 1.1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            color: "#ffffff50",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#CBFF5E40";
            e.currentTarget.style.color = "#CBFF5E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#ffffff15";
            e.currentTarget.style.color = "#ffffff50";
          }}
        >
          + New brief
        </button>
      </div>
    </div>
  );
}
