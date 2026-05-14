import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/ui/Toast";

type View =
  | "login"
  | "register"
  | "verify"
  | "forgot"
  | "reset-verify"
  | "reset-password";

interface FormState {
  email: string;
  username: string;
  password: string;
  otp: string;
}

interface Errors {
  email?: string;
  username?: string;
  password?: string;
  otp?: string;
}

interface VerifyContext {
  userId: string;
  message: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("login");
  const [form, setForm] = useState<FormState>({
    email: "",
    username: "",
    password: "",
    otp: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [verifyContext, setVerifyContext] = useState<VerifyContext | null>(
    null,
  );
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const API = import.meta.env.VITE_API_URL; // swap to devbrief-auth later

  // ─── Field updater ───────────────────────────────────────────
  const update = (field: keyof FormState) => (val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ─── Username realtime check ──────────────────────────────────
  useEffect(() => {
    if (view !== "register") return;
    if (!form.username || form.username.length < 3) {
      setUsernameStatus((prev) => (prev !== "idle" ? "idle" : prev));
      return;
    }
    setUsernameStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/auth/username`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email, username: form.username }),
        });
        const data = await res.json();
        if (data?.isAvailable) {
          console.log("username available");
        } else {
          console.log("username unavailable");
        }
        setUsernameStatus(data.isAvailable ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.username, form.email, view]);

  // ─── Validation ───────────────────────────────────────────────
  const validateLogin = (): boolean => {
    const e: Errors = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = (): boolean => {
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

  const validateOTP = (): boolean => {
    const e: Errors = {};
    if (!form.otp) e.otp = "OTP is required";
    else if (form.otp.length !== 6) e.otp = "Must be exactly 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Handlers ─────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.accessToken === null) {
        // Unverified — cookie is set, go to verify
        setVerifyContext({
          userId: data.user.id,
          message: `Your account isn't verified yet. We sent a new code to ${form.email}`,
        });
        setView("verify");
        return;
      }

      // Verified — save token and go to app
      localStorage.setItem("token", data.accessToken);
      setToast({ message: "Welcome back!", type: "success" });
      setTimeout(() => navigate("/app"), 1000);
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Already verified → redirect to login
        if (res.status === 409 && data.message?.includes("logging in")) {
          setToast({
            message: "Email already registered — please sign in.",
            type: "error",
          });
          setTimeout(() => switchView("login"), 1500);
          return;
        }
        throw new Error(data.message || "Registration failed");
      }

      // Success — cookie is set, go to verify
      setVerifyContext({
        userId: data.user.id,
        message: `We sent a 6-digit code to ${form.email}`,
      });
      setView("verify");
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!validateOTP() || !verifyContext) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/confirm_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends confirmEmailToken cookie automatically
        body: JSON.stringify({ id: verifyContext.userId, otp: form.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      if (data.accessToken) {
        // Auto-login flow
        localStorage.setItem("token", data.accessToken);
        setToast({ message: "Email verified! Welcome.", type: "success" });
        setTimeout(() => navigate("/app"), 1000);
      } else {
        // Login flow — go back to login
        setToast({
          message: "Email verified! Please sign in.",
          type: "success",
        });
        setTimeout(() => switchView("login"), 1500);
      }
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!form.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/password/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, purpose: "Password reset" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setResetEmail(form.email);
      setToast({ message: `OTP sent to ${form.email}`, type: "success" });
      setView("reset-verify");
      setForm((prev) => ({ ...prev, otp: "" }));
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetVerify = async () => {
    if (!form.otp || form.otp.length !== 6) {
      setErrors({ otp: "Enter the 6-digit code" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: resetEmail, otp: form.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setToast({
        message: "OTP confirmed! Set your new password.",
        type: "success",
      });
      setView("reset-password");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!form.password) {
      setErrors({ password: "Password is required" });
      return;
    }
    if (form.password.length < 8) {
      setErrors({ password: "Minimum 8 characters" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: resetEmail, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed");
      setToast({
        message: "Password updated! Please sign in.",
        type: "success",
      });
      setTimeout(() => switchView("login"), 1500);
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (view === "login") handleLogin();
    else if (view === "register") handleRegister();
    else if (view === "verify") handleVerify();
    else if (view === "forgot") handleForgot();
    else if (view === "reset-verify") handleResetVerify();
    else if (view === "reset-password") handleResetPassword();
  };

  const switchView = (v: View) => {
    setView(v);
    setForm({ email: "", username: "", password: "", otp: "" });
    setErrors({});
    setUsernameStatus("idle");
    setVerifyContext(null);
  };

  // ─── Username hint ────────────────────────────────────────────
  const usernameHint = () => {
    if (!form.username || form.username.length < 3) return null;
    const map = {
      checking: { color: "#ffffff40", text: "Checking..." },
      available: { color: "#CBFF5E", text: "✓ Available" },
      taken: { color: "#ff5f56", text: "✕ Not available" },
      idle: null,
    };
    return map[usernameStatus];
  };
  const hint = usernameHint();

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#080808",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo */}
      <span
        onClick={() => navigate("/")}
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.3rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#ffffff",
          cursor: "pointer",
          marginBottom: "2.5rem",
        }}
      >
        dev<span style={{ color: "#CBFF5E" }}>brief</span>
      </span>

      {/* Card */}
      <div
        style={{
          background: "#111111",
          border: "1px solid #ffffff12",
          borderRadius: "16px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "2px",
            background: "#CBFF5E",
            borderRadius: "0 0 4px 4px",
          }}
        />

        {/* Login / Register toggle — hidden on verify */}
        {(view === "login" || view === "register") && (
          <div
            style={{
              display: "flex",
              background: "#ffffff08",
              borderRadius: "8px",
              padding: "4px",
              marginBottom: "2rem",
            }}
          >
            {(["login", "register"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => switchView(v)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "none",
                  background: view === v ? "#ffffff15" : "transparent",
                  color: view === v ? "#ffffff" : "#ffffff40",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: view === v ? 500 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Heading */}
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
          {view === "login" && "Welcome back"}
          {view === "register" && "Create account"}
          {view === "verify" && "Check your email"}
          {view === "forgot" && "Reset password"}
          {view === "reset-verify" && "Enter your code"}
          {view === "reset-password" && "New password"}
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
          {view === "login" && "Sign in to access your briefs"}
          {view === "register" && "Start scoping your idea for free"}
          {view === "verify" &&
            (verifyContext?.message || "Enter the 6-digit code we sent you")}
          {view === "forgot" &&
            "Enter your email and we'll send you a reset code"}
          {view === "reset-verify" &&
            `Enter the 6-digit code sent to ${resetEmail}`}
          {view === "reset-password" &&
            "Choose a strong password — minimum 8 characters"}
        </p>

        {/* ── Login form ── */}
        {view === "login" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
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
                    setView("forgot");
                    setForm((prev) => ({ ...prev, email: form.email })); // carry email over
                    setErrors({});
                  }}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    color: "#CBFF5E50",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#CBFF5E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#CBFF5E50")
                  }
                >
                  Forgot password?
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Register form ── */}
        {view === "register" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
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
        )}

        {/* ── OTP form ── */}
        {view === "verify" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Input
              label="6-digit code"
              type="text"
              value={form.otp}
              onChange={(val) => {
                if (/^\d{0,6}$/.test(val)) update("otp")(val);
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
        )}
        {/* ── Forgot form ── */}
        {view === "forgot" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              error={errors.email}
              disabled={loading}
            />
          </div>
        )}

        {/* ── Reset verify form ── */}
        {view === "reset-verify" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Input
              label="6-digit code"
              type="text"
              value={form.otp}
              onChange={(val) => {
                if (/^\d{0,6}$/.test(val)) update("otp")(val);
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
        )}

        {/* ── Reset password form ── */}
        {view === "reset-password" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Input
              label="New password"
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="min. 8 characters"
              error={errors.password}
              disabled={loading}
            />
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: "1.75rem" }}>
          <Button
            size="lg"
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={
              loading || (view === "register" && usernameStatus === "taken")
            }
            type="submit"
          >
            {loading
              ? "Please wait..."
              : view === "login"
                ? "Sign in →"
                : view === "register"
                  ? "Create account →"
                  : view === "verify"
                    ? "Verify email →"
                    : view === "forgot"
                      ? "Send reset code →"
                      : view === "reset-verify"
                        ? "Confirm code →"
                        : "Reset password →"}
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
          {view === "forgot" ||
          view === "reset-verify" ||
          view === "reset-password" ? (
            <>
              Back to{" "}
              <span
                onClick={() => switchView("login")}
                style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
              >
                Sign in
              </span>
            </>
          ) : view === "verify" ? (
            <>
              Wrong email?{" "}
              <span
                onClick={() => switchView("register")}
                style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
              >
                Go back
              </span>
            </>
          ) : view === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => switchView("register")}
                style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => switchView("login")}
                style={{ color: "#CBFF5E", cursor: "pointer", fontWeight: 500 }}
              >
                Sign in
              </span>
            </>
          )}
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
