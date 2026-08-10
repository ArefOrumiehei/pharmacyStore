import { IconShieldLock, IconLoader2 } from "@tabler/icons-react";
import type { UseFormRegister, UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import type { SetPasswordFormValues } from "@/pages/profile/constants/Constants";
import { PasswordField } from "../passwordField/PasswordField";

interface SetPasswordSectionProps {
  register: UseFormRegister<SetPasswordFormValues>;
  handleSubmit: UseFormHandleSubmit<SetPasswordFormValues>;
  errors: FieldErrors<SetPasswordFormValues>;
  loading: boolean;
  onSubmit: (data: SetPasswordFormValues) => void;
}

export function SetPasswordSection({ register, handleSubmit, errors, loading, onSubmit }: SetPasswordSectionProps) {
  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>تنظیم رمز عبور</SectionTitle>
        <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          <IconShieldLock size={13} />
          رمز عبور ندارید
        </span>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <IconShieldLock size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          شما از طریق شماره موبایل وارد شده‌اید و هنوز رمز عبور ندارید. با تنظیم رمز عبور می‌توانید از آن برای ورود
          استفاده کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PasswordField
          label="رمز عبور"
          error={errors.password?.message}
          registration={register("password")}
          placeholder="رمز عبور جدید"
        />
        <PasswordField
          label="تکرار رمز عبور"
          error={errors.rePassword?.message}
          registration={register("rePassword")}
          placeholder="تکرار رمز عبور"
        />
      </div>

      <button
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
        className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
      >
        {loading ? <IconLoader2 size={15} className="animate-spin" /> : <IconShieldLock size={15} />}
        تنظیم رمز عبور
      </button>
    </div>
  );
}