interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "accent" | "white" | "muted";
  label?: string;
  labelPosition?: "right" | "bottom";
  fullScreen?: boolean;
}

const sizes = {
  sm: 14,
  md: 20,
  lg: 28,
  xl: 40,
};

const colors = {
  accent: { track: "#CBFF5E20", spin: "#CBFF5E" },
  white: { track: "#ffffff15", spin: "#ffffff" },
  muted: { track: "#ffffff10", spin: "#ffffff30" },
};

const labelSizes = {
  sm: "0.72rem",
  md: "0.82rem",
  lg: "0.92rem",
  xl: "1rem",
};

const labelColors = {
  accent: "#CBFF5E80",
  white: "#ffffff60",
  muted: "#ffffff30",
};

export default function Spinner({
  size = "md",
  color = "accent",
  label,
  labelPosition = "right",
  fullScreen = false,
}: SpinnerProps) {
  const px = sizes[size];
  const { track, spin } = colors[color];
  const thickness = px <= 14 ? 1.5 : px <= 20 ? 2 : 2.5;

  const spinner = (
    <div
      style={{
        display: "flex",
        flexDirection: labelPosition === "bottom" ? "column" : "row",
        alignItems: "center",
        gap: labelPosition === "bottom" ? "0.75rem" : "0.6rem",
      }}
    >
      <style>{`
        @keyframes devbrief-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Ring */}
      <div
        style={{
          width: px,
          height: px,
          minWidth: px,
          borderRadius: "50%",
          border: `${thickness}px solid ${track}`,
          borderTop: `${thickness}px solid ${spin}`,
          animation: "devbrief-spin 0.75s linear infinite",
        }}
      />

      {/* Label */}
      {label && (
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: labelSizes[size],
            color: labelColors[color],
            letterSpacing: "0.03em",
            textAlign: labelPosition === "bottom" ? "center" : "left",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      {spinner}
    </div>
  );
}
