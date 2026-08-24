import type { StateCreator } from "zustand";
import { getUserComments } from "@/services/accountServices";
import type { ICommentsSlice, IUserStore } from "../types";
import { toastIfNot404 } from "../helpers";

export const createCommentsSlice: StateCreator<IUserStore, [], [], ICommentsSlice> = (set) => ({
    userComments: null,

    fetchUserComments: async () => {
        set((s) => ({ loading: { ...s.loading, comments: true } }));
        try {
            const res = await getUserComments();
            set((s) => ({ userComments: res.data, loading: { ...s.loading, comments: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, comments: false } }));
            toastIfNot404(err, "خطا در دریافت نظرات");
        }
    },
});