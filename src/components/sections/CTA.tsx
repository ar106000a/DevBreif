import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        maxWidth: "860px",
        margin: "0 auto 6rem",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          background: "#111111",
          border: "1px solid #ffffff12",
          borderRadius: "20px",
          padding: "4rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "200px",
            background: "#CBFF5E",
            borderRadius: "50%",
            opacity: 0.04,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "120px",
            height: "2px",
            background: "#CBFF5E",
            borderRadius: "0 0 4px 4px",
          }}
        />

        {/* Label */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            color: "#CBFF5E80",
            letterSpacing: "0.06em",
            marginBottom: "1.25rem",
          }}
        >
          GET STARTED
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: "0 0 1rem",
            lineHeight: 1.1,
          }}
        >
          Your idea deserves
          <br />
          <span style={{ color: "#CBFF5E" }}>a real plan.</span>
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            color: "#ffffff50",
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: "400px",
            margin: "0 auto 2.5rem",
          }}
        >
          Free to use. No credit card. Get your brief in under 3 minutes.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button size="lg" variant="primary" onClick={() => navigate("/auth")}>
            Scope my idea →
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
          >
            See example
          </Button>
        </div>

        {/* Trust line */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            "No signup required to preview",
            "Built by a real developer",
            "Instant AI response",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "#ffffff30",
              }}
            >
              <span style={{ color: "#CBFF5E", fontSize: "0.7rem" }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
