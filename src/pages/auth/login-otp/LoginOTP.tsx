import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useAccountStore";
import {
    IconPhone,
    IconLoader2,
    IconArrowRight,
    IconRefresh,
} from "@tabler/icons-react";

// ─── OTP digit input ──────────────────────────────────────────────────────────

function OtpInput({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (val: string) => void;
    disabled: boolean;
}) {
    const LENGTH = 6;
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(LENGTH, "").split("").slice(0, LENGTH);

    const focus = (i: number) => refs.current[i]?.focus();

    const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...digits];
            if (next[i]) {
                next[i] = "";
            } else if (i > 0) {
                next[i - 1] = "";
                focus(i - 1);
            }
            onChange(next.join(""));
            return;
        }
        if (e.key === "ArrowLeft") {
            focus(Math.min(i + 1, LENGTH - 1));
            return;
        }
        if (e.key === "ArrowRight") {
            focus(Math.max(i - 1, 0));
            return;
        }
    };

    const handleChange = (
        i: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const char = e.target.value.replace(/\D/g, "").slice(-1);
        if (!char) return;
        const next = [...digits];
        next[i] = char;
        onChange(next.join(""));
        if (i < LENGTH - 1) focus(i + 1);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, LENGTH);
        onChange(pasted.padEnd(LENGTH, "").slice(0, LENGTH));
        focus(Math.min(pasted.length, LENGTH - 1));
    };

    return (
        <div className="flex gap-2 justify-center" dir="ltr">
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        refs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    disabled={disabled}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    className={`w-11 h-12 text-center text-lg font-bold rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed
            ${
                d
                    ? "border-blue-400 bg-blue-50 text-blue-800"
                    : "border-blue-100 bg-blue-50/30 text-gray-800"
            }`}
                />
            ))}
        </div>
    );
}

// ─── Countdown timer ──────────────────────────────────────────────────────────

function useCountdown(seconds: number, active: boolean) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        if (!active) {
            setRemaining(seconds);
            return;
        }
        setRemaining(seconds);
        const id = setInterval(() => {
            setRemaining((r) => {
                if (r <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return r - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [active, seconds]);

    return remaining;
}

// ─── Main component ───────────────────────────────────────────────────────────

type Step = "mobile" | "otp";

export default function LoginOTP() {
    const navigate = useNavigate();
    const { sendLoginOTP, verifyLoginOTP, loading } = useAuthStore();
    const { fetchUser } = useUserStore();

    const [step, setStep] = useState<Step>("mobile");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [countdownActive, setCountdownActive] = useState(false);

    const remaining = useCountdown(120, countdownActive);
    const canResend = remaining === 0 && step === "otp";

    const formatRemaining = (s: number) => {
        const m = Math.floor(s / 60)
            .toString()
            .padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    // ── Step 1: send OTP ────────────────────────────────────────────────────────
    const handleSendOTP = async () => {
        setMobileError("");
        const cleaned = mobile.trim();
        if (!cleaned) {
            setMobileError("شماره موبایل را وارد کنید");
            return;
        }
        if (!/^09\d{9}$/.test(cleaned)) {
            setMobileError("شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");
            return;
        }

        try {
            await sendLoginOTP(cleaned);
            setStep("otp");
            setCountdownActive(true);
        } catch {
            // toast already shown in store
        }
    };

    // ── Step 2: verify OTP ──────────────────────────────────────────────────────
    const handleVerifyOTP = async () => {
        setOtpError("");
        if (otp.replace(/\D/g, "").length < 6) {
            setOtpError("کد ۶ رقمی را کامل وارد کنید");
            return;
        }

        const res = await verifyLoginOTP(mobile, otp);
        if (res) {
            await fetchUser();
            navigate("/");
        }
    };

    // ── Resend ──────────────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (!canResend) return;
        setOtp("");
        setOtpError("");
        try {
            await sendLoginOTP(mobile);
            setCountdownActive(false);
            setTimeout(() => setCountdownActive(true), 0); // restart countdown
        } catch {
            // toast already shown in store
        }
    };

    const isLoading = loading.otp;

    return (
        <>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                    <IconPhone size={24} className="text-blue-800" />
                </div>
                <h1 className="text-2xl font-bold text-blue-800">
                    {step === "mobile"
                        ? "ورود با شماره موبایل"
                        : "تأیید شماره موبایل"}
                </h1>
                <p className="text-sm text-gray-400 mt-1.5">
                    {step === "mobile"
                        ? "کد تأیید به شماره شما ارسال می‌شود"
                        : `کد ۶ رقمی ارسال شده به ${mobile} را وارد کنید`}
                </p>
            </div>

            {/* ── Step 1: Mobile input ── */}
            {step === "mobile" && (
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            شماره موبایل
                        </label>
                        <div className="relative">
                            <IconPhone
                                size={15}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => {
                                    setMobile(e.target.value);
                                    setMobileError("");
                                }}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSendOTP()
                                }
                                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                autoFocus
                                className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200
                  ${
                      mobileError
                          ? "border-rose-200 bg-rose-50/30"
                          : "border-blue-100 bg-blue-50/30"
                  }`}
                            />
                        </div>
                        {mobileError && (
                            <p className="text-rose-500 text-xs">
                                {mobileError}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
                    >
                        {isLoading ? (
                            <IconLoader2 size={18} className="animate-spin" />
                        ) : (
                            "ارسال کد تأیید"
                        )}
                    </button>
                </div>
            )}

            {/* ── Step 2: OTP input ── */}
            {step === "otp" && (
                <div className="flex flex-col gap-6">
                    {/* OTP boxes */}
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading}
                    />
                    {otpError && (
                        <p className="text-rose-500 text-xs text-center -mt-3">
                            {otpError}
                        </p>
                    )}

                    {/* Timer + resend */}
                    <div className="flex items-center justify-center gap-2 text-sm">
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 text-blue-800 font-semibold hover:text-blue-600 transition-colors disabled:opacity-50"
                            >
                                <IconRefresh size={14} />
                                ارسال مجدد کد
                            </button>
                        ) : (
                            <span
                                className="text-gray-400 tabular-nums"
                                dir="ltr"
                            >
                                {formatRemaining(remaining)}
                            </span>
                        )}
                    </div>

                    {/* Verify button */}
                    <button
                        onClick={handleVerifyOTP}
                        disabled={
                            isLoading || otp.replace(/\D/g, "").length < 6
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
                    >
                        {isLoading ? (
                            <IconLoader2 size={18} className="animate-spin" />
                        ) : (
                            "تأیید و ورود"
                        )}
                    </button>

                    {/* Back to mobile step */}
                    <button
                        type="button"
                        onClick={() => {
                            setStep("mobile");
                            setOtp("");
                            setOtpError("");
                            setCountdownActive(false);
                        }}
                        className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-blue-800 transition-colors"
                    >
                        <IconArrowRight size={14} />
                        تغییر شماره موبایل
                    </button>
                </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-blue-50" />
                <span className="text-xs text-gray-400">یا</span>
                <div className="flex-1 h-px bg-blue-50" />
            </div>

            {/* Links */}
            <div className="flex flex-col gap-3 text-center text-sm text-gray-500">
                <p>
                    <Link
                        to="/login"
                        className="text-blue-800 font-semibold hover:text-blue-600 transition-colors"
                    >
                        ورود با رمز عبور
                    </Link>
                </p>
            </div>
        </>
    );
}
