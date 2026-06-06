import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "#080808",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'DM Sans', sans-serif",
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
          color: "#ffffff",
          cursor: "pointer",
          marginBottom: "2.5rem",
        }}
      >
        dev<span style={{ color: "#CBFF5E" }}>brief</span>
      </span>
      {/* Card */}
      <div
        style={{
          background: "#111111",
          border: "1px solid #ffffff12",
          borderRadius: "16px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "2px",
            background: "#CBFF5E",
            borderRadius: "0 0 4px 4px",
          }}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
