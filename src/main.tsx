import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import PublicBrief from "./pages/PublicBrief";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import AppPage from "./pages/App";
import Auth from "./pages/Auth";

function LandingWrapper() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/brief/:id" element={<PublicBrief />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
