import { IconPhone, IconCheck, IconLoader2 } from "@tabler/icons-react";
import type { UseFormRegister, UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import { inputClass, type MobileFormValues } from "@/pages/profile/constants/Constants";
import { Field } from "../field/Field";

interface ChangeMobileSectionProps {
  registerMobile: UseFormRegister<MobileFormValues>;
  handleSubmitMobile: UseFormHandleSubmit<MobileFormValues>;
  mobileErrors: FieldErrors<MobileFormValues>;
  otpSent: boolean;
  sentToMobile?: string;
  loading: boolean;
  onRequestOtp: () => void;
  onVerifyMobile: (data: MobileFormValues) => void;
  onChangeNumber: () => void;
}

export function ChangeMobileSection({
  registerMobile,
  handleSubmitMobile,
  mobileErrors,
  otpSent,
  sentToMobile,
  loading,
  onRequestOtp,
  onVerifyMobile,
  onChangeNumber,
}: ChangeMobileSectionProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      <SectionTitle>تغییر شماره موبایل</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="شماره موبایل جدید" error={mobileErrors.mobile?.message} icon={IconPhone}>
          <input
            {...registerMobile("mobile")}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            disabled={otpSent}
            className={`${inputClass(!!mobileErrors.mobile, otpSent)} pl-20 sm:pl-24`}
          />
          {!otpSent && (
            <button
              type="button"
              onClick={handleSubmitMobile(onRequestOtp)}
              disabled={loading}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
            >
              {loading ? <IconLoader2 size={12} className="animate-spin" /> : "ارسال کد"}
            </button>
          )}
        </Field>

        {otpSent && (
          <Field label="کد تأیید" error={mobileErrors.code?.message} icon={IconCheck}>
            <input
              {...registerMobile("code")}
              placeholder="کد ۵ رقمی"
              maxLength={5}
              className={`${inputClass(!!mobileErrors.code)} pl-20 sm:pl-24`}
            />
            <button
              type="button"
              onClick={handleSubmitMobile(onVerifyMobile)}
              disabled={loading}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs font-semibold text-white bg-green-600 hover:bg-green-500 disabled:opacity-60 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
            >
              {loading ? <IconLoader2 size={12} className="animate-spin" /> : "تأیید"}
            </button>
          </Field>
        )}
      </div>

      {otpSent && (
        <div className="flex flex-wrap items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <IconPhone size={14} className="text-blue-400 flex-shrink-0" />
          <p className="text-xs text-blue-600">کد تأیید به شماره {sentToMobile} ارسال شد</p>
          <button
            type="button"
            onClick={onChangeNumber}
            className="mr-auto text-xs text-blue-400 hover:text-blue-600 transition-colors"
          >
            تغییر شماره
          </button>
        </div>
      )}
    </div>
  );
}