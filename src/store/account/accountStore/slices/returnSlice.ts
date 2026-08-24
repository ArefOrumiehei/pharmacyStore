import type { StateCreator } from "zustand";
import { toast } from "react-toastify";
import { requestReturn } from "@/services/accountServices";
import type { IReturnSlice, IUserStore } from "../types";
import { extractMessage } from "../helpers";

export const createReturnSlice: StateCreator<IUserStore, [], [], IReturnSlice> = (set) => ({
    requestReturn: async (data) => {
        set((s) => ({ loading: { ...s.loading, requestReturn: true } }));
        try {
            await requestReturn(data);
            set((s) => ({ loading: { ...s.loading, requestReturn: false } }));
            toast.success("درخواست مرجوعی با موفقیت ثبت شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, requestReturn: false } }));
            toast.error(extractMessage(err, "خطا در ثبت درخواست مرجوعی"));
            throw err;
        }
    },
});