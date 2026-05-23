import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingWrapper from "./LandingWrapper"; // Imported here
import AppPage from "./pages/App";
import Auth from "./pages/Auth";
import PublicBrief from "./pages/PublicBrief";
import Settings from "./pages/Settings";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/brief/:id" element={<PublicBrief />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
