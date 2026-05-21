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
  IconShieldLock,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import { IMAGE_BASE } from "@/apis/apiInstance";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  fullname: z.string().min(2, "حداقل ۲ کاراکتر").max(100, "حداکثر ۱۰۰ کاراکتر"),
  username: z.string().min(2, "حداقل ۲ کاراکتر").max(50,  "حداکثر ۵۰ کاراکتر"),
  email:    z.string().email("ایمیل معتبر وارد کنید").optional().or(z.literal("")),
});

// Change password — requires current password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
  password:        z.string().min(6, "حداقل ۶ کاراکتر"),
  rePassword:      z.string().min(6, "حداقل ۶ کاراکتر"),
}).refine((d) => d.password === d.rePassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path:    ["rePassword"],
});

// Set password — no current password needed
const setPasswordSchema = z.object({
  password:  z.string().min(6, "حداقل ۶ کاراکتر"),
  rePassword: z.string().min(6, "حداقل ۶ کاراکتر"),
}).refine((d) => d.password === d.rePassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path:    ["rePassword"],
});

const mobileSchema = z.object({
  mobile: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  code:   z.string().length(6, "کد ۶ رقمی را وارد کنید").optional(),
});

type ProfileFormValues       = z.infer<typeof profileSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type SetPasswordFormValues    = z.infer<typeof setPasswordSchema>;
type MobileFormValues         = z.infer<typeof mobileSchema>;

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

// ─── Password field with show/hide toggle ─────────────────────────────────────

function PasswordField({
  label, error, registration, placeholder,
}: {
  label: string;
  error?: string;
  registration: object;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} error={error} icon={IconLock}>
      <input
        {...registration}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`${inputClass(!!error)} pl-10`}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
      </button>
    </Field>
  );
}

// ─── Avatar picker ────────────────────────────────────────────────────────────

