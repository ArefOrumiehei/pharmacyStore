import type { StateCreator } from "zustand";
import { getUserOrders, getUserOrder } from "@/services/accountServices";
import type { IOrdersSlice, IUserStore } from "../types";
import { toastIfNot404 } from "../helpers";

export const createOrdersSlice: StateCreator<IUserStore, [], [], IOrdersSlice> = (set) => ({
    userOrders: null,
    selectedOrder: null,

    fetchUserOrders: async () => {
        set((s) => ({ loading: { ...s.loading, orders: true } }));
        try {
            const res = await getUserOrders();
            set((s) => ({ userOrders: res.data, loading: { ...s.loading, orders: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, orders: false } }));
            toastIfNot404(err, "خطا در دریافت سفارش‌ها");
        }
    },

    fetchUserOrder: async (orderId) => {
        set((s) => ({ loading: { ...s.loading, order: true }, selectedOrder: null }));
        try {
            const res = await getUserOrder(orderId);
            set((s) => ({ selectedOrder: res.data, loading: { ...s.loading, order: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, order: false } }));
            toastIfNot404(err, "خطا در دریافت جزئیات سفارش");
        }
    },

    clearSelectedOrder: () => set({ selectedOrder: null }),
});