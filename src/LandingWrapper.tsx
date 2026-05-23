// LandingWrapper.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Landing from "./pages/Landing"; // Adjust this path if you put this file in a folder!

export default function LandingWrapper() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const BASE_URL =
    import.meta.env.NODE_ENV === "production" ? "" : import.meta.env.BASE_URL;
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, []);

  if (checking) return null;
  return loggedIn ? <Navigate to="/app" replace /> : <Landing />;
}
