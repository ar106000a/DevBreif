interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #ffffff12",
        borderRadius: "16px",
        padding: "2rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
