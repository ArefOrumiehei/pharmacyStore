import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import {
    IconPhone,
    IconLoader2,
    IconArrowRight,
    IconCheck,
    IconRefresh,
    IconLock,
    IconEye,
    IconEyeOff,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const mobileSchema = z.object({
    mobile: z
        .string()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
});

const resetSchema = z
    .object({
        password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
        confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "رمز عبور و تکرار آن مطابقت ندارند",
        path: ["confirmPassword"],
    });

type MobileFormValues = z.infer<typeof mobileSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (val: string) => void;
    disabled: boolean;
}) {
    const LENGTH = 5;
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value
        .slice(0, LENGTH)
        .split("")
        .concat(Array(LENGTH).fill(""))
        .slice(0, LENGTH);

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
        onChange(pasted.padEnd(LENGTH, "").slice(0, LENGTH))
        focus(Math.min(pasted.length, LENGTH - 1))
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
                    className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed
            ${
                d
                    ? "border-blue-400 bg-blue-50 text-blue-800"
                    : "border-blue-100 bg-blue-50/30 text-gray-700"
            }`}
                />
            ))}
        </div>
    );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
    const count = 3;
    return (
        <div className="flex items-center justify-center gap-1 mb-7">
            {Array.from({ length: count }, (_, i) => {
                const s = i + 1;
                const done = s < current;
                const active = s === current;
                return (
                    <div key={s} className="flex items-center gap-1">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${
                  done
                      ? "bg-blue-800 text-white"
                      : active
                      ? "bg-blue-800 text-white ring-4 ring-blue-100"
                      : "bg-blue-50 text-blue-300 border-2 border-blue-100"
              }`}
                        >
                            {done ? <IconCheck size={14} /> : s}
                        </div>
                        {i < count - 1 && (
                            <div
                                className={`w-10 h-0.5 rounded transition-all duration-300 ${
                                    done ? "bg-blue-800" : "bg-blue-100"
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────

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

const fmt = (s: number) =>
    `${Math.floor(s / 60)
        .toString()
        .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

// ─── Shared field styles ──────────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
        hasError
            ? "border-rose-200 bg-rose-50/30"
            : "border-blue-100 bg-blue-50/30"
    }`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { sendForgotOTP, verifyAndResetPass, loading } = useAuthStore();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [countdownActive, setCountdownActive] = useState(false);
    const [done, setDone] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);

    const remaining = useCountdown(120, countdownActive);
    const canResend = remaining === 0 && step === 2;
    const isLoading = loading.forgotPass;

    // ── Step 1 form ─────────────────────────────────────────────────────────────
    const {
        register: reg1,
        handleSubmit: submit1,
        formState: { errors: err1 },
    } = useForm<MobileFormValues>({ resolver: zodResolver(mobileSchema) });

    // ── Step 3 form ─────────────────────────────────────────────────────────────
    const {
        register: reg3,
        handleSubmit: submit3,
        formState: { errors: err3 },
    } = useForm<ResetFormValues>({ resolver: zodResolver(resetSchema) });

    // ── Handlers ─────────────────────────────────────────────────────────────────

    const onSendOTP = async (data: MobileFormValues) => {
        try {
            await sendForgotOTP(data.mobile);
            setMobile(data.mobile);
            setStep(2);
            setCountdownActive(true);
        } catch {
            // toast already shown in store
        }
    };

    const onVerifyOTP = () => {
        setOtpError("");
        if (otp.replace(/\D/g, "").length < 5) {
            setOtpError("کد ۵ رقمی را کامل وارد کنید");
            return;
        }
        // OTP is valid client-side — move to step 3
        // The actual verification happens server-side in the combined reset call
        setStep(3);
    };

    const onResend = async () => {
        if (!canResend) return;
        setOtp("");
        setOtpError("");
        try {
            await sendForgotOTP(mobile);
            setCountdownActive(false);
            setTimeout(() => setCountdownActive(true), 0);
        } catch {
            // toast shown in store
        }
    };

    const onResetPassword = async (data: ResetFormValues) => {
        const success = await verifyAndResetPass({
            mobile,
            code: otp,
            password: data.password,
            confirmPassword: data.confirmPassword,
        });
        if (success) {
            setDone(true);
            setTimeout(() => navigate("/login"), 2500);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────────
    if (done) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                    <IconCheck size={32} className="text-green-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-blue-800">
                        رمز عبور تغییر کرد
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        در حال انتقال به صفحه ورود...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Back */}
            <div className="mb-5">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-800 transition-colors duration-200"
                >
                    <IconArrowRight size={15} />
                    بازگشت به ورود
                </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-blue-800">
                    فراموشی رمز عبور
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    {step === 1 && "شماره موبایل خود را وارد کنید"}
                    {step === 2 && `کد ارسال شده به ${mobile} را وارد کنید`}
                    {step === 3 && "رمز عبور جدید خود را تعیین کنید"}
                </p>
            </div>

            <StepIndicator current={step} />

            {/* ── Step 1: Mobile ── */}
            {step === 1 && (
                <form
                    className="flex flex-col gap-4"
                    onSubmit={submit1(onSendOTP)}
                >
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
                                {...reg1("mobile")}
                                type="tel"
                                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                autoFocus
                                className={inputCls(!!err1.mobile)}
                            />
                        </div>
                        {err1.mobile && (
                            <p className="text-rose-500 text-xs">
                                {err1.mobile.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100 mt-1"
                    >
                        {isLoading ? (
                            <IconLoader2 size={18} className="animate-spin" />
                        ) : (
                            "ارسال کد تأیید"
                        )}
                    </button>

                    <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-blue-50" />
                        <span className="text-xs text-gray-400">یا</span>
                        <div className="flex-1 h-px bg-blue-50" />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                        رمز عبور خود را به خاطر آوردید؟{" "}
                        <Link
                            to="/login"
                            className="text-blue-800 font-semibold hover:text-blue-600 transition-colors"
                        >
                            وارد شوید
                        </Link>
                    </p>
                </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 2 && (
                <div className="flex flex-col gap-5">
                    <OtpInput
                        value={otp}
                        onChange={(v) => {
                            setOtp(v);
                            setOtpError("");
                        }}
                        disabled={isLoading}
                    />
                    {otpError && (
                        <p className="text-rose-500 text-xs text-center -mt-2">
                            {otpError}
                        </p>
                    )}

                    {/* Timer / resend */}
                    <div className="flex items-center justify-center text-sm">
                        {canResend ? (
                            <button
                                onClick={onResend}
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
                                {fmt(remaining)}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onVerifyOTP}
                        disabled={
                            isLoading || otp.replace(/\D/g, "").length < 5
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
                    >
                        {isLoading ? (
                            <IconLoader2 size={18} className="animate-spin" />
                        ) : (
                            "تأیید کد"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setStep(1);
                            setOtp("");
                            setOtpError("");
                            setCountdownActive(false);
                        }}
                        className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-blue-800 transition-colors"
                    >
                        <IconArrowRight size={14} />
                        تغییر شماره موبایل
                    </button>
                </div>
            )}

            {/* ── Step 3: New password ── */}
            {step === 3 && (
                <form
                    className="flex flex-col gap-4"
                    onSubmit={submit3(onResetPassword)}
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            رمز عبور جدید
                        </label>
                        <div className="relative">
                            <IconLock
                                size={15}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                {...reg3("password")}
                                type={showPw ? "text" : "password"}
                                placeholder="حداقل ۸ کاراکتر"
                                className={`${inputCls(!!err3.password)} pl-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((p) => !p)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPw ? (
                                    <IconEyeOff size={15} />
                                ) : (
                                    <IconEye size={15} />
                                )}
                            </button>
                        </div>
                        {err3.password && (
                            <p className="text-rose-500 text-xs">
                                {err3.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            تکرار رمز عبور جدید
                        </label>
                        <div className="relative">
                            <IconLock
                                size={15}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                {...reg3("confirmPassword")}
                                type={showCpw ? "text" : "password"}
                                placeholder="رمز عبور را مجدداً وارد کنید"
                                className={`${inputCls(
                                    !!err3.confirmPassword
                                )} pl-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCpw((p) => !p)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showCpw ? (
                                    <IconEyeOff size={15} />
                                ) : (
                                    <IconEye size={15} />
                                )}
                            </button>
                        </div>
                        {err3.confirmPassword && (
                            <p className="text-rose-500 text-xs">
                                {err3.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100 mt-1"
                    >
                        {isLoading ? (
                            <IconLoader2 size={18} className="animate-spin" />
                        ) : (
                            "تغییر رمز عبور"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-blue-800 transition-colors"
                    >
                        <IconArrowRight size={14} />
                        بازگشت به تأیید کد
                    </button>
                </form>
            )}
        </>
    );
}
