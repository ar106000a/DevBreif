export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #ffffff08",
        padding: "2rem 2.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
          }}
        >
          dev<span style={{ color: "#CBFF5E" }}>brief</span>
        </span>

        {/* Center — built by */}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            color: "#ffffff25",
            letterSpacing: "0.03em",
            textAlign: "center",
          }}
        >
          built by{" "}
          <span
            style={{
              color: "#CBFF5E80",
              cursor: "pointer",
            }}
            onClick={() => window.open("https://steadi.dev", "_blank")}
          >
            steadi
          </span>{" "}
          · Ali Raza
        </div>

        {/* Right — links */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          {[
            { label: "GitHub", url: "https://github.com/ar106000a" },
            {
              label: "Upwork",
              url: "https://www.upwork.com/freelancers/~019c8cb4d476a0b4d4?mp_source=share",
            },
          ].map((link) => (
            <span
              key={link.label}
              onClick={() => window.open(link.url, "_blank")}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "#ffffff30",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#CBFF5E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff30")}
            >
              {link.label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