function AvatarPicker({
  userFullName, userPhoneNumber, currentUrl, disabled, onChange,
}: {
  userFullName?: string;
  userPhoneNumber?: string;
  currentUrl?: string;
  disabled: boolean;
  onChange: (file: File) => void;
}) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
            : <IconUser size={32} className="text-blue-200" />}
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-xl bg-blue-800 hover:bg-blue-700 border-2 border-white flex items-center justify-center shadow-sm transition-colors"
          >
            <IconCamera size={13} className="text-white" />
          </button>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-gray-700">{userFullName || userPhoneNumber}</p>
        {!disabled && <p className="text-xs text-gray-400">JPG یا PNG، حداکثر ۱ مگابایت</p>}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Account() {
  const {
    user, loading,
    updateProfile,
    changePassword, setPassword,
    changeMobileReqOTP, changeMobileVerify,
  } = useUserStore();

  const [isEditing,  setIsEditing]  = useState(false);
  const [photoFile,  setPhotoFile]  = useState<File | undefined>(undefined);
  const [otpSent,    setOtpSent]    = useState(false);

  // Whether user has a password — drives which password section to show
  const hasPassword = user?.hasPassword ?? false;

  // ── Profile form ────────────────────────────────────────────────────────────
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullname: user?.fullname ?? "", username: user?.username ?? "", email: user?.email ?? "" },
  });

  useEffect(() => {
    if (user) reset({ fullname: user.fullname ?? "", username: user.username ?? "", email: user.email ?? "" });
  }, [user, reset]);

  const onSaveProfile = async (data: ProfileFormValues) => {
    try {
      await updateProfile({ fullname: data.fullname, username: data.username, email: data.email || undefined, profilePhoto: photoFile });
      setIsEditing(false);
      setPhotoFile(undefined);
    } catch { /* toast shown by store */ }
  };

  const onCancelEdit = () => { setIsEditing(false); setPhotoFile(undefined); reset(); };

  // ── Change password form (has password) ────────────────────────────────────
  const {
    register: registerCp,
    handleSubmit: handleSubmitCp,
    reset: resetCp,
    formState: { errors: cpErrors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onChangePassword = async (data: ChangePasswordFormValues) => {
    try { await changePassword(data); resetCp(); } catch { /* toast shown by store */ }
  };

  // ── Set password form (no password yet) ────────────────────────────────────
  const {
    register: registerSp,
    handleSubmit: handleSubmitSp,
    reset: resetSp,
    formState: { errors: spErrors },
  } = useForm<SetPasswordFormValues>({ resolver: zodResolver(setPasswordSchema) });

  const onSetPassword = async (data: SetPasswordFormValues) => {
    try { await setPassword(data); resetSp(); } catch { /* toast shown by store */ }
  };

  // ── Mobile form ─────────────────────────────────────────────────────────────
  const {
    register: registerMobile,
    handleSubmit: handleSubmitMobile,
    getValues: getMobileValues,
    formState: { errors: mobileErrors },
  } = useForm<MobileFormValues>({ resolver: zodResolver(mobileSchema) });

  const onRequestOtp = async () => {
    const mobile = getMobileValues("mobile");
    if (!mobile) return;
    try { await changeMobileReqOTP({ mobile }); setOtpSent(true); } catch { /* toast shown by store */ }
  };

  const onVerifyMobile = async (data: MobileFormValues) => {
    if (!data.code) return;
    try { await changeMobileVerify({ mobile: data.mobile, code: data.code }); setOtpSent(false); } catch { /* toast shown by store */ }
  };

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">اطلاعات حساب کاربری</h1>
          <p className="text-sm text-gray-400 mt-0.5">اطلاعات شخصی خود را مدیریت کنید</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconPencil size={15} />
            ویرایش
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancelEdit}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <IconX size={15} />
              انصراف
            </button>
            <button
              onClick={handleSubmit(onSaveProfile)}
              disabled={loading.updateProfile}
              className="flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl transition-all duration-200"
            >
              {loading.updateProfile ? <IconLoader2 size={15} className="animate-spin" /> : <IconCheck size={15} />}
              ذخیره
            </button>
          </div>
        )}
      </div>

      {/* ── Personal info ── */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-5">
        <SectionTitle>اطلاعات شخصی</SectionTitle>

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

          <Field label="شماره موبایل" error={undefined} icon={IconPhone}>
            <input value={user?.mobile ?? ""} disabled readOnly className={inputClass(false, true)} />
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
            {!otpSent && (
              <button
                type="button"
                onClick={handleSubmitMobile(onRequestOtp)}
                disabled={loading.changeMobile}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors"
              >
                {loading.changeMobile ? <IconLoader2 size={12} className="animate-spin" /> : "ارسال کد"}
              </button>
            )}
          </Field>

          {otpSent && (
            <Field label="کد تأیید" error={mobileErrors.code?.message} icon={IconCheck}>
              <input
                {...registerMobile("code")}
                placeholder="کد ۵ رقمی"
                maxLength={5}
                className={`${inputClass(!!mobileErrors.code)} pl-24`}
              />
              <button
                type="button"
                onClick={handleSubmitMobile(onVerifyMobile)}
                disabled={loading.changeMobile}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white bg-green-600 hover:bg-green-500 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors"
              >
                {loading.changeMobile ? <IconLoader2 size={12} className="animate-spin" /> : "تأیید"}
              </button>
            </Field>
          )}
        </div>

        {otpSent && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <IconPhone size={14} className="text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-600">کد تأیید به شماره {getMobileValues("mobile")} ارسال شد</p>
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

      {/* ── Password section — conditional on hasPassword ── */}
      {hasPassword ? (
        // ── CHANGE password (user already has one) ──
        <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <SectionTitle>تغییر رمز عبور</SectionTitle>
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <IconShieldCheck size={13} />
              رمز عبور فعال
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PasswordField
              label="رمز عبور فعلی"
              error={cpErrors.currentPassword?.message}
              registration={registerCp("currentPassword")}
              placeholder="رمز فعلی"
            />
            <PasswordField
              label="رمز عبور جدید"
              error={cpErrors.password?.message}
              registration={registerCp("password")}
              placeholder="رمز جدید"
            />
            <PasswordField
              label="تکرار رمز جدید"
              error={cpErrors.rePassword?.message}
              registration={registerCp("rePassword")}
              placeholder="تکرار رمز"
            />
          </div>

          <button
            onClick={handleSubmitCp(onChangePassword)}
            disabled={loading.changePassword}
            className="self-start flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            {loading.changePassword ? <IconLoader2 size={15} className="animate-spin" /> : <IconLock size={15} />}
            تغییر رمز عبور
          </button>
        </div>
      ) : (
        // ── SET password (user has no password yet) ──
        <div className="bg-white border border-amber-100 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <SectionTitle>تنظیم رمز عبور</SectionTitle>
            <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <IconShieldLock size={13} />
              رمز عبور ندارید
            </span>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <IconShieldLock size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              شما از طریق شماره موبایل وارد شده‌اید و هنوز رمز عبور ندارید.
              با تنظیم رمز عبور می‌توانید از آن برای ورود استفاده کنید.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordField
              label="رمز عبور"
              error={spErrors.password?.message}
              registration={registerSp("password")}
              placeholder="رمز عبور جدید"
            />
            <PasswordField
              label="تکرار رمز عبور"
              error={spErrors.rePassword?.message}
              registration={registerSp("rePassword")}
              placeholder="تکرار رمز عبور"
            />
          </div>

          <button
            onClick={handleSubmitSp(onSetPassword)}
            disabled={loading.setPassword}
            className="self-start flex items-center gap-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            {loading.setPassword ? <IconLoader2 size={15} className="animate-spin" /> : <IconShieldLock size={15} />}
            تنظیم رمز عبور
          </button>
        </div>
      )}
    </div>
  );
}