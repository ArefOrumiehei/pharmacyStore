import { IconFileText } from "@tabler/icons-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { SectionHeader } from "../sectionHeader/SectionHeader";
import type { TicketFormValues } from "@/pages/profile/constants/Constants";

interface MessageFieldsProps {
  register: UseFormRegister<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
}

export function MessageFields({ register, errors }: MessageFieldsProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <SectionHeader icon={IconFileText} title="جزئیات پیام" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">
          ایمیل
          <span className="text-gray-400 font-normal mr-1">(اختیاری — برای دریافت پاسخ)</span>
        </label>
        <input
          {...register("email", {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "ایمیل معتبر وارد کنید" },
          })}
          type="email"
          placeholder="example@email.com"
          className={`w-full sm:w-1/2 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
            errors.email ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
          }`}
        />
        {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">
          متن پیام
          <span className="text-rose-400 mr-1">*</span>
        </label>
        <textarea
          {...register("message", {
            required: "متن پیام الزامی است",
            minLength: { value: 20, message: "حداقل ۲۰ کاراکتر وارد کنید" },
          })}
          rows={6}
          placeholder="مشکل یا سوال خود را با جزئیات کامل توضیح دهید..."
          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 resize-none transition-all duration-200 leading-7 ${
            errors.message ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
          }`}
        />
        {errors.message && <p className="text-rose-500 text-xs">{errors.message.message}</p>}
      </div>
    </div>
  );
}