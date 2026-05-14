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

// ─── Token helpers ────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem("token");
export const setToken = (token: string): void =>
  localStorage.setItem("token", token);
export const clearToken = (): void => localStorage.removeItem("token");

// ─── Refresh state ────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

// ─── Request interceptor ─────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
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
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
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

      const newToken = res.data.accessToken;

      if (!newToken) throw new Error("No token in refresh response");

      setToken(newToken);
      processQueue(null, newToken);

      // Retry original request with new token
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — logout
      processQueue(refreshError, null);
      clearToken();
      window.location.href = "/auth";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
