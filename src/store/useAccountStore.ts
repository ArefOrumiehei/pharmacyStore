import {
    getUser,
    getUserFavorites,
    getUserOrders,
    getUserTickets,
    updateProfile,
    changePassword,
    changeMobileReqOTP,
    changeMobileVerify,
    type IUserProfile,
    type IUpdateProfileParams,
    type IChangePasswordParams,
    type IChangeMobileRequestParams,
    type IChangeMobileVerifyParams,
    type IOrder,
    type ITicket,
} from "@/services/accountServices/accountServices";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";

// ─── Types ───────────────────────────────────────────────────────────────────

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
    user: IUserProfile | null;
    userFavorites: unknown | null;
    userOrders: IOrder[] | null;
    userTickets: ITicket[] | null;
    loading: ILoadingState;

    fetchUser: () => Promise<void>;
    fetchUserFavorites: () => Promise<void>;
    fetchUserOrders: () => Promise<void>;
    fetchUserTickets: () => Promise<void>;
    updateProfile: (data: IUpdateProfileParams) => Promise<void>;
    changePassword: (data: IChangePasswordParams) => Promise<void>;
    changeMobileReqOTP: (data: IChangeMobileRequestParams) => Promise<void>;
    changeMobileVerify: (data: IChangeMobileVerifyParams) => Promise<void>;
    clearUser: () => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_LOADING: ILoadingState = {
    user: false,
    favorites: false,
    orders: false,
    tickets: false,
    updateProfile: false,
    changePassword: false,
    changeMobile: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { message?: string } } })
            .response;
        return res?.data?.message ?? fallback;
    }
    return fallback;
};

export const useUserStore = create<IUserStore>()(
    persist(
        (set) => ({
            user: null,
            userFavorites: null,
            userOrders: null,
            userTickets: null,
            loading: DEFAULT_LOADING,

            fetchUser: async () => {
                set((s) => ({ loading: { ...s.loading, user: true } }));
                try {
                    const data = await getUser();
                    set((s) => ({
                        user: data,
                        loading: { ...s.loading, user: false },
                    }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, user: false } }));
                    toast.error(
                        extractMessage(err, "خطا در دریافت اطلاعات کاربر")
                    );
                }
            },

            fetchUserFavorites: async () => {
                set((s) => ({ loading: { ...s.loading, favorites: true } }));
                try {
                    const data = await getUserFavorites();
                    set((s) => ({
                        userFavorites: data,
                        loading: { ...s.loading, favorites: false },
                    }));
                } catch (err) {
                    set((s) => ({
                        loading: { ...s.loading, favorites: false },
                    }));
                    toast.error(
                        extractMessage(err, "خطا در دریافت علاقه‌مندی‌ها")
                    );
                }
            },

            fetchUserOrders: async () => {
                set((s) => ({ loading: { ...s.loading, orders: true } }));
                try {
                    const data = await getUserOrders();
                    set((s) => ({
                        userOrders: data,
                        loading: { ...s.loading, orders: false },
                    }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, orders: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت سفارش‌ها"));
                }
            },

            fetchUserTickets: async () => {
                set((s) => ({ loading: { ...s.loading, tickets: true } }));
                try {
                    const data = await getUserTickets();
                    set((s) => ({
                        userTickets: data,
                        loading: { ...s.loading, tickets: false },
                    }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, tickets: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت تیکت‌ها"));
                }
            },

            updateProfile: async (data) => {
                set((s) => ({
                    loading: { ...s.loading, updateProfile: true },
                }));
                try {
                    const updated = await updateProfile(data);
                    set((s) => ({
                        user: { ...s.user, ...updated },
                        loading: { ...s.loading, updateProfile: false },
                    }));
                    toast.success("پروفایل با موفقیت بروزرسانی شد");
                } catch (err) {
                    set((s) => ({
                        loading: { ...s.loading, updateProfile: false },
                    }));
                    toast.error(
                        extractMessage(err, "خطا در بروزرسانی پروفایل")
                    );
                    throw err; // let the form handle field-level errors
                }
            },

            changePassword: async (data) => {
                set((s) => ({
                    loading: { ...s.loading, changePassword: true },
                }));
                try {
                    await changePassword(data);
                    set((s) => ({
                        loading: { ...s.loading, changePassword: false },
                    }));
                    toast.success("رمز عبور با موفقیت تغییر یافت");
                } catch (err) {
                    set((s) => ({
                        loading: { ...s.loading, changePassword: false },
                    }));
                    toast.error(extractMessage(err, "خطا در تغییر رمز عبور"));
                    throw err;
                }
            },

            changeMobileReqOTP: async (data) => {
                set((s) => ({ loading: { ...s.loading, changeMobile: true } }));
                try {
                    await changeMobileReqOTP(data);
                    set((s) => ({
                        loading: { ...s.loading, changeMobile: false },
                    }));
                    toast.info("کد تأیید ارسال شد");
                } catch (err) {
                    set((s) => ({
                        loading: { ...s.loading, changeMobile: false },
                    }));
                    toast.error(extractMessage(err, "خطا در ارسال کد تأیید"));
                    throw err;
                }
            },

            changeMobileVerify: async (data) => {
                set((s) => ({ loading: { ...s.loading, changeMobile: true } }));
                try {
                    await changeMobileVerify(data);
                    // Re-fetch so the new mobile is reflected everywhere
                    await useUserStore.getState().fetchUser();
                    set((s) => ({
                        loading: { ...s.loading, changeMobile: false },
                    }));
                    toast.success("شماره موبایل با موفقیت تغییر یافت");
                } catch (err) {
                    set((s) => ({
                        loading: { ...s.loading, changeMobile: false },
                    }));
                    toast.error(
                        extractMessage(err, "خطا در تأیید شماره موبایل")
                    );
                    throw err;
                }
            },

            clearUser: () =>
                set({
                    user: null,
                    userFavorites: null,
                    userOrders: null,
                    userTickets: null,
                    loading: DEFAULT_LOADING,
                }),
        }),

        {
            name: "user_data",
            partialize: (state) => ({
                user: state.user,
                userFavorites: state.userFavorites,
                userOrders: state.userOrders,
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
                        console.warn(
                            "Error auto-fetching user on rehydrate:",
                            e
                        );
                    }
                }, 0);
            },
        }
    )
);
