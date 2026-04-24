/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUser, getUserFavorites } from "@/services/accountServices/accountServices";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

interface IUserStore {
  user: any | null;
  userFavorites: any | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchUserFavorites: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      userFavorites: null,
      loading: false,
      error: null,

      fetchUser: async () => {
        set({ loading: true, error: null });

        try {
          const data = await getUser();
          set({ user: data, loading: false });
        } catch (err: any) {
          set({
            error: err?.response?.data?.message,
            loading: false,
          });
        }
      },

      fetchUserFavorites: async () => {
        set({ loading: true, error: null });

        try {
          const data = await getUserFavorites();
          set({ userFavorites: data, loading: false });
        } catch (err: any) {
          set({
            error: err?.response?.data?.message,
            loading: false,
          });
        }
      },

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user_data",

      partialize: (state) => ({
        user: state.user,
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
