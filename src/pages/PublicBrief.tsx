import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface PublicBriefData {
  id: string;
  title: string;
  idea: string;
  features: string[];
  stack: string[];
  timeline: string;
  questions: string[];
  created_at: string;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export default function PublicBrief() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brief, setBrief] = useState<PublicBriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateMeta = (property: string, content: string) => {
    let el =
      document.querySelector(`meta[property='${property}']`) ||
      document.querySelector(`meta[name='${property}']`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(
        property.startsWith("og:") || property.startsWith("twitter:")
          ? "property"
          : "name",
        property,
      );
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  useEffect(() => {
    // Meta tags
    document.title = "Loading brief... | DevBrief";

    const fetchBrief = async () => {
      try {
        const res = await axios.get(`${API}/api/brief/public/${id}`);
        const data = res.data.brief;

        setBrief({
          ...data,
          features: Array.isArray(data.features)
            ? data.features
            : JSON.parse(data.features),
          stack: Array.isArray(data.stack)
            ? data.stack
            : JSON.parse(data.stack),
          questions: Array.isArray(data.questions)
            ? data.questions
            : JSON.parse(data.questions),
        });

        // Update meta tags dynamically
        document.title = `${data.title} | DevBrief`;
        updateMeta("og:title", `${data.title} | DevBrief`);
        updateMeta(
          "og:description",
          `App scoping brief: ${data.idea.slice(0, 120)}...`,
        );
        updateMeta("og:url", window.location.href);
        updateMeta("twitter:card", "summary");
        updateMeta("twitter:title", `${data.title} | DevBrief`);
        updateMeta(
          "twitter:description",
          `App scoping brief: ${data.idea.slice(0, 120)}...`,
        );
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? "This brief doesn't exist or has been made private."
            : "Failed to load brief — please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrief();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading)
    return (
      <div
        style={{
          background: "#080808",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.85rem",
          color: "#ffffff30",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #ffffff15",
              borderTop: "2px solid #CBFF5E",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading brief...
        </div>
      </div>
    );

  // ── Error ────────────────────────────────────────────────────
  if (error)
    return (
      <div
        style={{
          background: "#080808",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <div
          style={{
            fontSize: "1rem",
            color: "#ffffff60",
            marginBottom: "1.5rem",
            maxWidth: "360px",
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#CBFF5E",
            color: "#080808",
            border: "none",
            padding: "0.65rem 1.5rem",
            borderRadius: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Go to DevBrief →
        </button>
      </div>
    );

  if (!brief) return null;

  // ── Brief ────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#080808",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "#ffffff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');
      `}</style>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid #ffffff0f",
          position: "sticky",
          top: 0,
          background: "#080808ee",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <span
          onClick={() => navigate("/")}
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

        <button
          onClick={() => navigate("/auth")}
          style={{
            background: "#CBFF5E",
            color: "#080808",
            border: "none",
            padding: "0.5rem 1.1rem",
            borderRadius: "6px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Try DevBrief →
        </button>
      </nav>

      {/* Content */}
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "3rem 2rem 6rem",
        }}
      >
        {/* Shared badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "#ffffff08",
            border: "1px solid #ffffff12",
            borderRadius: "100px",
            padding: "0.3rem 0.85rem",
            marginBottom: "1.5rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            color: "#ffffff40",
            letterSpacing: "0.04em",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#CBFF5E",
            }}
          />
          SHARED BRIEF
        </div>

        {/* Title + date */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 0.4rem",
            color: "#ffffff",
            lineHeight: 1.15,
          }}
        >
          {brief.title}
        </h1>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            color: "#ffffff30",
            marginBottom: "2rem",
          }}
        >
          {new Date(brief.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        {/* Idea */}
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
            THE IDEA
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

        {/* Timeline pill */}
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

        {/* Features */}
        <Section label="Core features">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
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
                }}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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
                }}
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

        {/* CTA footer */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            background: "#111111",
            border: "1px solid #ffffff0f",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "0.25rem",
              }}
            >
              Have an app idea?
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "#ffffff40",
                fontWeight: 300,
              }}
            >
              Get your own brief in under 3 minutes — free.
            </div>
          </div>
          <button
            onClick={() => navigate("/auth")}
            style={{
              background: "#CBFF5E",
              color: "#080808",
              border: "none",
              padding: "0.65rem 1.4rem",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Try DevBrief →
          </button>
        </div>
      </div>
    </div>
  );
}
