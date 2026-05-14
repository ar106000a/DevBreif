import Card from "../ui/Card";

const features = [
  { label: "Core features", value: "6 identified" },
  { label: "Suggested stack", value: "React + Node" },
  { label: "Timeline estimate", value: "3–4 weeks" },
  { label: "Dev questions", value: "5 generated" },
];

export default function PreviewBox() {
  return (
    <section
      style={{
        maxWidth: "780px",
        margin: "0 auto 6rem",
        padding: "0 2rem",
      }}
    >
      <Card style={{ position: "relative", overflow: "hidden" }}>
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "220px",
            height: "220px",
            background: "#CBFF5E",
            borderRadius: "50%",
            opacity: 0.04,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Window dots */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "1.75rem" }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <div
              key={c}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>

        {/* Input block */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              color: "#ffffff50",
              marginBottom: "0.6rem",
              letterSpacing: "0.04em",
            }}
          >
            // your idea
          </div>
          <div
            style={{
              background: "#ffffff06",
              border: "1px solid #ffffff0f",
              borderRadius: "8px",
              padding: "1rem 1.2rem",
              fontSize: "0.95rem",
              color: "#ffffff80",
              lineHeight: 1.65,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            "I want to build a project management tool for freelancers — they
            need to track clients, invoices, and deadlines in one place."
          </div>
        </div>

        {/* Divider with label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#ffffff08" }} />
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#CBFF5E60",
              letterSpacing: "0.05em",
            }}
          >
            AI OUTPUT
          </div>
          <div style={{ flex: 1, height: "1px", background: "#ffffff08" }} />
        </div>

        {/* Output grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          {features.map((item) => (
            <div
              key={item.label}
              style={{
                background: "#ffffff05",
                border: "1px solid #ffffff0f",
                borderRadius: "10px",
                padding: "0.9rem 1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  color: "#ffffff55",
                  marginBottom: "0.4rem",
                  letterSpacing: "0.03em",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#CBFF5E",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Questions preview */}
        <div
          style={{
            background: "#ffffff04",
            border: "1px solid #ffffff08",
            borderRadius: "8px",
            padding: "1rem 1.2rem",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#ffffff50",
              marginBottom: "0.75rem",
              letterSpacing: "0.04em",
            }}
          >
            // questions to ask your developer
          </div>
          {[
            "Can you add user authentication from day one?",
            "Should invoices be auto-generated or manually created?",
            "Will clients have their own login portal?",
            "Which backend do you prefer for this project?",
            "Can you integrate real-time features?",
          ].map((q, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                padding: "0.4rem 0",
                borderBottom: i < 2 ? "1px solid #ffffff06" : "none",
              }}
            >
              <span
                style={{
                  color: "#CBFF5E",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  marginTop: "1px",
                  minWidth: "16px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem",
                  color: "#ffffff70",
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              >
                {q}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
