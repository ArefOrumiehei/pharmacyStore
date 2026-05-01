/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
  IconArrowRight,
  IconTag,
  IconFileText,
  IconChevronLeft,
} from "@tabler/icons-react";

interface TicketFormValues {
  subject: string;
  customSubject?: string;
  priority: "low" | "medium" | "high";
  body: string;
  relatedOrderId?: string;
}

const SUBJECTS = [
  { value: "prescription", label: "نسخه و داروها", icon: IconPill,         desc: "سوال درباره نسخه یا دارو" },
  { value: "order",        label: "سفارش و پیگیری", icon: IconReceipt,      desc: "وضعیت و پیگیری سفارش"    },
  { value: "delivery",     label: "ارسال و تحویل",  icon: IconTruck,        desc: "مشکل در ارسال مرسوله"    },
  { value: "complaint",    label: "شکایت و انتقاد", icon: IconAlertCircle,  desc: "انتقاد یا پیشنهاد"       },
  { value: "other",        label: "سایر موارد",     icon: IconQuestionMark, desc: "هر موضوع دیگری"          },
];

const PRIORITIES = [
  { value: "low",    label: "عادی",  subLabel: "پاسخ در ۴۸ ساعت",  color: "text-gray-600",  activeBg: "bg-gray-50 border-gray-300"    },
  { value: "medium", label: "متوسط", subLabel: "پاسخ در ۲۴ ساعت",  color: "text-amber-600", activeBg: "bg-amber-50 border-amber-400"  },
  { value: "high",   label: "فوری",  subLabel: "پاسخ در ۴ ساعت",   color: "text-rose-600",  activeBg: "bg-rose-50 border-rose-400"    },
] as const;

export default function SendTicket() {
  const navigate = useNavigate();
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
      // await ticketService.create(data);
      await new Promise((r) => setTimeout(r, 1000));
      const mockTicketNo = `TK-${Date.now().toString().slice(-6)}`;
      setTicketNumber(mockTicketNo);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto py-16 flex flex-col items-center gap-6 text-center" dir="rtl">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-green-50 border-2 border-green-100 flex items-center justify-center">
            <IconCircleCheck size={48} className="text-green-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
            <IconHeadset size={16} className="text-white" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-gray-800">تیکت ثبت شد!</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            کارشناسان ما بررسی می‌کنند و در اسرع وقت پاسخ می‌دهند
          </p>
        </div>

        <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-1">
          <p className="text-xs text-gray-400 font-medium">شماره پیگیری تیکت</p>
          <p className="text-2xl font-black text-blue-800 tracking-widest mt-1">{ticketNumber}</p>
          <p className="text-xs text-blue-400 mt-1">این شماره را نزد خود نگه دارید</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => navigate("/profile/tickets")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-150 active:scale-95"
          >
            <IconHeadset size={16} />
            مشاهده تیکت‌های من
          </button>
          <button
            onClick={() => { setSubmitted(false); setTicketNumber(""); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-sm border border-blue-100 transition-all duration-150"
          >
            ارسال تیکت جدید
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full mx-auto py-6" dir="rtl">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate("/profile/tickets")}
          className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors duration-150 flex-shrink-0"
        >
          <IconArrowRight size={17} className="text-blue-800" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-blue-800 flex items-center justify-center flex-shrink-0">
            <IconHeadset size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-800">ارسال تیکت پشتیبانی</h1>
            <p className="text-xs text-gray-400 mt-0.5">مشکل یا سوال خود را با ما در میان بگذارید</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
          <span
            className="hover:text-blue-800 cursor-pointer transition-colors"
            onClick={() => navigate("/profile/tickets")}
          >
            تیکت‌ها
          </span>
          <IconChevronLeft size={12} />
          <span className="text-blue-800 font-medium">تیکت جدید</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* ── Subject ── */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
              <IconTag size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-blue-800">موضوع تیکت</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SUBJECTS.map(({ value, label, icon: Icon, desc }) => {
              const isActive = selectedSubject === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setValue("subject", value, { shouldValidate: true });
                    if (value !== "other") setValue("customSubject", "");
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-right transition-all duration-200 ${
                    isActive
                      ? "border-blue-800 bg-blue-50 shadow-sm"
                      : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                    isActive ? "bg-blue-800 border-blue-800" : "bg-blue-50 border-blue-100"
                  }`}>
                    <Icon size={17} className={isActive ? "text-white" : "text-blue-800"} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? "text-blue-800" : "text-gray-700"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{desc}</p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-blue-800 flex-shrink-0 mr-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom subject */}
          {isOther && (
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-xs font-medium text-gray-600">موضوع دلخواه را بنویسید</label>
              <div className="relative">
                <IconPencil size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  {...register("customSubject", {
                    required: isOther ? "لطفاً موضوع را بنویسید" : false,
                    minLength: { value: 3, message: "حداقل ۳ کاراکتر وارد کنید" },
                  })}
                  placeholder="موضوع تیکت خود را بنویسید..."
                  autoFocus
                  className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                    errors.customSubject ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
                  }`}
                />
              </div>
              {errors.customSubject && (
                <p className="text-rose-500 text-xs">{errors.customSubject.message}</p>
              )}
            </div>
          )}

          <input type="hidden" {...register("subject", { required: "لطفاً موضوع را انتخاب کنید" })} />
          {errors.subject && <p className="text-rose-500 text-xs">{errors.subject.message}</p>}
        </div>

        {/* ── Priority ── */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
              <IconAlertCircle size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-blue-800">اولویت پیگیری</h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {PRIORITIES.map(({ value, label, subLabel, color, activeBg }) => {
              const isActive = selectedPriority === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("priority", value)}
                  className={`flex flex-col items-center gap-1 py-3.5 px-2 rounded-xl border-2 text-center transition-all duration-200 ${
                    isActive
                      ? `${activeBg} ${color}`
                      : "border-blue-100 bg-white text-gray-400 hover:bg-blue-50/50 hover:border-blue-200"
                  }`}
                >
                  <span className={`text-sm font-bold ${isActive ? color : "text-gray-600"}`}>{label}</span>
                  <span className={`text-xs ${isActive ? color : "text-gray-400"} opacity-80`}>{subLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Order ID + Message ── */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
              <IconFileText size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-blue-800">جزئیات پیام</h2>
          </div>

          {/* Related order */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              شماره سفارش مرتبط
              <span className="text-gray-400 font-normal mr-1">(اختیاری)</span>
            </label>
            <input
              {...register("relatedOrderId")}
              placeholder="مثلاً ORD-123456"
              className="w-full sm:w-1/2 border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              متن پیام
              <span className="text-rose-400 mr-1">*</span>
            </label>
            <textarea
              {...register("body", {
                required: "متن پیام الزامی است",
                minLength: { value: 20, message: "حداقل ۲۰ کاراکتر وارد کنید" },
              })}
              rows={6}
              placeholder="مشکل یا سوال خود را با جزئیات کامل توضیح دهید..."
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 resize-none transition-all duration-200 leading-relaxed ${
                errors.body ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
              }`}
            />
            {errors.body && <p className="text-rose-500 text-xs">{errors.body.message}</p>}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          {/* <button
            type="button"
            onClick={() => navigate("/profile/tickets")}
            className="flex flex-1 items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 font-semibold text-sm transition-all duration-150 active:scale-95 flex-shrink-0"
          >
            <IconArrowRight size={16} />
            بازگشت
          </button> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
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
        </div>
      </form>
    </div>
  );
}