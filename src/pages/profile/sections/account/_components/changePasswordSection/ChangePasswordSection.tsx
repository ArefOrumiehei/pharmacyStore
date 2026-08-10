import { IconShieldCheck, IconLock, IconLoader2 } from "@tabler/icons-react";
import type { UseFormRegister, UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import type { ChangePasswordFormValues } from "@/pages/profile/constants/Constants";
import { PasswordField } from "../passwordField/PasswordField";

interface ChangePasswordSectionProps {
  register: UseFormRegister<ChangePasswordFormValues>;
  handleSubmit: UseFormHandleSubmit<ChangePasswordFormValues>;
  errors: FieldErrors<ChangePasswordFormValues>;
  loading: boolean;
  onSubmit: (data: ChangePasswordFormValues) => void;
}

export function ChangePasswordSection({ register, handleSubmit, errors, loading, onSubmit }: ChangePasswordSectionProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>تغییر رمز عبور</SectionTitle>
        <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          <IconShieldCheck size={13} />
          رمز عبور فعال
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PasswordField
          label="رمز عبور فعلی"
          error={errors.currentPassword?.message}
          registration={register("currentPassword")}
          placeholder="رمز فعلی"
        />
        <PasswordField
          label="رمز عبور جدید"
          error={errors.password?.message}
          registration={register("password")}
          placeholder="رمز جدید"
        />
        <PasswordField
          label="تکرار رمز جدید"
          error={errors.rePassword?.message}
          registration={register("rePassword")}
          placeholder="تکرار رمز"
        />
      </div>

      <button
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
        className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200"
      >
        {loading ? <IconLoader2 size={15} className="animate-spin" /> : <IconLock size={15} />}
        تغییر رمز عبور
      </button>
    </div>
  );
}