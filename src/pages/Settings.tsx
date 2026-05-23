import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import Loader from "../components/ui/Loader";

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

type Section = "profile" | "security" | "danger";

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Username state
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  // Avatar state
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Delete state
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await api.get("/app/user/me");
      setUser(res.data.user);
      setUsername(res.data.user.username);
      setAvatarPreview(res.data.user.avatar_url);
    } catch {
      navigate("/auth");
    } finally {
      setLoadingUser(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
    fetchUser();
  });

  // ── Avatar ───────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.patch("/app/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarPreview(res.data.avatar_url);
      setUser((prev) =>
        prev ? { ...prev, avatar_url: res.data.avatar_url } : null,
      );
      setToast({ message: "Avatar updated", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || "Failed to upload avatar",
        type: "error",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Username ─────────────────────────────────────────────────
  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }
    if (username === user?.username) {
      setUsernameError("This is already your username");
      return;
    }
    if (username.length < 3) {
      setUsernameError("Minimum 3 characters");
      return;
    }
    setUsernameLoading(true);
    setUsernameError("");
    try {
      const res = await api.patch("/app/user/username", { username });
      setUser((prev) =>
        prev ? { ...prev, username: res.data.user.username } : null,
      );
      setToast({ message: "Username updated", type: "success" });
    } catch (err: any) {
      setUsernameError(
        err.response?.data?.message || "Failed to update username",
      );
    } finally {
      setUsernameLoading(false);
    }
  };

  // ── Password ─────────────────────────────────────────────────
  const handlePasswordUpdate = async () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.current = "Current password is required";
    if (!newPassword) errors.new = "New password is required";
    else if (newPassword.length < 8) errors.new = "Minimum 8 characters";
    if (!confirmPassword) errors.confirm = "Please confirm your new password";
    else if (newPassword !== confirmPassword)
      errors.confirm = "Passwords do not match";
    if (currentPassword === newPassword)
      errors.new = "Must be different from current password";
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPasswordLoading(true);
    try {
      await api.patch("/app/user/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ message: "Password updated successfully", type: "success" });
    } catch (err: any) {
      setPasswordErrors({
        current: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await api.delete("/app/user/delete", {
        data: { password: deletePassword },
      });
      localStorage.removeItem("token");
      navigate("/auth");
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loadingUser)
    return (
      <div
        style={{
          background: "#080808",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader label="Loading settings..." />
      </div>
    );

  const navItems: { id: Section; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "danger", label: "Danger zone" },
  ];

  return (
    <div
      style={{
        background: "#080808",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "#ffffff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');
      `}</style>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid #ffffff0f",
          position: "sticky",
          top: 0,
          background: "#080808ee",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate("/app")}
          style={{
            background: "transparent",
            border: "1px solid #ffffff15",
            borderRadius: "6px",
            padding: "0.4rem 0.7rem",
            color: "#ffffff50",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "#ffffff30";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#ffffff50";
            e.currentTarget.style.borderColor = "#ffffff15";
          }}
        >
          ← Back
        </button>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            cursor: "pointer",
          }}
          onClick={() => navigate("/app")}
        >
          dev<span style={{ color: "#CBFF5E" }}>brief</span>
        </span>
      </nav>

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "3rem 2rem",
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* Sidebar nav */}
        <div style={{ position: "sticky", top: "5rem" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.68rem",
              color: "#ffffff25",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Settings
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.55rem 0.75rem",
                borderRadius: "7px",
                border: "none",
                background:
                  activeSection === item.id ? "#ffffff0f" : "transparent",
                color:
                  activeSection === item.id
                    ? item.id === "danger"
                      ? "#ff5f56"
                      : "#ffffff"
                    : item.id === "danger"
                      ? "#ff5f5660"
                      : "#ffffff40",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                marginBottom: "2px",
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = "#ffffff08";
                  e.currentTarget.style.color =
                    item.id === "danger" ? "#ff5f56" : "#ffffff70";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    item.id === "danger" ? "#ff5f5660" : "#ffffff40";
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* ── Profile ── */}
          {activeSection === "profile" && (
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  margin: "0 0 2rem",
                }}
              >
                Profile
              </h2>

              {/* Avatar */}
              <div
                style={{
                  background: "#111111",
                  border: "1px solid #ffffff0f",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#ffffff30",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  }}
                >
                  AVATAR
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                  }}
                >
                  {/* Avatar preview */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: avatarPreview ? "transparent" : "#CBFF5E20",
                      border: "2px solid #ffffff15",
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#CBFF5E50")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#ffffff15")
                    }
                  >
                    {avatarLoading ? (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #ffffff15",
                          borderTop: "2px solid #CBFF5E",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    ) : avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: "1.4rem",
                          fontWeight: 800,
                          color: "#CBFF5E",
                        }}
                      >
                        {user?.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarLoading}
                      style={{
                        background: "transparent",
                        border: "1px solid #ffffff20",
                        borderRadius: "7px",
                        padding: "0.5rem 1rem",
                        color: "#ffffff60",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        marginBottom: "0.4rem",
                        display: "block",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff40";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ffffff20";
                        e.currentTarget.style.color = "#ffffff60";
                      }}
                    >
                      {avatarLoading ? "Uploading..." : "Change avatar"}
                    </button>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        color: "#ffffff25",
                      }}
                    >
                      JPG, PNG — max 2MB
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Username */}
              <div
                style={{
                  background: "#111111",
                  border: "1px solid #ffffff0f",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#ffffff30",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  }}
                >
                  USERNAME
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Input
                      label=""
                      type="text"
                      value={username}
                      onChange={(val) => {
                        setUsername(val);
                        setUsernameError("");
                      }}
                      placeholder="yourhandle"
                      error={usernameError}
                      disabled={usernameLoading}
                    />
                  </div>
                  <div style={{ paddingTop: "2px" }}>
                    <Button
                      size="md"
                      variant="primary"
                      onClick={handleUsernameUpdate}
                      disabled={usernameLoading || username === user?.username}
                    >
                      {usernameLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>

                {/* Email — read only */}
                <div style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      color: "#ffffff25",
                      letterSpacing: "0.04em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    EMAIL — read only
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      color: "#ffffff40",
                      padding: "0.65rem 1rem",
                      background: "#ffffff05",
                      border: "1px solid #ffffff0a",
                      borderRadius: "8px",
                    }}
                  >
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {activeSection === "security" && (
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  margin: "0 0 2rem",
                }}
              >
                Security
              </h2>

              <div
                style={{
                  background: "#111111",
                  border: "1px solid #ffffff0f",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#ffffff30",
                    letterSpacing: "0.05em",
                    marginBottom: "1.25rem",
                  }}
                >
                  CHANGE PASSWORD
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Input
                    label="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(val) => {
                      setCurrentPassword(val);
                      setPasswordErrors({});
                    }}
                    placeholder="Your current password"
                    error={passwordErrors.current}
                    disabled={passwordLoading}
                  />
                  <Input
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(val) => {
                      setNewPassword(val);
                      setPasswordErrors({});
                    }}
                    placeholder="min. 8 characters"
                    error={passwordErrors.new}
                    disabled={passwordLoading}
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(val) => {
                      setConfirmPassword(val);
                      setPasswordErrors({});
                    }}
                    placeholder="Repeat new password"
                    error={passwordErrors.confirm}
                    disabled={passwordLoading}
                  />
                  <div>
                    <Button
                      size="md"
                      variant="primary"
                      onClick={handlePasswordUpdate}
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? "Updating..." : "Update password"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Danger ── */}
          {activeSection === "danger" && (
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  margin: "0 0 2rem",
                  color: "#ff5f56",
                }}
              >
                Danger zone
              </h2>

              <div
                style={{
                  background: "#ff5f5608",
                  border: "1px solid #ff5f5625",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#ff5f5660",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  DELETE ACCOUNT
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.88rem",
                    color: "#ffffff40",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    margin: "0 0 1.25rem",
                  }}
                >
                  This permanently deletes your account and all your briefs.
                  This cannot be undone.
                </p>

                {/* Step 1 — confirm intent */}
                {deleteStep === 1 && (
                  <button
                    onClick={() => setDeleteStep(2)}
                    style={{
                      background: "transparent",
                      border: "1px solid #ff5f5640",
                      borderRadius: "8px",
                      padding: "0.6rem 1.25rem",
                      color: "#ff5f56",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff5f5615";
                      e.currentTarget.style.borderColor = "#ff5f5660";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "#ff5f5640";
                    }}
                  >
                    Delete my account
                  </button>
                )}

                {/* Step 2 — password confirm */}
                {deleteStep === 2 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                        color: "#ff5f5680",
                        padding: "0.75rem 1rem",
                        background: "#ff5f5610",
                        borderRadius: "8px",
                        border: "1px solid #ff5f5620",
                      }}
                    >
                      ⚠️ Enter your password to confirm deletion. This is
                      irreversible.
                    </div>
                    <Input
                      label="Your password"
                      type="password"
                      value={deletePassword}
                      onChange={(val) => {
                        setDeletePassword(val);
                        setDeleteError("");
                      }}
                      placeholder="Confirm with your password"
                      error={deleteError}
                      disabled={deleteLoading}
                    />
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        style={{
                          background: "#ff5f56",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.65rem 1.25rem",
                          color: "#ffffff",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.88rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          opacity: deleteLoading ? 0.6 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {deleteLoading
                          ? "Deleting..."
                          : "Yes, delete my account"}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteStep(1);
                          setDeletePassword("");
                          setDeleteError("");
                        }}
                        style={{
                          background: "transparent",
                          border: "1px solid #ffffff15",
                          borderRadius: "8px",
                          padding: "0.65rem 1.25rem",
                          color: "#ffffff50",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
