import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore";
import {
    getUser,
    getUserFavorites,
    getUserOrders,
    getUserOrder,
    getUserTickets,
    getTicketDetails,
    getAllUserAddresses,
    getUserAddress,
    createUserAddress,
    editUserAddress,
    deleteUserAddress,
    updateProfile,
    completeProfile,
    changePassword,
    setPassword,
    changeMobileReqOTP,
    changeMobileVerify,
    type IUserProfile,
    type IAddress,
    type IOrder,
    type ITicket,
    type IUpdateProfileParams,
    type ICompleteProfileParams,
    type IChangePasswordParams,
    type ISetPasswordParams,
    type IChangeMobileRequestParams,
    type IChangeMobileVerifyParams,
    type IAddressFormParams,
    type IEditAddressFormParams,
} from "@/services/accountServices/accountServices";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ILoadingState {
    user: boolean;
    favorites: boolean;
    orders: boolean;
    order: boolean;
    tickets: boolean;
    ticket: boolean;
    addresses: boolean;
    updateProfile: boolean;
    completeProfile: boolean;
    changePassword: boolean;
    setPassword: boolean;
    changeMobile: boolean;
    createAddress: boolean;
    editAddress: boolean;
    deleteAddress: boolean;
}

interface IUserStore {
    user: IUserProfile | null;
    userFavorites: unknown | null;
    userOrders: IOrder[] | null;
    selectedOrder: IOrder | null;
    userTickets: ITicket[] | null;
    selectedTicket: ITicket | null;
    userAddresses: IAddress[] | null;
    loading: ILoadingState;

