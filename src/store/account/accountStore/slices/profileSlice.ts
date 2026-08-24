import type { StateCreator } from "zustand";
import { toast } from "react-toastify";
import {
    getUser,
    updateProfile,
    completeProfile,
    changePassword,
    setPassword,
    changeMobileReqOTP,
    changeMobileVerify,
} from "@/services/accountServices";
import type { IProfileSlice, IUserStore } from "../types";
import { extractMessage } from "../helpers";

export const createProfileSlice: StateCreator<IUserStore, [], [], IProfileSlice> = (set, get) => ({
    user: null,

    fetchUser: async () => {
        set((s) => ({ loading: { ...s.loading, user: true } }));
        try {
            const res = await getUser();
            set((s) => ({ user: res.data, loading: { ...s.loading, user: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, user: false } }));
            toast.error(extractMessage(err, "خطا در دریافت اطلاعات کاربر"));
        }
    },

    updateProfile: async (data) => {
        set((s) => ({ loading: { ...s.loading, updateProfile: true } }));
        try {
            const res = await updateProfile(data);
            await get().fetchUser();
            set((s) => ({ loading: { ...s.loading, updateProfile: false } }));
            toast.success(res.message || "پروفایل با موفقیت بروزرسانی شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, updateProfile: false } }));
            toast.error(extractMessage(err, "خطا در بروزرسانی پروفایل"));
            throw err;
        }
    },

    completeProfile: async (data) => {
        set((s) => ({ loading: { ...s.loading, completeProfile: true } }));
        try {
            const res = await completeProfile(data);
            set((s) => ({
                user: { ...s.user, ...res.data },
                loading: { ...s.loading, completeProfile: false },
            }));
            toast.success("پروفایل با موفقیت تکمیل شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, completeProfile: false } }));
            toast.error(extractMessage(err, "خطا در تکمیل پروفایل"));
            throw err;
        }
    },

    changePassword: async (data) => {
        set((s) => ({ loading: { ...s.loading, changePassword: true } }));
        try {
            await changePassword(data);
            set((s) => ({ loading: { ...s.loading, changePassword: false } }));
            toast.success("رمز عبور با موفقیت تغییر یافت");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, changePassword: false } }));
            toast.error(extractMessage(err, "خطا در تغییر رمز عبور"));
            throw err;
        }
    },

    setPassword: async (data) => {
        set((s) => ({ loading: { ...s.loading, setPassword: true } }));
        try {
            await setPassword(data);
            set((s) => ({
                user: s.user ? { ...s.user, hasPassword: true } : s.user,
                loading: { ...s.loading, setPassword: false },
            }));
            toast.success("رمز عبور با موفقیت تنظیم شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, setPassword: false } }));
            toast.error(extractMessage(err, "خطا در تنظیم رمز عبور"));
            throw err;
        }
    },

    changeMobileReqOTP: async (data) => {
        set((s) => ({ loading: { ...s.loading, changeMobile: true } }));
        try {
            await changeMobileReqOTP(data);
            set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
            toast.info("کد تأیید ارسال شد");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
            toast.error(extractMessage(err, "خطا در ارسال کد تأیید"));
            throw err;
        }
    },

    changeMobileVerify: async (data) => {
        set((s) => ({ loading: { ...s.loading, changeMobile: true } }));
        try {
            await changeMobileVerify(data);
            await get().fetchUser();
            set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
            toast.success("شماره موبایل با موفقیت تغییر یافت");
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
            toast.error(extractMessage(err, "خطا در تأیید شماره موبایل"));
            throw err;
        }
    },
});