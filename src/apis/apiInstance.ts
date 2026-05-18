import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/useAuthStore";

/* ────────── CONFIG ───────────────────── */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE;

/* ────────── TYPES ─────────────────── */
type ApiRequestConfig = InternalAxiosRequestConfig & {
  isFormDataRequest?: boolean;
  _retry?: boolean;
};

interface QueueEntry {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

/* ─────────────────────────────────────────
    TOKEN REFRESH QUEUE
───────────────────────────────────────── */
let isRefreshing = false;
let failedQueue: QueueEntry[] = [];
let hasLoggedOut = false;

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((entry) => {
    if (error) entry.reject(error);
    else       entry.resolve(token!);
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

/* ────── INSTANCE ──────────────────── */
const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
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
    const status          = error.response?.status;

    /* ── 500 Internal Server Error
          Global exception middleware caught an unhandled exception.
          Likely transient — show "try again in a moment" page. ── */
    if (status === 500) {
      redirectTo("/server-error");
      return new Promise(() => {});
    }

    /* ── 503 Service Unavailable
          Planned maintenance or server is intentionally down.
          Show full maintenance page. ── */
    if (status === 503) {
      redirectTo("/maintenance");
      return new Promise(() => {});
    }

    /* ── 502 / 504 Gateway errors
         Upstream / proxy issues — treat same as maintenance. ── */
    if (status === 502 || status === 504) {
      redirectTo("/maintenance");
      return new Promise(() => {});
    }

    /* ── 401 Unauthorized → refresh token, retry once ── */
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore    = useAuthStore.getState();
      const refreshToken = authStore.refreshToken;

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res      = await authStore.refresh();
        const newToken = res?.accessToken;

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    /* ── Network error while authenticated → logout ── */
    if (
      error.code === "ERR_NETWORK" &&
      originalRequest?.headers?.Authorization
    ) {
      handleLogout();
    }

    /* ── All other errors (400, 403, 404, 409, 422, 429 etc.)
         Handled individually in each store via toast. ── */
    return Promise.reject(error);
  }
);

export default apiInstance;