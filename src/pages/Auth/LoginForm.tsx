import { useState } from "react";
import BaseAuthForm from "../../components/Auth/BaseAuthForm";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import api from "../../lib/api";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
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
  otp?: string;
}

const LoginForm = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const submitDisabled = loading ? true : false;
  const validateLogin = (): boolean => {
    const e: Errors = {};
    if (!form.email) e.email = "Email or username is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/auth/login`, {
        identifier: form.email,
        password: form.password,
      });

      if (res.data.accessToken === null) {
        // Unverified — go to verify

        navigate("/auth/verify", {
          state: {
            userId: res.data.user.id,
            message: `Your account isn't verified yet. We sent a new code to ${form.email}`,
          },
        });
        return;
      }
      if (res.data.error === "Invalid credentials") {
        throw new Error("Invalid credentials");
      }
      if (!res.data.accessToken) {
        // Unexpected response shape — don't navigate
        throw new Error("Login failed");
      }

      // Only navigate if we actually have a token
      setUser({ isLoggedIn: true });
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data.error === "Invalid credentials") {
          throw new Error("Invalid credentials", { cause: err });
        }
      }
      throw new Error("Login failed", { cause: err });
    } finally {
      setLoading(false);
    }
  };
  const update = (field: keyof FormState) => (val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  return (
    <BaseAuthForm
      title="Login"
      punchLine="Sign in to access your briefs"
      submitLabel="Sign in →"
      bottomLine={<BottomLine />}
      onSubmit={handleLogin}
      submitDisable={submitDisabled}
      isLoading={loading}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input
          label="Email or Username"
          type="text"
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com or your handle"
          error={errors.email}
          disabled={loading}
        />
        <div>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="min. 8 characters"
            error={errors.password}
            disabled={loading}
          />
          <div style={{ textAlign: "right", marginTop: "0.4rem" }}>
            <span
              onClick={() => {
                //navigate to forget pswrd
                setForm((prev) => ({ ...prev, email: form.email })); // carry email over
                setErrors({});
                navigate("/auth/forgot");
              }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                color: "#CBFF5E50",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#CBFF5E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#CBFF5E50")}
            >
              Forgot password?
            </span>
          </div>
        </div>
      </div>
      {/* Toast */}
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
      Don't have an account?{" "}
      <span
        onClick={() => navigate("/auth/register")}
        style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
      >
        Register
      </span>
    </>
  );
};

export default LoginForm;
