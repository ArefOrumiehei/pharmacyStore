/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router";
import {
  IconUser,
  IconLoader2,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconCheck,
  IconDeviceMobile,
} from "@tabler/icons-react";

// ── Schemas ────────────────────────────────────────────────────────────────────
const step1Schema = z.object({
  usernameOrMobile: z.string().min(2, "نام کاربری یا شماره موبایل الزامی است"),
});

const step2Schema = z.object({
  otp: z
    .string()
    .length(6, "کد تأیید باید ۶ رقم باشد")
    .regex(/^\d+$/, "کد تأیید باید عددی باشد"),
});

const step3Schema = z
  .object({
    newPassword: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;

// ── OTP Input Component ────────────────────────────────────────────────────────
function OtpInput({ onChange }: { onChange: (val: string) => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    onChange(next.join(""));
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    onChange(next.join(""));
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" dir="ltr">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
            d
              ? "border-blue-400 bg-blue-50 text-blue-800"
              : "border-blue-100 bg-blue-50/30 text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

// ── Step Indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  const steps = [1, 2, 3];
  return (
    <div className="flex items-center justify-center gap-2 mb-7">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              s < current
                ? "bg-blue-800 text-white"
                : s === current
                ? "bg-blue-800 text-white ring-4 ring-blue-100"
                : "bg-blue-50 text-blue-300 border-2 border-blue-100"
            }`}
          >
            {s < current ? <IconCheck size={14} /> : s}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 rounded transition-all duration-300 ${
                s < current ? "bg-blue-800" : "bg-blue-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [maskedContact, setMaskedContact] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [done, setDone] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Step 1 form ──
  const form1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
  });

  // ── Step 3 form ──
  const form3 = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
  });

  const mask = (val: string) => {
    const isMobile = /^\d{10,11}$/.test(val.replace(/\D/g, ""));
    if (isMobile) {
      const digits = val.replace(/\D/g, "");
      return digits.slice(0, 4) + "***" + digits.slice(-3);
    }
    return val.slice(0, 2) + "***" + val.slice(-1);
  };

  const onStep1Submit = async (data: Step1Values) => {
    setServerError("");
    setIsLoading(true);
    try {
      // TODO: call your API — await sendOtp(data.usernameOrMobile)
      await new Promise((r) => setTimeout(r, 1200)); // mock delay
      setMaskedContact(mask(data.usernameOrMobile));
      setCountdown(120);
      setStep(2);
    } catch {
      setServerError("خطایی رخ داده است. لطفاً دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  const onStep2Submit = async () => {
    setOtpError("");
    if (otpValue.length !== 6) {
      setOtpError("کد تأیید باید ۶ رقم باشد");
      return;
    }
    setIsLoading(true);
    try {
      // TODO: call your API — await verifyOtp(otpValue)
      await new Promise((r) => setTimeout(r, 1200)); // mock delay
      setStep(3);
    } catch {
      setOtpError("کد تأیید نادرست است. لطفاً دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  const onStep3Submit = async (data: Step3Values) => {
    setServerError("");
    setIsLoading(true);
    try {
      // TODO: call your API — await resetPassword(data.newPassword)
      await new Promise((r) => setTimeout(r, 1200)); // mock delay
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setServerError("خطایی رخ داده است. لطفاً دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setCountdown(120);
      setOtpValue("");
      setOtpError("");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Success screen ──
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <IconCheck size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-blue-800">رمز عبور تغییر کرد!</h2>
        <p className="text-sm text-gray-400">در حال انتقال به صفحه ورود...</p>
      </div>
    );
  }

  return (
    <>
      {/* Back link */}
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
        <h1 className="text-2xl font-bold text-blue-800">فراموشی رمز عبور</h1>
        <p className="text-sm text-gray-400 mt-1">
          {step === 1 && "اطلاعات حساب خود را وارد کنید"}
          {step === 2 && `کد تأیید ارسال شده به ${maskedContact} را وارد کنید`}
          {step === 3 && "رمز عبور جدید خود را تعیین کنید"}
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Server error */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl px-4 py-3 mb-4 text-center">
          {serverError}
        </div>
      )}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form className="flex flex-col gap-4" onSubmit={form1.handleSubmit(onStep1Submit)}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              نام کاربری یا شماره موبایل
            </label>
            <div className="relative">
              <input
                {...form1.register("usernameOrMobile")}
                placeholder="نام کاربری یا شماره موبایل را وارد کنید"
                className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                  form1.formState.errors.usernameOrMobile
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-blue-100 bg-blue-50/30"
                }`}
              />
              <IconUser
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {form1.formState.errors.usernameOrMobile && (
              <p className="text-rose-500 text-xs mt-0.5">
                {form1.formState.errors.usernameOrMobile.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100 mt-2"
          >
            {isLoading ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <>
                <IconDeviceMobile size={16} />
                ارسال کد تأیید
              </>
            )}
          </button>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-gray-600 text-center">
              کد ۶ رقمی ارسال شده را وارد کنید
            </label>
            <OtpInput onChange={(val) => { setOtpValue(val); setOtpError(""); }} />
            {otpError && (
              <p className="text-rose-500 text-xs text-center">{otpError}</p>
            )}
          </div>

          {/* Resend */}
          <div className="text-center text-sm">
            {countdown > 0 ? (
              <span className="text-gray-400">
                ارسال مجدد کد تا{" "}
                <span className="text-blue-800 font-bold tabular-nums" dir="ltr">
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                  {String(countdown % 60).padStart(2, "0")}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-blue-800 font-medium hover:text-blue-600 transition-colors"
              >
                ارسال مجدد کد
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onStep2Submit}
            disabled={isLoading || otpValue.length !== 6}
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
            onClick={() => { setStep(1); setServerError(""); setOtpValue(""); }}
            className="text-sm text-gray-400 hover:text-blue-800 transition-colors text-center"
          >
            تغییر شماره / نام کاربری
          </button>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <form className="flex flex-col gap-4" onSubmit={form3.handleSubmit(onStep3Submit)}>
          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">رمز عبور جدید</label>
            <div className="relative">
              <input
                {...form3.register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="حداقل ۸ کاراکتر"
                className={`w-full border rounded-xl px-3 py-2.5 pr-10 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                  form3.formState.errors.newPassword
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-blue-100 bg-blue-50/30"
                }`}
              />
              <IconLock
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
            {form3.formState.errors.newPassword && (
              <p className="text-rose-500 text-xs mt-0.5">
                {form3.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">تکرار رمز عبور جدید</label>
            <div className="relative">
              <input
                {...form3.register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="رمز عبور را مجدداً وارد کنید"
                className={`w-full border rounded-xl px-3 py-2.5 pr-10 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                  form3.formState.errors.confirmPassword
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-blue-100 bg-blue-50/30"
                }`}
              />
              <IconLock
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
            {form3.formState.errors.confirmPassword && (
              <p className="text-rose-500 text-xs mt-0.5">
                {form3.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100 mt-2"
          >
            {isLoading ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              "تغییر رمز عبور"
            )}
          </button>
        </form>
      )}

      {/* Divider + login link */}
      {step === 1 && (
        <>
          <div className="flex items-center gap-3 my-5">
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
        </>
      )}
    </>
  );
}
