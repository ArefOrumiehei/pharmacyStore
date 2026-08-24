import type { StateCreator } from "zustand";
import { getUserOverview } from "@/services/accountServices";
import type { IOverviewSlice, IUserStore } from "../types";
import { toastIfNot404 } from "../helpers";

export const createOverviewSlice: StateCreator<IUserStore, [], [], IOverviewSlice> = (set) => ({
    overview: null,

    fetchOverview: async () => {
        set((s) => ({ loading: { ...s.loading, overview: true } }));
        try {
            const res = await getUserOverview();
            set((s) => ({ overview: res.data, loading: { ...s.loading, overview: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, overview: false } }));
            toastIfNot404(err, "خطا در دریافت اطلاعات کلی");
        }
    },
});