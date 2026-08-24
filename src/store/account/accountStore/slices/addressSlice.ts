import type { StateCreator } from "zustand";
import { toast } from "react-toastify";
import {
    getAllUserAddresses,
    getUserAddress,
    createUserAddress,
    editUserAddress,
    deleteUserAddress,
} from "@/services/accountServices";
import type { IAddressSlice, IUserStore } from "../types";
import { extractMessage, toastIfNot404 } from "../helpers";

export const createAddressSlice: StateCreator<IUserStore, [], [], IAddressSlice> = (set, get) => ({
    userAddresses: null,

    fetchUserAddresses: async () => {
        set((s) => ({ loading: { ...s.loading, addresses: true } }));
        try {
            const res = await getAllUserAddresses();
            set((s) => ({ userAddresses: res.data, loading: { ...s.loading, addresses: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, addresses: false } }));
            toastIfNot404(err, "خطا در دریافت آدرس‌ها");
        }
    },

    fetchUserAddress: async (id) => {
        try {
            const res = await getUserAddress(id);
            return res.data;
        } catch (err) {
            toastIfNot404(err, "خطا در دریافت آدرس");
            throw err;
        }
    },

    createUserAddress: async (data) => {
        set((s) => ({ loading: { ...s.loading, createAddress: true } }));
        try {
            await createUserAddress(data);
            await get().fetchUserAddresses();
            set((s) => ({ loading: { ...s.loading, createAddress: false } }));
            toast.success("آدرس با موفقیت ایجاد شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, createAddress: false } }));
            toast.error(extractMessage(err, "خطا در ایجاد آدرس"));
            throw err;
        }
    },

    editUserAddress: async (data) => {
        set((s) => ({ loading: { ...s.loading, editAddress: true } }));
        try {
            await editUserAddress(data);
            await get().fetchUserAddresses();
            set((s) => ({ loading: { ...s.loading, editAddress: false } }));
            toast.success("آدرس با موفقیت ویرایش شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, editAddress: false } }));
            toast.error(extractMessage(err, "خطا در ویرایش آدرس"));
            throw err;
        }
    },

    deleteUserAddress: async (id) => {
        set((s) => ({ loading: { ...s.loading, deleteAddress: true } }));
        try {
            await deleteUserAddress(id);
            set((s) => ({
                userAddresses: s.userAddresses?.filter((a) => a.id !== id) ?? null,
                loading: { ...s.loading, deleteAddress: false },
            }));
            toast.success("آدرس با موفقیت حذف شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, deleteAddress: false } }));
            toast.error(extractMessage(err, "خطا در حذف آدرس"));
            throw err;
        }
    },
});