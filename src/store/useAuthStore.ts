/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  authLogin,
  authLogout,
  authRefreshToken,
  authRegister,
  type IAuthLoginParams,
  type IAuthRegisterParams,
} from "@/services/authServices/authServices";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  loading: boolean;

  register: (params: IAuthRegisterParams) => Promise<any>;
  login: (params: IAuthLoginParams) => Promise<any>;
  logout: () => Promise<void>;
  refresh: () => Promise<any>;
  setTokens: (access: string | null, refresh: string | null) => void;
  setUser: (user: any | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      loading: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      register: async (params) => {
        set({ loading: true });
        try {
          const res = await authRegister(params);
          toast.success("ثبت‌نام با موفقیت انجام شد");
          return res;
        } catch (err: any) {
          const msg = err?.response?.data?.message || "خطایی رخ داد!";
          toast.error(msg);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      login: async (params) => {
        set({ loading: true });
        try {
          const res = await authLogin(params);

          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          });

          toast.success("ورود موفقیت‌آمیز بود");
          return res;
        } catch (err: any) {
          const msg = err?.response?.data?.message || "ورود ناموفق!";
          toast.error(msg);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authLogout();
          set({ accessToken: null, refreshToken: null, user: null });
          toast.success("خروج انجام شد");
        } catch (err: any) {
          const msg = err?.response?.data?.message || "خطا در خروج!";
          toast.error(msg);
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        const token = get().refreshToken;
        if (!token) return null;

        try {
          const res = await authRefreshToken(token);
          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          });
          
          return res;
        } catch {
          toast.error("نشست منقضی شد، دوباره وارد شوید");
          get().logout();
          return null;
        }
      },
    }),
    {
      name: "auth_data",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
