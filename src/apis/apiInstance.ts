import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE;

/* ────────── TYPES ─────────────────── */
export type ApiRequestConfig = InternalAxiosRequestConfig & {
  isFormDataRequest?: boolean;
  _retry?: boolean;
  _isRefreshRequest?: boolean;
};

interface QueueEntry {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

/* ───── TOKEN REFRESH QUEUE ──────────────── */
let isRefreshing = false;
let failedQueue: QueueEntry[] = [];
let hasLoggedOut = false;

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((entry) => {
    if (error) entry.reject(error);
    else entry.resolve(token!);
  });
  failedQueue = [];
};

/* ───────────── HELPERS ────────────── */
const redirectTo = (path: string) => {
  if (window.location.pathname !== path) {
    window.location.href = path;
  }
};

const handleLogout = () => {
  if (hasLoggedOut || window.location.pathname === "/login") return;
  hasLoggedOut = true;
  useAuthStore.getState().logout();
};

export const resetLogoutGuard = () => {
  hasLoggedOut = false;
};

const sessionExpiredAndLogout = (error: unknown) => {
  toast.error("نشست شما منقضی شده است، لطفاً دوباره وارد شوید");
  handleLogout();
  redirectTo("/login");
  return Promise.reject(error);
};

/* ────── INSTANCE ──────────────────── */
const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/* ───  REQUEST INTERCEPTOR ─────────── */
apiInstance.interceptors.request.use((config: ApiRequestConfig) => {
  const headers = AxiosHeaders.from(config.headers);

  try {
    const raw = localStorage.getItem("auth_data");
    if (raw) {
      const token = JSON.parse(raw)?.state?.accessToken as string | undefined;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
  } catch {
    // localStorage unavailable or malformed — proceed without token
  }

  headers.set(
    "Content-Type",
    config.isFormDataRequest ? "multipart/form-data" : "application/json"
  );

  config.headers = headers;
  return config;
});

/* ────── RESPONSE INTERCEPTOR ───────────────── */
apiInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as ApiRequestConfig;
    const status = error.response?.status ?? error.status;

    /* ── 500 Internal Server Error ── */
    if (status === 500) {
      redirectTo("/server-error");
      return new Promise(() => {});
    }

    /* ── 503 Service Unavailable ── */
    if (status === 503) {
      redirectTo("/maintenance");
      return new Promise(() => {});
    }

    /* ── 502 / 504 Gateway errors ── */
    if (status === 502 || status === 504) {
      redirectTo("/maintenance");
      return new Promise(() => {});
    }

    /* ── 401 Unauthorized ── */
    if (status === 401) {
      // The refresh endpoint itself failed with 401 — never re-enter this
      // logic for it. Reject and let the caller's catch (below) log out.
      if (originalRequest._isRefreshRequest) {
        return Promise.reject(error);
      }

      // Already retried once after a refresh and STILL 401 → token is
      // genuinely invalid. Don't loop — log out.
      if (originalRequest._retry) {
        return sessionExpiredAndLogout(error);
      }

      originalRequest._retry = true;

      const authStore = useAuthStore.getState();
      const refreshToken = authStore.refreshToken;

      if (!refreshToken) {
        return sessionExpiredAndLogout(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          const headers = AxiosHeaders.from(originalRequest.headers);
          headers.set("Authorization", `Bearer ${newToken}`);
          originalRequest.headers = headers;
          return apiInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await authStore.refresh();
        const newToken = res?.accessToken;

        processQueue(null, newToken);
        isRefreshing = false;

        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        originalRequest.headers = headers;
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return sessionExpiredAndLogout(refreshError);
      }
    }

    /* ── Network error while authenticated ── */
    if (error.code === "ERR_NETWORK" && originalRequest?.headers?.Authorization) {
      toast.warning("خطا در برقرای ارتباط");
    }

    /* ── All other errors (400, 403, 404, 409, 422, 429 etc.)
         Handled individually in each store via toast. ── */
    return Promise.reject(error);
  }
);

export default apiInstance;