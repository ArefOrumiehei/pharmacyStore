/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconId,
  IconCalendar,
  IconPencil,
  IconCheck,
  IconX,
  IconLoader2,
  IconLock,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";

const accountSchema = z.object({
  fullname: z.string().min(2, "حداقل ۲ کاراکتر"),
  mobile: z.string().min(10, "شماره موبایل معتبر وارد کنید"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  nationalCode: z.string().length(10, "کد ملی باید ۱۰ رقم باشد").optional().or(z.literal("")),
  birthDate: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
  newPassword: z.string().min(6, "حداقل ۶ کاراکتر"),
  confirmPassword: z.string().min(6, "حداقل ۶ کاراکتر"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path: ["confirmPassword"],
});

type AccountFormValues = z.infer<typeof accountSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

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
        <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean, disabled?: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" :
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

export default function Account() {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullname: user?.fullname ?? "",
      mobile: user?.mobile ?? "",
      email: user?.email ?? "",
      nationalCode: user?.nationalCode ?? "",
      birthDate: user?.birthDate ?? "",
    },
  });

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullname ?? "",
        mobile: user.mobile ?? "",
        email: user.email ?? "",
        nationalCode: user.nationalCode ?? "",
        birthDate: user.birthDate ?? "",
      });
    }
  }, [user, reset]);

  const onSave = async (data: AccountFormValues) => {
    setIsSaving(true);
    try {
      // await updateUser(data);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  const onSavePassword = async (data: PasswordFormValues) => {
    setPwSaving(true);
    try {
      // await changePassword(data);
      console.log("change password", data);
      setPwSuccess(true);
      resetPw();
      setTimeout(() => setPwSuccess(false), 3000);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
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
              onClick={handleSubmit(onSave)}
              disabled={isSaving}
              className="flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl transition-all duration-200"
            >
              {isSaving ? <IconLoader2 size={15} className="animate-spin" /> : <IconCheck size={15} />}
              ذخیره
            </button>
          </div>
        )}
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3">
          <IconCheck size={16} />
          اطلاعات با موفقیت ذخیره شد
        </div>
      )}

      {/* Personal info */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <SectionTitle>اطلاعات شخصی</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <Field label="نام و نام خانوادگی" error={errors.fullname?.message} icon={IconUser}>
            <input
              {...register("fullname")}
              disabled={!isEditing}
              placeholder="نام کامل"
              className={inputClass(!!errors.fullname, !isEditing)}
            />
          </Field>

          <Field label="شماره موبایل" error={errors.mobile?.message} icon={IconPhone}>
            <input
              {...register("mobile")}
              disabled={!isEditing}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              className={inputClass(!!errors.mobile, !isEditing)}
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

          <Field label="کد ملی" error={errors.nationalCode?.message} icon={IconId}>
            <input
              {...register("nationalCode")}
              disabled={!isEditing}
              placeholder="۱۲۳۴۵۶۷۸۹۰"
              className={inputClass(!!errors.nationalCode, !isEditing)}
            />
          </Field>

          <Field label="تاریخ تولد" error={errors.birthDate?.message} icon={IconCalendar}>
            <input
              {...register("birthDate")}
              disabled={!isEditing}
              placeholder="۱۳۷۰/۰۱/۰۱"
              className={inputClass(!!errors.birthDate, !isEditing)}
            />
          </Field>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <SectionTitle>تغییر رمز عبور</SectionTitle>

        {pwSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mt-4">
            <IconCheck size={16} />
            رمز عبور با موفقیت تغییر کرد
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <Field label="رمز عبور فعلی" error={pwErrors.currentPassword?.message} icon={IconLock}>
            <input
              {...registerPw("currentPassword")}
              type={showCurrentPw ? "text" : "password"}
              placeholder="رمز فعلی"
              className={`${inputClass(!!pwErrors.currentPassword)} pl-10`}
            />
            <button type="button" onClick={() => setShowCurrentPw(p => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCurrentPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </Field>

          <Field label="رمز عبور جدید" error={pwErrors.newPassword?.message} icon={IconLock}>
            <input
              {...registerPw("newPassword")}
              type={showNewPw ? "text" : "password"}
              placeholder="رمز جدید"
              className={`${inputClass(!!pwErrors.newPassword)} pl-10`}
            />
            <button type="button" onClick={() => setShowNewPw(p => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNewPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </Field>

          <Field label="تکرار رمز جدید" error={pwErrors.confirmPassword?.message} icon={IconLock}>
            <input
              {...registerPw("confirmPassword")}
              type={showConfirmPw ? "text" : "password"}
              placeholder="تکرار رمز"
              className={`${inputClass(!!pwErrors.confirmPassword)} pl-10`}
            />
            <button type="button" onClick={() => setShowConfirmPw(p => !p)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirmPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
            </button>
          </Field>
        </div>

        <button
          onClick={handleSubmitPw(onSavePassword)}
          disabled={pwSaving}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          {pwSaving ? <IconLoader2 size={15} className="animate-spin" /> : <IconLock size={15} />}
          تغییر رمز عبور
        </button>
      </div>
    </div>
  );
}