import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "4rem 2rem 4rem",
        textAlign: "center",
      }}
    >
      {/* Badge */}
      <div style={{ marginBottom: "1rem" }}>
        <Badge variant="accent">AI-POWERED SCOPING</Badge>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          margin: "0 0 1.5rem",
          color: "#ffffff",
        }}
      >
        Turn your idea into
        <br />
        <span style={{ color: "#CBFF5E" }}>a clear build plan.</span>
      </h1>

      {/* Subheadline */}
      <p
        style={{
          fontSize: "1.15rem",
          color: "#ffffff70",
          lineHeight: 1.7,
          maxWidth: "520px",
          margin: "0 auto 2.5rem",
          fontWeight: 300,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Paste your app idea in plain English. Get a structured feature
        breakdown, suggested stack, timeline, and the right questions to ask
        your developer — instantly.
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
        <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
          See example
        </Button>
      </div>

      {/* Social proof */}
      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { value: "3 mins", label: "avg. time to brief" },
          { value: "100%", label: "free to use" },
          { value: "instant", label: "AI response" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#CBFF5E",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem",
                color: "#ffffff65",
                marginTop: "2px",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
