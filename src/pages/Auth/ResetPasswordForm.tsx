import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import BaseAuthForm from "../../components/Auth/BaseAuthForm";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";
import api from "../../lib/api";

interface LocationState {
  resetEmail: string;
}

interface Errors {
  password?: string;
}

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  if (!state?.resetEmail) {
    return <Navigate to="/auth/forgot" replace />;
  }

  const validate = (): boolean => {
    const e: Errors = {};
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/auth/password/reset", {
        email: state.resetEmail,
        password,
      });

      setToast({
        message: "Password updated! Please sign in.",
        type: "success",
      });
      setTimeout(() => navigate("/auth"), 1500);
    } catch {
      throw new Error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseAuthForm
      title="New password"
      punchLine="Choose a strong password — minimum 8 characters"
      submitLabel="Reset password →"
      submitDisable={loading}
      isLoading={loading}
      onSubmit={handleResetPassword}
      bottomLine={<BottomLine />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="min. 8 characters"
          error={errors.password}
          disabled={loading}
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </BaseAuthForm>
  );
};

const BottomLine = () => {
  const navigate = useNavigate();
  return (
    <>
      Back to{" "}
      <span
        onClick={() => navigate("/auth")}
        style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
      >
        Sign in
      </span>
    </>
  );
};

export default ResetPasswordForm;
