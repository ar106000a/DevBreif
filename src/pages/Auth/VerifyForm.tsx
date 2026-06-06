import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import BaseAuthForm from "../../components/Auth/BaseAuthForm";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface LocationState {
  userId: string;
  message: string;
}

interface Errors {
  otp?: string;
}

const VerifyForm = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Guard: if someone lands here directly with no context, send them back
  if (!state?.userId) {
    return <Navigate to="/auth" replace />;
  }

  const validate = (): boolean => {
    const e: Errors = {};
    if (!otp) e.otp = "OTP is required";
    else if (otp.length !== 6) e.otp = "Must be exactly 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleVerify = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/auth/confirm_email", {
        id: state.userId,
        otp,
      });

      if (res.data.accessToken) {
        // Came from register — auto-login, go straight to app
        setToast({ message: "Email verified! Welcome.", type: "success" });
        setUser({ isLoggedIn: true });
        setTimeout(() => navigate("/"), 1000);
      } else {
        // Came from login (unverified account) — go back to sign in
        setToast({
          message: "Email verified! Please sign in.",
          type: "success",
        });
        setTimeout(() => navigate("/auth"), 1500);
      }
    } catch {
      throw new Error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseAuthForm
      title="Check your email"
      punchLine={state.message}
      submitLabel="Verify email →"
      submitDisable={loading}
      isLoading={loading}
      onSubmit={handleVerify}
      bottomLine={<BottomLine />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="6-digit code"
          type="text"
          value={otp}
          onChange={(val) => {
            if (/^\d{0,6}$/.test(val)) {
              setOtp(val);
              setErrors((prev) => ({ ...prev, otp: undefined }));
            }
          }}
          placeholder="000000"
          error={errors.otp}
          disabled={loading}
        />
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#ffffff25",
            textAlign: "center",
            letterSpacing: "0.03em",
          }}
        >
          Code expires in 10 minutes
        </div>
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
      Wrong email?{" "}
      <span
        onClick={() => navigate("/auth/register")}
        style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
      >
        Go back
      </span>
    </>
  );
};

export default VerifyForm;
