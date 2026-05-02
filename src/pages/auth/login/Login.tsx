import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { IconEye, IconEyeOff, IconLoader2, IconUser, IconLock } from "@tabler/icons-react";

const loginSchema = z.object({
  usernameOrMobile: z.string().min(2, "نام کاربری یا شماره موبایل الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    setIsLoading(true);
    try {
      const res = await login({
        usernameOrMobile: data.usernameOrMobile,  // ✅ fixed
        password: data.password,
        rememberMe: data.rememberMe,
      });
      if (res) {
        navigate("/");
      } else {
        setServerError("نام کاربری/موبایل یا رمز عبور اشتباه است");
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
        <h1 className="text-2xl font-bold text-blue-800">خوش برگشتید!</h1>
        <p className="text-sm text-gray-400 mt-1">برای ورود اطلاعات خود را وارد کنید</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl px-4 py-3 mb-4 text-center">
          {serverError}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Username or Mobile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">
            نام کاربری یا شماره موبایل
          </label>
          <div className="relative">
            <input
              {...register("usernameOrMobile")}
              placeholder="نام کاربری یا شماره موبایل را وارد کنید"
              className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                errors.usernameOrMobile
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-blue-100 bg-blue-50/30"
              }`}
            />
            <IconUser
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.usernameOrMobile && (  // ✅ fixed
            <p className="text-rose-500 text-xs mt-0.5">
              {errors.usernameOrMobile.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-600">رمز عبور</label>
            <Link to="/forgot-password" className="text-xs text-blue-800 hover:text-blue-600 transition-colors">
              فراموشی رمز عبور؟
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور خود را وارد کنید"
              className={`w-full border rounded-xl px-3 py-2.5 pr-10 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                errors.password
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
              onClick={() => setShowPassword((p) => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-500 text-xs mt-0.5">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember-me"
            {...register("rememberMe")}
            className="w-4 h-4 rounded border-blue-200 accent-blue-800 cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="text-sm text-gray-500 cursor-pointer select-none"
          >
            مرا به خاطر بسپار
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100 mt-2"
        >
          {isLoading ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            "ورود به حساب"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-blue-50" />
        <span className="text-xs text-gray-400">یا</span>
        <div className="flex-1 h-px bg-blue-50" />
      </div>

      {/* Signup link */}
      <p className="text-sm text-gray-500 text-center">
        حساب کاربری ندارید؟{" "}
        <Link
          to="/signup"
          className="text-blue-800 font-semibold hover:text-blue-600 transition-colors"
        >
          ثبت‌نام کنید
        </Link>
      </p>
    </>
  );
}