import { useState } from "react";
import Button from "../ui/Button";
import Toast from "../ui/Toast";

interface BaseFormProps {
  title: string;
  punchLine: string;
  submitLabel: string;
  isLoading: boolean;
  submitDisable: boolean;
  onSubmit: () => Promise<void>;
  bottomLine: React.ReactNode;
  children: React.ReactNode;
}

const BaseAuthForm = ({
  title,
  punchLine,
  submitLabel,
  submitDisable,
  onSubmit,
  bottomLine,
  children,
}: BaseFormProps) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        setToast({
          message: errorMessage,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#ffffff",
          margin: "0 0 0.4rem",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "0.88rem",
          color: "#ffffff40",
          margin: "0 0 1.75rem",
          fontWeight: 300,
          lineHeight: 1.55,
        }}
      >
        {punchLine}
      </p>
      {children}
      {/* Submit */}
      <div style={{ marginTop: "1.75rem" }}>
        <Button
          size="lg"
          variant="primary"
          fullWidth
          disabled={loading || submitDisable}
          type="submit"
        >
          {loading ? "Please wait..." : submitLabel}
        </Button>
      </div>

      {/* Bottom link */}
      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.82rem",
          color: "#ffffff30",
          fontFamily: "'DM Sans', sans-serif",
          margin: "1.5rem 0 0",
        }}
      >
        {bottomLine}
      </p>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
};

export default BaseAuthForm;
