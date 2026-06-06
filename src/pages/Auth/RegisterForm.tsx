import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BaseAuthForm from "../../components/Auth/BaseAuthForm";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";
import api from "../../lib/api";
import axios from "axios";

interface FormState {
  email: string;
  username: string;
  password: string;
}

interface Errors {
  email?: string;
  username?: string;
  password?: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = (field: keyof FormState) => (val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "username") {
      setUsernameStatus(!val || val.length < 3 ? "idle" : "checking");
    }
  };

  useEffect(() => {
    if (!form.username || form.username.length < 3) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.post("/api/auth/username", {
          email: form.email,
          username: form.username,
        });
        setUsernameStatus(res.data.isAvailable ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.username, form.email]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.username) e.username = "Username is required";
    else if (usernameStatus === "taken")
      e.username = "Username is not available";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        email: form.email,
        username: form.username,
        password: form.password,
      });

      navigate("/auth/verify", {
        state: {
          userId: res.data.user.id,
          message: `We sent a 6-digit code to ${form.email}`,
        },
      });
    } catch (err: unknown) {
      // 409: already registered — show toast and redirect to login
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setToast({
          message: "Email already registered — please sign in.",
          type: "error",
        });
        setTimeout(() => navigate("/auth"), 1500);
        return;
      }
      throw new Error("Registration Failed", { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const usernameHint = () => {
    if (!form.username || form.username.length < 3) return null;
    const map = {
      checking: { color: "#ffffff40", text: "Checking..." },
      available: { color: "#CBFF5E", text: "✓ Available" },
      taken: { color: "#ff5f56", text: "✕ Not available" },
      idle: null,
    } as const;
    return map[usernameStatus];
  };
  const hint = usernameHint();

  return (
    <BaseAuthForm
      title="Create account"
      punchLine="Start scoping your idea for free"
      submitLabel="Create account →"
      submitDisable={loading || usernameStatus === "taken"}
      isLoading={loading}
      onSubmit={handleRegister}
      bottomLine={<BottomLine />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com"
          error={errors.email}
          disabled={loading}
        />
        <div>
          <Input
            label="Username"
            type="text"
            value={form.username}
            onChange={update("username")}
            placeholder="aliforge"
            error={errors.username}
            disabled={loading}
          />
          {hint && (
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                color: hint.color,
                marginTop: "0.35rem",
                paddingLeft: "2px",
                transition: "color 0.2s",
              }}
            >
              {hint.text}
            </div>
          )}
        </div>
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
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
      Already have an account?{" "}
      <span
        onClick={() => navigate("/auth")}
        style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
      >
        Sign in
      </span>
    </>
  );
};

export default RegisterForm;
