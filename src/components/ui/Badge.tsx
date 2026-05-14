interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "muted";
}

export default function Badge({ children, variant = "accent" }: BadgeProps) {
  const isAccent = variant === "accent";
  return (
    <div
      style={{
        display: "inline-block",
        background: isAccent ? "#CBFF5E15" : "#ffffff08",
        border: `1px solid ${isAccent ? "#CBFF5E40" : "#ffffff25"}`,
        borderRadius: "100px",
        padding: "0.35rem 1rem",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.75rem",
        color: isAccent ? "#CBFF5E" : "#ffffff60",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </div>
  );
}
