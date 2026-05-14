type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}

const styles = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap" as const,
  },
  variants: {
    primary: {
      background: "#CBFF5E",
      color: "#080808",
    },
    secondary: {
      background: "transparent",
      color: "#ffffff80",
      border: "1px solid #ffffff20",
    },
    ghost: {
      background: "transparent",
      color: "#ffffff60",
      border: "none",
    },
  },
  sizes: {
    sm: { padding: "0.4rem 1rem", fontSize: "0.85rem" },
    md: { padding: "0.65rem 1.5rem", fontSize: "0.95rem" },
    lg: { padding: "0.9rem 2.2rem", fontSize: "1rem" },
  },
  disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={{
        ...styles.base,
        ...styles.variants[variant],
        ...styles.sizes[size],
        ...(disabled ? styles.disabled : {}),
        ...(fullWidth ? { width: "100%" } : {}),
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        el.style.opacity = "0.85";
        el.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}
