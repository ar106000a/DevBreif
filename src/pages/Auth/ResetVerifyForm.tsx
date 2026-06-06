import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import BaseAuthForm from "../../components/Auth/BaseAuthForm";
import Input from "../../components/ui/Input";
import api from "../../lib/api";

interface LocationState {
  resetEmail: string;
}

interface Errors {
  otp?: string;
}

const ResetVerifyForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  if (!state?.resetEmail) {
    return <Navigate to="/auth/forgot" replace />;
  }

  const validate = (): boolean => {
    const e: Errors = {};
    if (!otp) e.otp = "OTP is required";
    else if (otp.length !== 6) e.otp = "Must be exactly 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleResetVerify = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/auth/password/verify", {
        email: state.resetEmail,
        otp,
      });

      navigate("/auth/reset-password", {
        state: { resetEmail: state.resetEmail },
      });
    } catch {
      throw new Error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseAuthForm
      title="Enter your code"
      punchLine={`Enter the 6-digit code sent to ${state.resetEmail}`}
      submitLabel="Confirm code →"
      submitDisable={loading}
      isLoading={loading}
      onSubmit={handleResetVerify}
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

export default ResetVerifyForm;
