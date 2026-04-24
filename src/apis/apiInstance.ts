/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let failedQueue: any[] = [];
let hasLoggedOut = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "multipart/form-data" },
});

type ApiRequestConfig = InternalAxiosRequestConfig & {
  isFormDataRequest?: boolean;
};

/* ---------------------- REQUEST INTERCEPTOR ---------------------- */
apiInstance.interceptors.request.use((config: ApiRequestConfig) => {
  const headers = AxiosHeaders.from(config.headers);

  try {
    const raw = localStorage.getItem("auth_data");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch (err: any) {
    console.warn("Error reading auth token from localStorage:", err);
  }

  if (config.isFormDataRequest === true) {
    headers.set("Content-Type", "multipart/form-data");
  } else {
    headers.set("Content-Type", "application/json");
  }

  config.headers = headers;
  return config;
});

/* ---------------------- RESPONSE INTERCEPTOR ---------------------- */
apiInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;
    console.log("object");
    console.log(error);
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(1);

      const authStore = useAuthStore.getState();

      const refreshToken = authStore.refreshToken;
      console.log(refreshToken);
      console.log(hasLoggedOut);
      if (!refreshToken) {
        console.log(2);
        if (!hasLoggedOut && window.location.pathname !== "/login") {
          console.log(3);
          hasLoggedOut = true;
          authStore.logout().then(() => {
            // window.location.href = "/login";
          });
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await authStore.refresh();
        const newAccess = res?.accessToken;

        processQueue(null, newAccess);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = "Bearer " + newAccess;
        return apiInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        if (!hasLoggedOut && window.location.pathname !== "/login") {
          hasLoggedOut = true;
          authStore.logout().then(() => {
            // window.location.href = "/login";
          });
        }
        return Promise.reject(err);
      }
    }

    if (
      error.code === "ERR_NETWORK" &&
      originalRequest?.headers?.Authorization &&
      window.location.pathname !== "/login"
    ) {
      const authStore = useAuthStore.getState();
      if (!hasLoggedOut) {
        hasLoggedOut = true;
        authStore.logout().then(() => {
          // window.location.href = "/login";
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
