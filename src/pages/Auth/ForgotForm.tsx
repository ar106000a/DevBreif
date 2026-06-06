import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseAuthForm from "../../components/Auth/BaseAuthForm";
import Input from "../../components/ui/Input";
import api from "../../lib/api";

interface Errors {
  email?: string;
}

const ForgotForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const e: Errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Enter a valid email";
      console.log("Email not valid");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleForgot = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/auth/password/otp", {
        email,
        purpose: "Password reset",
      });

      navigate("/auth/reset-verify", {
        state: { resetEmail: email },
      });
    } catch {
      throw new Error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseAuthForm
      title="Reset password"
      punchLine="Enter your email and we'll send you a reset code"
      submitLabel="Send reset code →"
      submitDisable={loading}
      isLoading={loading}
      onSubmit={handleForgot}
      bottomLine={<BottomLine />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="you@example.com"
          error={errors.email}
          disabled={loading}
        />
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#ffffff25",
            paddingLeft: "2px",
          }}
        >
          Enter the email linked to your account
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

export default ForgotForm;
