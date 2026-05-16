import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://devbrief-backend.onrender.com/";

// ─── Axios instance ───────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends cookies automatically (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Note: Access tokens are moved to httpOnly cookies set by the server.
// The client should not read or write access tokens from JavaScript.

// ─── Refresh state ────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

// ─── Request interceptor ─────────────────────────────────────
// We rely on cookies for auth; do not attach Authorization header from JS.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
);

// ─── Response interceptor ────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Not a 401 or already retried — just reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If refresh already in progress — queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // First 401 — attempt refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }, // sends httpOnly refresh token cookie
      );

      // On successful refresh the server should set httpOnly cookies.
      // Resolve queued requests so they can retry; the cookie will be sent automatically.
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — redirect to auth. Server should clear cookies on its side.
      processQueue(refreshError);
      window.location.href = "/auth";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
