import type { StateCreator } from "zustand";
import { getUserFavorites } from "@/services/accountServices";
import type { IFavoritesSlice, IUserStore } from "../types";
import { toastIfNot404 } from "../helpers";

export const createFavoritesSlice: StateCreator<IUserStore, [], [], IFavoritesSlice> = (set) => ({
    userFavorites: null,

    fetchUserFavorites: async () => {
        set((s) => ({ loading: { ...s.loading, favorites: true } }));
        try {
            const res = await getUserFavorites();
            set((s) => ({ userFavorites: res.data, loading: { ...s.loading, favorites: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, favorites: false } }));
            toastIfNot404(err, "خطا در دریافت علاقه‌مندی‌ها");
        }
    },
});