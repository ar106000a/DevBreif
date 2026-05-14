import Badge from "../ui/Badge";
import Card from "../ui/Card";

const steps = [
  {
    num: "01",
    title: "Describe your idea",
    body: "Write your app idea in plain English. No technical knowledge needed — just what you want to build and who it is for.",
    detail: "Takes about 2 minutes",
  },
  {
    num: "02",
    title: "AI breaks it down",
    body: "DevBrief maps out your features, suggests a stack, estimates a timeline, and flags what to ask your developer.",
    detail: "Response in seconds",
  },
  {
    num: "03",
    title: "Walk in prepared",
    body: "Share the brief with your developer or use it to evaluate proposals. No more vague conversations or wasted meetings.",
    detail: "Export or share instantly",
  },
];

export default function HowItWorks() {
  return (
    <section
      style={{
        maxWidth: "860px",
        margin: "0 auto 8rem",
        padding: "0 2rem",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <Badge variant="muted">HOW IT WORKS</Badge>
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0",
            color: "#ffffff",
          }}
        >
          Three steps to clarity
        </h2>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {steps.map((step, i) => (
          <Card
            key={step.num}
            style={{
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.2s ease",
            }}
          >
            {/* Subtle top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: i === 1 ? "#CBFF5E" : "#ffffff10",
                borderRadius: "16px 16px 0 0",
              }}
            />

            {/* Step number */}
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "3rem",
                fontWeight: 800,
                color: "#ffffff18",
                lineHeight: 1,
                marginBottom: "1.25rem",
                userSelect: "none",
              }}
            >
              {step.num}
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "0.6rem",
              }}
            >
              {step.title}
            </div>

            {/* Body */}
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                color: "#ffffff65",
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: "1.25rem",
              }}
            >
              {step.body}
            </div>

            {/* Detail tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: i === 1 ? "#CBFF5E" : "#ffffff45",
                letterSpacing: "0.04em",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: i === 1 ? "#CBFF5E" : "#ffffff40",
                }}
              />
              {step.detail}
            </div>
          </Card>
        ))}
      </div>

      {/* Step progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "2rem",
        }}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              height: "3px",
              width: i === 0 ? "24px" : "8px",
              borderRadius: "100px",
              background: i === 0 ? "#CBFF5E" : "#ffffff15",
              transition: "all 0.2s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