    fetchUser: () => Promise<void>;
    fetchUserFavorites: () => Promise<void>;
    fetchUserOrders: () => Promise<void>;
    fetchUserOrder: (orderId: number) => Promise<void>;
    fetchUserTickets: () => Promise<void>;
    fetchTicketDetails: (ticketId: string) => Promise<void>;
    fetchUserAddresses: () => Promise<void>;
    fetchUserAddress: (id: number) => Promise<IAddress>;
    createUserAddress: (data: IAddressFormParams) => Promise<void>;
    editUserAddress: (data: IEditAddressFormParams) => Promise<void>;
    deleteUserAddress: (id: number) => Promise<void>;
    updateProfile: (data: IUpdateProfileParams) => Promise<void>;
    completeProfile: (data: ICompleteProfileParams) => Promise<void>;
    changePassword: (data: IChangePasswordParams) => Promise<void>;
    setPassword: (data: ISetPasswordParams) => Promise<void>;
    changeMobileReqOTP: (data: IChangeMobileRequestParams) => Promise<void>;
    changeMobileVerify: (data: IChangeMobileVerifyParams) => Promise<void>;
    clearSelectedOrder: () => void;
    clearSelectedTicket: () => void;
    clearUser: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_LOADING: ILoadingState = {
    user: false,
    favorites: false,
    orders: false,
    order: false,
    tickets: false,
    ticket: false,
    addresses: false,
    updateProfile: false,
    completeProfile: false,
    changePassword: false,
    setPassword: false,
    changeMobile: false,
    createAddress: false,
    editAddress: false,
    deleteAddress: false,
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const r = (err as { response?: { data?: { message?: string } } }).response;
        return r?.data?.message ?? fallback;
    }
    return fallback;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUserStore = create<IUserStore>()(
    persist(
        (set) => ({
            user: null,
            userFavorites: null,
            userOrders: null,
            selectedOrder: null,
            userTickets: null,
            selectedTicket: null,
            userAddresses: null,
            loading: DEFAULT_LOADING,

            // ── User ──────────────────────────────────────────────────────────

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
                    set((s) => ({ user: { ...s.user, ...res.data }, loading: { ...s.loading, updateProfile: false } }));
                    toast.success("پروفایل با موفقیت بروزرسانی شد");
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
                    set((s) => ({ user: { ...s.user, ...res.data }, loading: { ...s.loading, completeProfile: false } }));
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
                    await useUserStore.getState().fetchUser();
                    set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
                    toast.success("شماره موبایل با موفقیت تغییر یافت");
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, changeMobile: false } }));
                    toast.error(extractMessage(err, "خطا در تأیید شماره موبایل"));
                    throw err;
                }
            },

            // ── Favorites ─────────────────────────────────────────────────────

            fetchUserFavorites: async () => {
                set((s) => ({ loading: { ...s.loading, favorites: true } }));
                try {
                    const res = await getUserFavorites();
                    set((s) => ({ userFavorites: res.data, loading: { ...s.loading, favorites: false } }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, favorites: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت علاقه‌مندی‌ها"));
                }
            },

            // ── Orders ────────────────────────────────────────────────────────

            fetchUserOrders: async () => {
                set((s) => ({ loading: { ...s.loading, orders: true } }));
                try {
                    const res = await getUserOrders();
                    set((s) => ({ userOrders: res.data, loading: { ...s.loading, orders: false } }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, orders: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت سفارش‌ها"));
                }
            },

            fetchUserOrder: async (orderId) => {
                set((s) => ({ loading: { ...s.loading, order: true }, selectedOrder: null }));
                try {
                    const res = await getUserOrder(orderId);
                    set((s) => ({ selectedOrder: res.data, loading: { ...s.loading, order: false } }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, order: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت جزئیات سفارش"));
                }
            },

            clearSelectedOrder: () => set({ selectedOrder: null }),

            // ── Tickets ───────────────────────────────────────────────────────

            fetchUserTickets: async () => {
                set((s) => ({ loading: { ...s.loading, tickets: true } }));
                try {
                    const res = await getUserTickets();
                    set((s) => ({ userTickets: res.data, loading: { ...s.loading, tickets: false } }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, tickets: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت تیکت‌ها"));
                }
            },

            fetchTicketDetails: async (ticketId) => {
                set((s) => ({ loading: { ...s.loading, ticket: true }, selectedTicket: null }));
                try {
                    const res = await getTicketDetails(ticketId);
                    set((s) => ({ selectedTicket: res.data, loading: { ...s.loading, ticket: false } }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, ticket: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت جزئیات تیکت"));
                }
            },

            clearSelectedTicket: () => set({ selectedTicket: null }),

            // ── Addresses ─────────────────────────────────────────────────────

            fetchUserAddresses: async () => {
                set((s) => ({ loading: { ...s.loading, addresses: true } }));
                try {
                    const res = await getAllUserAddresses();
                    set((s) => ({ userAddresses: res.data, loading: { ...s.loading, addresses: false } }));
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, addresses: false } }));
                    toast.error(extractMessage(err, "خطا در دریافت آدرس‌ها"));
                }
            },

            fetchUserAddress: async (id) => {
                try {
                    const res = await getUserAddress(id);
                    return res.data;
                } catch (err) {
                    toast.error(extractMessage(err, "خطا در دریافت آدرس"));
                    throw err;
                }
            },

            createUserAddress: async (data) => {
                set((s) => ({ loading: { ...s.loading, createAddress: true } }));
                try {
                    await createUserAddress(data);
                    await useUserStore.getState().fetchUserAddresses();
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
                    await useUserStore.getState().fetchUserAddresses();
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

            // ── Clear ─────────────────────────────────────────────────────────

            clearUser: () =>
                set({
                    user: null,
                    userFavorites: null,
                    userOrders: null,
                    selectedOrder: null,
                    userTickets: null,
                    selectedTicket: null,
                    userAddresses: null,
                    loading: DEFAULT_LOADING,
                }),
        }),

        {
            name: "user_data",
            partialize: (state) => ({
                user:          state.user,
                userFavorites: state.userFavorites,
                userAddresses: state.userAddresses,
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