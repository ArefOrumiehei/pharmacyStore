import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconCheck,
} from "@tabler/icons-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "حداقل ۲ کاراکتر وارد کنید"),
    email: z.string().email("ایمیل معتبر وارد کنید"),
    mobile: z
      .string()
      .min(10, "حداقل ۱۰ رقم")
      .max(15, "حداکثر ۱۵ رقم")
      .regex(/^[0-9]+$/, "فقط اعداد مجاز هستند"),
    password: z.string().min(6, "حداقل ۶ کاراکتر"),
    confirmPassword: z.string().min(6, "حداقل ۶ کاراکتر"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن باید یکسان باشند",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signupSchema>;

// Reusable field component
function Field({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        {children}
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}

export default function SignUp() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch("password", "");
  const confirmValue = watch("confirmPassword", "");
  const passwordsMatch =
    passwordValue.length >= 6 &&
    confirmValue.length >= 6 &&
    passwordValue === confirmValue;

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
      hasError
        ? "border-rose-200 bg-rose-50/30"
        : "border-blue-100 bg-blue-50/30"
    }`;

  const onSubmit = async (data: SignUpFormValues) => {
    setServerError("");
    setIsLoading(true);
    try {
      const res = await registerUser({
        email: data.email,
        fullname: data.name,
        username: data.name,
        password: data.password,
        mobile: data.mobile,
      });
      if (res) {
        navigate("/");
      } else {
        setServerError("خطا در ثبت‌نام. لطفاً اطلاعات را بررسی کنید");
      }
    } catch {
      setServerError("خطایی رخ داده است. لطفاً دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-blue-800">ایجاد حساب کاربری</h1>
        <p className="text-sm text-gray-400 mt-1">
          برای خرید از فارماپلاس ثبت‌نام کنید
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl px-4 py-3 mb-4 text-center">
          {serverError}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <Field label="نام و نام خانوادگی" error={errors.name?.message} icon={IconUser}>
          <input
            {...register("name")}
            placeholder="نام کامل خود را وارد کنید"
            className={inputClass(!!errors.name)}
          />
        </Field>

        {/* Email */}
        <Field label="ایمیل" error={errors.email?.message} icon={IconMail}>
          <input
            {...register("email")}
            type="email"
            placeholder="example@email.com"
            className={inputClass(!!errors.email)}
          />
        </Field>

        {/* Mobile */}
        <Field label="شماره موبایل" error={errors.mobile?.message} icon={IconPhone}>
          <input
            {...register("mobile")}
            type="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className={inputClass(!!errors.mobile)}
          />
        </Field>

        {/* Password */}
        <Field label="رمز عبور" error={errors.password?.message} icon={IconLock}>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="حداقل ۶ کاراکتر"
            className={`${inputClass(!!errors.password)} pl-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        </Field>

        {/* Confirm password */}
        <Field
          label="تکرار رمز عبور"
          error={errors.confirmPassword?.message}
          icon={IconLock}
        >
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="رمز عبور را تکرار کنید"
            className={`${inputClass(!!errors.confirmPassword)} pl-10`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
          {/* Match indicator */}
          {passwordsMatch && (
            <div className="absolute left-9 top-1/2 -translate-y-1/2">
              <IconCheck size={15} className="text-green-500" />
            </div>
          )}
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100 mt-2"
        >
          {isLoading ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            "ایجاد حساب کاربری"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-blue-50" />
        <span className="text-xs text-gray-400">یا</span>
        <div className="flex-1 h-px bg-blue-50" />
      </div>

      {/* Login link */}
      <p className="text-sm text-gray-500 text-center">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link
          to="/login"
          className="text-blue-800 font-semibold hover:text-blue-600 transition-colors"
        >
          وارد شوید
        </Link>
      </p>
    </>
  );
}