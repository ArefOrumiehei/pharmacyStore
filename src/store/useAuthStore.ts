import {
    authLogin,
    authLogout,
    authRefreshToken,
    loginSendOTP,
    loginVerifyOTP,
    forgotPassSendOTP,
    forgotPassVerifyAndReset,
    type IAuthLoginParams,
    type IAuthTokenResponse,
    type IForgotPasswordParams,
} from "@/services/authServices/authServices";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ILoadingState {
    login: boolean;
    logout: boolean;
    refresh: boolean;
    otp: boolean;
    forgotPass: boolean;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    loading: ILoadingState;

    login: (params: IAuthLoginParams) => Promise<IAuthTokenResponse>;
    logout: () => Promise<void>;
    refresh: () => Promise<IAuthTokenResponse | null>;

    // OTP login
    sendLoginOTP: (mobile: string) => Promise<void>;
    verifyLoginOTP: (mobile: string, code: string) => Promise<IAuthTokenResponse | null>;

    // Forgot password
    sendForgotOTP: (mobile: string) => Promise<void>;
    verifyAndResetPass: (params: IForgotPasswordParams) => Promise<boolean>;

    // Helpers
    setTokens: (access: string | null, refresh: string | null) => void;
    clearAuth: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_LOADING: ILoadingState = {
    login: false,
    logout: false,
    refresh: false,
    otp: false,
    forgotPass: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        return res?.data?.message ?? fallback;
    }
    return fallback;
};

const applyTokens = (res: IAuthTokenResponse) => ({
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            loading: DEFAULT_LOADING,

            // ── Helpers ──────────────────────────────────────────────────────

            setTokens: (accessToken, refreshToken) =>
                set({ accessToken, refreshToken }),

            clearAuth: () =>
                set({ accessToken: null, refreshToken: null, loading: DEFAULT_LOADING }),

            login: async (params) => {
                set((s) => ({ loading: { ...s.loading, login: true } }));
                try {
                    const res = await authLogin(params);
                    set((s) => ({
                        ...applyTokens(res.data),
                        loading: { ...s.loading, login: false },
                    }));
                    toast.success("ورود با موفقیت انجام شد");
                    return res.data;
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, login: false } }));
                    const message = extractMessage(err, "نام کاربری یا رمز عبور اشتباه است");
                    throw new Error(message);
                }
            },

            // ── Logout ────────────────────────────────────────────────────────

            logout: async () => {
                set((s) => ({ loading: { ...s.loading, logout: true } }));
                try {
                    await authLogout();
                } catch {
                    // Always clear locally even if the server call fails
                } finally {
                    set({ accessToken: null, refreshToken: null, loading: DEFAULT_LOADING });
                    toast.success("از حساب کاربری خارج شدید");
                }
            },

            // ── Refresh token ─────────────────────────────────────────────────

            refresh: async () => {
                const token = get().refreshToken;
                if (!token) return null;

                set((s) => ({ loading: { ...s.loading, refresh: true } }));
                try {
                    const res = await authRefreshToken(token);
                    set((s) => ({ ...applyTokens(res), loading: { ...s.loading, refresh: false } }));
                    return res;
                } catch (err) {
                    set({ accessToken: null, refreshToken: null, loading: DEFAULT_LOADING });
                    toast.error(extractMessage(err, "نشست منقضی شد، دوباره وارد شوید"));
                    return null;
                }
            },

            // ── OTP login — send ──────────────────────────────────────────────

            sendLoginOTP: async (mobile) => {
                set((s) => ({ loading: { ...s.loading, otp: true } }));
                try {
                    await loginSendOTP(mobile);
                    set((s) => ({ loading: { ...s.loading, otp: false } }));
                    toast.info("کد تأیید ارسال شد");
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, otp: false } }));
                    toast.error(extractMessage(err, "خطا در ارسال کد تأیید"));
                    throw err;
                }
            },

            // ── OTP login — verify ────────────────────────────────────────────

            verifyLoginOTP: async (mobile, code) => {
                set((s) => ({ loading: { ...s.loading, otp: true } }));
                try {
                    const res = await loginVerifyOTP(mobile, code);
                    set((s) => ({ ...applyTokens(res), loading: { ...s.loading, otp: false } }));
                    toast.success("ورود با موفقیت انجام شد");
                    return res;
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, otp: false } }));
                    toast.error(extractMessage(err, "کد وارد شده اشتباه یا منقضی است"));
                    return null;
                }
            },

            // ── Forgot password — send OTP ────────────────────────────────────

            sendForgotOTP: async (mobile) => {
                set((s) => ({ loading: { ...s.loading, forgotPass: true } }));
                try {
                    await forgotPassSendOTP(mobile);
                    set((s) => ({ loading: { ...s.loading, forgotPass: false } }));
                    toast.info("کد بازیابی رمز ارسال شد");
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, forgotPass: false } }));
                    toast.error(extractMessage(err, "خطا در ارسال کد بازیابی"));
                    throw err;
                }
            },

            // ── Forgot password — verify & reset ──────────────────────────────

            verifyAndResetPass: async (params) => {
                set((s) => ({ loading: { ...s.loading, forgotPass: true } }));
                try {
                    await forgotPassVerifyAndReset(params);
                    set((s) => ({ loading: { ...s.loading, forgotPass: false } }));
                    toast.success("رمز عبور با موفقیت تغییر یافت");
                    return true;
                } catch (err) {
                    set((s) => ({ loading: { ...s.loading, forgotPass: false } }));
                    toast.error(extractMessage(err, "خطا در بازیابی رمز عبور"));
                    return false;
                }
            },
        }),

        {
            name: "auth_data",
            partialize: (state) => ({
                accessToken:  state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);