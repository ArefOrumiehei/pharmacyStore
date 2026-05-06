import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconPencil,
  IconCheck,
  IconX,
  IconLoader2,
  IconLock,
  IconEye,
  IconEyeOff,
  IconCamera,
  IconAt,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import { IMAGE_BASE } from "@/apis/apiInstance";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  fullname: z.string().min(2, "حداقل ۲ کاراکتر").max(100, "حداکثر ۱۰۰ کاراکتر"),
  username: z.string().min(2, "حداقل ۲ کاراکتر").max(50,  "حداکثر ۵۰ کاراکتر"),
  email:    z.string().email("ایمیل معتبر وارد کنید").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1,  "رمز فعلی الزامی است"),
  password:        z.string().min(6,  "حداقل ۶ کاراکتر"),
  rePassword:      z.string().min(6,  "حداقل ۶ کاراکتر"),
}).refine((d) => d.password === d.rePassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path:    ["rePassword"],
});

const mobileSchema = z.object({
  mobile: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  code:   z.string().length(6, "کد ۶ رقمی را وارد کنید").optional(),
});

type ProfileFormValues  = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type MobileFormValues   = z.infer<typeof mobileSchema>;

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

function Field({
  label, error, icon: Icon, children,
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
        <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean, disabled?: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    disabled
      ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100"
      : hasError
      ? "border-rose-200 bg-rose-50/30"
      : "border-blue-100 bg-blue-50/30"
  }`;

// ─── Profile photo picker ─────────────────────────────────────────────────────

function AvatarPicker({
  userFullName,
  userPhoneNumber,
  currentUrl,
  disabled,
  onChange,
}: {
  userFullName?: string,
  userPhoneNumber?: string,
  currentUrl?: string;
  disabled:    boolean;
  onChange:    (file: File) => void;
}) {
  const inputRef                    = useRef<HTMLInputElement>(null);
  const [preview, setPreview]       = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const src = preview ?? (currentUrl ? `${IMAGE_BASE}${currentUrl}` : null);

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl border-2 border-blue-100 overflow-hidden bg-blue-50 flex items-center justify-center">
          {src
            ? <img src={src} alt="پروفایل" className="w-full h-full object-cover" />
            : <IconUser size={32} className="text-blue-200" />
          }
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-xl bg-blue-800 hover:bg-blue-700 border-2 border-white flex items-center justify-center transition-colors duration-150 shadow-sm"
          >
            <IconCamera size={13} className="text-white" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-gray-700">{userFullName || userPhoneNumber}</p>
        {!disabled && (
          <p className="text-xs text-gray-400">JPG یا PNG، حداکثر ۱ مگابایت</p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Account() {
  const { user, loading, updateProfile, changePassword, changeMobileReqOTP, changeMobileVerify } =
    useUserStore();

  const [isEditing,    setIsEditing]    = useState(false);
  const [photoFile,    setPhotoFile]    = useState<File | undefined>(undefined);
  const [otpSent,      setOtpSent]      = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw,    setShowNewPw]    = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // ── Profile form ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: user?.fullname ?? "",
      username: user?.username ?? "",
      email:    user?.email    ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullname ?? "",
        username: user.username ?? "",
        email:    user.email    ?? "",
      });
    }
  }, [user, reset]);

  const onSaveProfile = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        fullname:     data.fullname,
        username:     data.username,
        email:        data.email || undefined,
        profilePhoto: photoFile,
      });
      setIsEditing(false);
      setPhotoFile(undefined);
    } catch {
      // toast already shown by store
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setPhotoFile(undefined);
    reset();
  };

  // ── Password form ───────────────────────────────────────────────────────────
  const {
    register:    registerPw,
    handleSubmit: handleSubmitPw,
    reset:       resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  const onSavePassword = async (data: PasswordFormValues) => {
    try {
      await changePassword(data);
      resetPw();
    } catch {
      // toast already shown by store
    }
  };

  // ── Mobile change form ──────────────────────────────────────────────────────
  const {
    register:    registerMobile,
    handleSubmit: handleSubmitMobile,
    getValues:   getMobileValues,
    formState: { errors: mobileErrors },
  } = useForm<MobileFormValues>({ resolver: zodResolver(mobileSchema) });

  const onRequestOtp = async () => {
    const mobile = getMobileValues("mobile");
    if (!mobile) return;
    try {
      await changeMobileReqOTP({ mobile });
      setOtpSent(true);
    } catch {
      // toast already shown by store
    }
  };

  const onVerifyMobile = async (data: MobileFormValues) => {
    if (!data.code) return;
    try {
      await changeMobileVerify({ mobile: data.mobile, code: data.code });
      setOtpSent(false);
    } catch {
      // toast already shown by store
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">اطلاعات حساب کاربری</h1>
          <p className="text-sm text-gray-400 mt-0.5">اطلاعات شخصی خود را مدیریت کنید</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconPencil size={15} />
            ویرایش
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancelEdit}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <IconX size={15} />
              انصراف
            </button>
            <button
              onClick={handleSubmit(onSaveProfile)}
              disabled={loading.updateProfile}
              className="flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl transition-all duration-200"
            >
              {loading.updateProfile
                ? <IconLoader2 size={15} className="animate-spin" />
                : <IconCheck size={15} />
              }
              ذخیره
            </button>
          </div>
        )}
      </div>

      {/* ── Personal info ── */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-5">
        <SectionTitle>اطلاعات شخصی</SectionTitle>

        {/* Avatar */}
        <AvatarPicker
          userFullName={user?.fullname}
          userPhoneNumber={user?.mobile}
          currentUrl={user?.profilePhoto}
          disabled={!isEditing}
          onChange={setPhotoFile}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="نام و نام خانوادگی" error={errors.fullname?.message} icon={IconUser}>
            <input
              {...register("fullname")}
              disabled={!isEditing}
              placeholder="نام کامل"
              className={inputClass(!!errors.fullname, !isEditing)}
            />
          </Field>

          <Field label="نام کاربری" error={errors.username?.message} icon={IconAt}>
            <input
              {...register("username")}
              disabled={!isEditing}
              placeholder="username"
              className={inputClass(!!errors.username, !isEditing)}
            />
          </Field>

          <Field label="ایمیل" error={errors.email?.message} icon={IconMail}>
            <input
              {...register("email")}
              type="email"
              disabled={!isEditing}
              placeholder="example@email.com"
              className={inputClass(!!errors.email, !isEditing)}
            />
          </Field>

          {/* Mobile — always read-only here, changed via separate section */}
          <Field label="شماره موبایل" error={undefined} icon={IconPhone}>
            <input
              value={user?.mobile ?? ""}
              disabled
              readOnly
              className={inputClass(false, true)}
            />
          </Field>
        </div>
      </div>

      {/* ── Change mobile ── */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-5">
        <SectionTitle>تغییر شماره موبایل</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="شماره موبایل جدید" error={mobileErrors.mobile?.message} icon={IconPhone}>
            <input
              {...registerMobile("mobile")}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              disabled={otpSent}
              className={`${inputClass(!!mobileErrors.mobile, otpSent)} pl-24`}
            />
            {/* Inline send-OTP button */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSubmitMobile(onRequestOtp)}
                disabled={loading.changeMobile}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors duration-150"
              >
                {loading.changeMobile
                  ? <IconLoader2 size={12} className="animate-spin" />
                  : "ارسال کد"
                }
              </button>
            )}
          </Field>

          {otpSent && (
            <Field label="کد تأیید" error={mobileErrors.code?.message} icon={IconCheck}>
              <input
                {...registerMobile("code")}
                placeholder="کد ۶ رقمی"
                maxLength={6}
                className={`${inputClass(!!mobileErrors.code)} pl-24`}
              />
              <button
                type="button"
                onClick={handleSubmitMobile(onVerifyMobile)}
                disabled={loading.changeMobile}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white bg-green-600 hover:bg-green-500 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors duration-150"
              >
                {loading.changeMobile
                  ? <IconLoader2 size={12} className="animate-spin" />
                  : "تأیید"
                }
              </button>
            </Field>
          )}
        </div>

        {otpSent && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <IconPhone size={14} className="text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-600">
              کد تأیید به شماره {getMobileValues("mobile")} ارسال شد
            </p>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="mr-auto text-xs text-blue-400 hover:text-blue-600 transition-colors"
            >
              تغییر شماره
            </button>
          </div>
        )}
      </div>

      {/* ── Change password ── */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-5">
        <SectionTitle>تغییر رمز عبور</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="رمز عبور فعلی" error={pwErrors.currentPassword?.message} icon={IconLock}>
            <input
              {...registerPw("currentPassword")}
              type={showCurrentPw ? "text" : "password"}
              placeholder="رمز فعلی"
              className={`${inputClass(!!pwErrors.currentPassword)} pl-10`}
            />
            <button type="button" onClick={() => setShowCurrentPw((p) => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCurrentPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </Field>

          <Field label="رمز عبور جدید" error={pwErrors.password?.message} icon={IconLock}>
            <input
              {...registerPw("password")}
              type={showNewPw ? "text" : "password"}
              placeholder="رمز جدید"
              className={`${inputClass(!!pwErrors.password)} pl-10`}
            />
            <button type="button" onClick={() => setShowNewPw((p) => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNewPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </Field>

          <Field label="تکرار رمز جدید" error={pwErrors.rePassword?.message} icon={IconLock}>
            <input
              {...registerPw("rePassword")}
              type={showConfirmPw ? "text" : "password"}
              placeholder="تکرار رمز"
              className={`${inputClass(!!pwErrors.rePassword)} pl-10`}
            />
            <button type="button" onClick={() => setShowConfirmPw((p) => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirmPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </Field>
        </div>

        <button
          onClick={handleSubmitPw(onSavePassword)}
          disabled={loading.changePassword}
          className="self-start flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          {loading.changePassword
            ? <IconLoader2 size={15} className="animate-spin" />
            : <IconLock size={15} />
          }
          تغییر رمز عبور
        </button>
      </div>
    </div>
  );
}