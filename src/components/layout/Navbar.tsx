import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');
        .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }
        .nav-cta { transition: all 0.2s ease; }
      `}</style>

      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2.5rem",
          borderBottom: "1px solid #ffffff0f",
          position: "sticky",
          top: 0,
          background: "#080808ee",
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.3rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            cursor: "pointer",
          }}
        >
          dev<span style={{ color: "#CBFF5E" }}>brief</span>
        </span>

        {/* CTA */}
        <Button size="sm" variant="primary" onClick={() => navigate("/auth")}>
          Get started
        </Button>
      </nav>
    </>
  );
}
