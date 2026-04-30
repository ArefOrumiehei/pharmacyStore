/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  IconHeadset,
  IconLoader2,
  IconCircleCheck,
  IconPill,
  IconReceipt,
  IconTruck,
  IconAlertCircle,
  IconQuestionMark,
  IconMessageCircle,
  IconPencil,
} from "@tabler/icons-react";

interface TicketFormValues {
  subject: string;
  customSubject?: string;
  priority: "low" | "medium" | "high";
  body: string;
  relatedOrderId?: string;
}

const SUBJECTS = [
  { value: "prescription", label: "نسخه و داروها", icon: IconPill },
  { value: "order",        label: "سفارش و پیگیری", icon: IconReceipt },
  { value: "delivery",     label: "ارسال و تحویل",  icon: IconTruck },
  { value: "complaint",    label: "شکایت و انتقاد", icon: IconAlertCircle },
  { value: "other",        label: "سایر موارد",     icon: IconQuestionMark },
];

const PRIORITIES = [
  { value: "low",    label: "عادی",  color: "text-gray-500 bg-gray-50 border-gray-200"    },
  { value: "medium", label: "متوسط", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "high",   label: "فوری",  color: "text-rose-600 bg-rose-50 border-rose-200"    },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

export default function SendTicket() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({ defaultValues: { priority: "low" } });

  const selectedSubject  = watch("subject");
  const selectedPriority = watch("priority");
  const isOther          = selectedSubject === "other";

  const onSubmit = useCallback(async (data: TicketFormValues) => {
    try {
      // Replace with your actual API call:
      // await ticketService.create(data);
      await new Promise((r) => setTimeout(r, 1000));
      const mockTicketNo = `TK-${Date.now().toString().slice(-6)}`;
      setTicketNumber(mockTicketNo);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (submitted) {
    return (
      <div className="w-full max-w-lg mx-auto py-16 flex flex-col items-center gap-5 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center">
          <IconCircleCheck size={40} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">تیکت شما ثبت شد</h2>
          <p className="text-sm text-gray-400 mt-1">کارشناسان ما در اسرع وقت پاسخ خواهند داد</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-3">
          <p className="text-xs text-gray-500">شماره پیگیری</p>
          <p className="text-lg font-bold text-blue-800 mt-0.5 tracking-wider">{ticketNumber}</p>
        </div>
        <a href="/profile/tickets" className="mt-2 text-sm font-semibold text-blue-800 underline underline-offset-2">
          مشاهده تیکت‌های من
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-800 flex items-center justify-center flex-shrink-0">
          <IconHeadset size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-blue-800">ارسال تیکت پشتیبانی</h1>
          <p className="text-sm text-gray-400 mt-0.5">مشکل یا سوال خود را با ما در میان بگذارید</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Subject selector */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>موضوع تیکت</SectionTitle>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUBJECTS.map(({ value, label, icon: Icon }) => {
              const isActive = selectedSubject === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setValue("subject", value, { shouldValidate: true });
                    // clear custom subject when switching away from "other"
                    if (value !== "other") setValue("customSubject", "");
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? "border-blue-800 bg-blue-50"
                      : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    isActive ? "bg-blue-800 border-blue-800" : "bg-blue-50 border-blue-100"
                  }`}>
                    <Icon size={18} className={isActive ? "text-white" : "text-blue-800"} />
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? "text-blue-800" : "text-gray-600"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom subject input — shown only when "other" is selected */}
          {isOther && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                موضوع را بنویسید
              </label>
              <div className="relative">
                <IconPencil
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  {...register("customSubject", {
                    required: isOther ? "لطفاً موضوع را بنویسید" : false,
                    minLength: { value: 3, message: "حداقل ۳ کاراکتر وارد کنید" },
                  })}
                  placeholder="موضوع تیکت خود را بنویسید..."
                  autoFocus
                  className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                    errors.customSubject
                      ? "border-rose-200 bg-rose-50/30"
                      : "border-blue-100 bg-blue-50/30"
                  }`}
                />
              </div>
              {errors.customSubject && (
                <p className="text-rose-500 text-xs">{errors.customSubject.message}</p>
              )}
            </div>
          )}

          {/* Hidden input for subject validation */}
          <input
            type="hidden"
            {...register("subject", { required: "لطفاً موضوع را انتخاب کنید" })}
          />
          {errors.subject && (
            <p className="text-rose-500 text-xs">{errors.subject.message}</p>
          )}
        </div>

        {/* Priority + optional order ID */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>اولویت و جزئیات</SectionTitle>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">اولویت</label>
            <div className="flex gap-2">
              {PRIORITIES.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("priority", value)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    selectedPriority === value
                      ? color + " ring-2 ring-offset-1 ring-current"
                      : "border-blue-100 text-gray-400 bg-white hover:bg-blue-50/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              شماره سفارش مرتبط{" "}
              <span className="text-gray-400 font-normal">(اختیاری)</span>
            </label>
            <input
              {...register("relatedOrderId")}
              placeholder="مثلاً ORD-123456"
              className="w-full border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Message body */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
          <SectionTitle>متن پیام</SectionTitle>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              توضیحات کامل مشکل یا سوال خود را بنویسید
            </label>
            <textarea
              {...register("body", {
                required: "متن پیام الزامی است",
                minLength: { value: 20, message: "حداقل ۲۰ کاراکتر وارد کنید" },
              })}
              rows={6}
              placeholder="جزئیات کامل را اینجا بنویسید..."
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 resize-none transition-all duration-200 ${
                errors.body ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
              }`}
            />
            {errors.body && (
              <p className="text-rose-500 text-xs">{errors.body.message}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
        >
          {isSubmitting ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            <>
              <IconMessageCircle size={17} />
              ارسال تیکت
            </>
          )}
        </button>
      </form>
    </div>
  );
}