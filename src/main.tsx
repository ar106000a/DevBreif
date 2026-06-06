import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import AppPage from "./pages/App";
import PublicBrief from "./pages/PublicBrief";
import Settings from "./pages/Settings";
import { PrivateRoute, PublicRoute } from "./components/Guards";
import { RootDispatcher } from "./pages/RootDispatcher";
import AuthLayout from "./pages/Auth/AuthLayout";
import LoginForm from "./pages/Auth/LoginForm";
import { AuthProvider } from "./context/AuthContext";
import RegisterForm from "./pages/Auth/RegisterForm";
import VerifyForm from "./pages/Auth/VerifyForm";
import ForgotForm from "./pages/Auth/ForgotForm";
import ResetVerifyForm from "./pages/Auth/ResetVerifyForm";
import ResetPasswordForm from "./pages/Auth/ResetPasswordForm";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootDispatcher />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<AppPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<LoginForm />} />
            <Route path="/auth/register" element={<RegisterForm />} />
            <Route path="/auth/verify" element={<VerifyForm />} />
            <Route path="/auth/forgot" element={<ForgotForm />} />
            <Route path="/auth/reset-verify" element={<ResetVerifyForm />} />
            <Route
              path="/auth/reset-password"
              element={<ResetPasswordForm />}
            />
          </Route>
          <Route path="/brief/:id" element={<PublicBrief />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
