import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing";
import AppPage from "./pages/App";
import Auth from "./pages/Auth";

const isLoggedIn = !!localStorage.getItem("token");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/app" replace /> : <Landing />}
        />
        <Route path="/app" element={<AppPage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
