/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getUser,
  getUserFavorites,
  getUserOrders,
  getUserTickets,
  updateProfile,
  changePassword,
  changeMobileReqOTP,
  changeMobileVerify,
  type IUpdateProfileParams,
} from "@/services/accountServices/accountServices";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

interface ILoadingState {
  user: boolean;
  favorites: boolean;
  orders: boolean;
  tickets: boolean;
  updateProfile: boolean;
  changePassword: boolean;
  changeMobile: boolean;
}

interface IUserStore {
  user: any | null;
  userFavorites: any | null;
  userOrders: any | null;
  userTickets: any | null;
  loading: ILoadingState;
  error: string | null;

  fetchUser: () => Promise<void>;
  fetchUserFavorites: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchUserTickets: () => Promise<void>;
  updateProfile: (data: IUpdateProfileParams) => Promise<void>;
  changePassword: (current: string, password: string, rePassword: string) => Promise<void>;
  changeMobileReqOTP: (mobile: string) => Promise<void>;
  changeMobileVerify: (mobile: string, code: string) => Promise<any>;
  clearUser: () => void;
}

const DEFAULT_LOADING: ILoadingState = {
  user: false,
  favorites: false,
  orders: false,
  tickets: false,
  updateProfile: false,
  changePassword: false,
  changeMobile: false,
};

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      userFavorites: null,
      userOrders: null,
      userTickets: null,
      loading: DEFAULT_LOADING,
      error: null,

      fetchUser: async () => {
        set((s) => ({ loading: { ...s.loading, user: true }, error: null }));
        try {
          const data = await getUser();
          set((s) => ({ user: data, loading: { ...s.loading, user: false } }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در دریافت اطلاعات کاربر",
            loading: { ...s.loading, user: false },
          }));
        }
      },

      fetchUserFavorites: async () => {
        set((s) => ({ loading: { ...s.loading, favorites: true }, error: null }));
        try {
          const data = await getUserFavorites();
          set((s) => ({ userFavorites: data, loading: { ...s.loading, favorites: false } }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در دریافت علاقه‌مندی‌ها",
            loading: { ...s.loading, favorites: false },
          }));
        }
      },

      fetchUserOrders: async () => {
        set((s) => ({ loading: { ...s.loading, orders: true }, error: null }));
        try {
          const data = await getUserOrders();
          set((s) => ({ userOrders: data, loading: { ...s.loading, orders: false } }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در دریافت سفارش‌ها",
            loading: { ...s.loading, orders: false },
          }));
        }
      },

      fetchUserTickets: async () => {
        set((s) => ({ loading: { ...s.loading, tickets: true }, error: null }));
        try {
          const data = await getUserTickets();
          set((s) => ({ userTickets: data, loading: { ...s.loading, tickets: false } }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در دریافت تیکت‌ها",
            loading: { ...s.loading, tickets: false },
          }));
        }
      },

      updateProfile: async (data: IUpdateProfileParams) => {
        set((s) => ({ loading: { ...s.loading, updateProfile: true }, error: null }));
        try {
          const updated = await updateProfile(data);
          // Merge updated fields into cached user instead of a full re-fetch
          set((s) => ({
            user: { ...s.user, ...updated },
            loading: { ...s.loading, updateProfile: false },
          }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در بروزرسانی پروفایل",
            loading: { ...s.loading, updateProfile: false },
          }));
          throw err; // re-throw so the form can catch and show field-level errors
        }
      },

      changePassword: async (current: string, password: string, rePassword: string) => {
        set((s) => ({ loading: { ...s.loading, changePassword: true }, error: null }));
        try {
          await changePassword(current, password, rePassword);
          set((s) => ({ loading: { ...s.loading, changePassword: false } }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در تغییر رمز عبور",
            loading: { ...s.loading, changePassword: false },
          }));
          throw err;
        }
      },

      changeMobileReqOTP: async (mobile: string) => {
        set((s) => ({ loading: { ...s.loading, changeMobile: true }, error: null }));
        try {
          await changeMobileReqOTP(mobile);
          set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در ارسال کد تأیید",
            loading: { ...s.loading, changeMobile: false },
          }));
          throw err;
        }
      },

      changeMobileVerify: async (mobile: string, code: string) => {
        set((s) => ({ loading: { ...s.loading, changeMobile: true }, error: null }));
        try {
          const res = await changeMobileVerify(mobile, code);
          // Re-fetch user so the new mobile is reflected everywhere
          await useUserStore.getState().fetchUser();
          set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
          return res;
        } catch (err: any) {
          set((s) => ({
            error: err?.response?.data?.message ?? "خطا در تأیید شماره موبایل",
            loading: { ...s.loading, changeMobile: false },
          }));
          throw err;
        }
      },

      clearUser: () =>
        set({
          user: null,
          userFavorites: null,
          userOrders: null,
          userTickets: null,
          error: null,
          loading: DEFAULT_LOADING,
        }),
    }),
    {
      name: "user_data",

      partialize: (state) => ({
        user: state.user,
        userFavorites: state.userFavorites,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        setTimeout(async () => {
          try {
            const auth = useAuthStore.getState();
            if (!state?.user && auth?.accessToken) {
              await useUserStore.getState().fetchUser();
            }
          } catch (e) {
            console.warn("Error auto-fetching user on rehydrate:", e);
          }
        }, 0);
      },
    }
  )
);