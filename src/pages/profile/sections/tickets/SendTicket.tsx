import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  IconHeadset,
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconMessageCircle,
  IconPencil,
  IconArrowRight,
  IconTag,
  IconFileText,
  IconChevronLeft,
  IconHash,
  IconChevronDown,
} from "@tabler/icons-react";
import { useTicketStore } from "@/store/useTicketStore";
import { useState } from "react";
import { useSiteStore } from "@/store/useSiteStore";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface TicketFormValues {
  subject: string;
  message: string;
  email?: string;
  priority: "low" | "medium" | "high";
}

/* ─────────────────────────────────────────
   PRIORITY CONFIG (UI only — not sent to API)
───────────────────────────────────────── */
const PRIORITIES = [
  { value: "low",    label: "عادی",  subLabel: "پاسخ در ۴۸ ساعت", activeClass: "border-gray-300 bg-gray-50 text-gray-700"    },
  { value: "medium", label: "متوسط", subLabel: "پاسخ در ۲۴ ساعت", activeClass: "border-amber-400 bg-amber-50 text-amber-700"  },
  { value: "high",   label: "فوری",  subLabel: "پاسخ در ۴ ساعت",  activeClass: "border-rose-400 bg-rose-50 text-rose-700"    },
] as const;

/* ─────── SKELETONS ───────────────────── */
function SubjectSkeleton() {
  return <div className="h-11 w-full bg-blue-50 animate-pulse rounded-xl" />;
}

/* ───────── SECTION HEADER ───────────────────── */
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-white" />
      </div>
      <h2 className="text-sm font-bold text-blue-800">{title}</h2>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUCCESS SCREEN
───────────────────────────────────────── */
function SuccessScreen({
  trackingCode,
  onNewTicket,
}: {
  trackingCode: string;
  onNewTicket: () => void;
}) {
  const navigate = useNavigate();

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

      {/* Tracking code */}
      <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <IconHash size={13} />
          <p className="text-xs font-medium">شماره پیگیری تیکت</p>
        </div>
        <p className="text-2xl font-black text-blue-800 tracking-widest mt-0.5">{trackingCode}</p>
        <p className="text-xs text-blue-400 mt-1">این شماره را نزد خود نگه دارید</p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={() => navigate("/profile/tickets")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold text-sm transition-all active:scale-95"
        >
          <IconHeadset size={16} />
          مشاهده تیکت‌های من
        </button>
        <button
          onClick={onNewTicket}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-sm border border-blue-100 transition-all"
        >
          ارسال تیکت جدید
        </button>
      </div>
    </div>
  );
}

/* ─────────── MAIN PAGE ──────────────────── */
export default function SendTicket() {
  const navigate = useNavigate();
  const { submitLoading, submitTicket } = useTicketStore();
  const { fetchTitles, titles, titlesLoading} = useSiteStore();
console.log("ticket titles ->", titles);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({ defaultValues: { priority: "low" } });

  const selectedPriority = watch("priority");

  useEffect(() => {
    fetchTitles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = useCallback(async (data: TicketFormValues) => {
    const code = await submitTicket({
      subject: data.subject,
      message: data.message,
      email:   data.email || undefined,
    });
    if (code) setTrackingCode(code);
  }, [submitTicket]);

  const handleNewTicket = () => {
    setTrackingCode(null);
    reset();
  };

  /* ── Success screen ── */
  if (trackingCode) {
    return <SuccessScreen trackingCode={trackingCode} onNewTicket={handleNewTicket} />;
  }

  /* ── Form ── */
  return (
    <div className="w-full mx-auto py-6" dir="rtl">

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate("/profile/tickets")}
          className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0"
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
          <SectionHeader icon={IconTag} title="موضوع تیکت" />

          {titlesLoading ? (
            <SubjectSkeleton />
          ) : titles.length > 0 ? (
            /* Select list of predefined subjects */
            <div className="relative">
              <IconTag size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                {...register("subject", { required: "لطفاً موضوع را انتخاب کنید" })}
                defaultValue=""
                className={`w-full appearance-none border rounded-xl pr-9 pl-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                  errors.subject ? "border-rose-200 bg-rose-50/30 text-gray-700" : "border-blue-100 bg-blue-50/30 text-gray-700"
                }`}
              >
                <option value="" disabled>موضوع تیکت را انتخاب کنید</option>
                {titles.map(({ titleName, numberOfRow }) => (
                  <option key={numberOfRow} value={titleName}>
                    {titleName}
                  </option>
                ))}
              </select>
              <IconChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          ) : (
            /* Fallback: free-text subject if API returns nothing */
            <div className="relative">
              <IconPencil size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                {...register("subject", { required: "لطفاً موضوع را بنویسید" })}
                placeholder="موضوع تیکت خود را بنویسید..."
                className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                  errors.subject ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
                }`}
              />
            </div>
          )}

          {errors.subject && (
            <p className="text-rose-500 text-xs">{errors.subject.message}</p>
          )}
        </div>

        {/* ── Priority (UI only) ── */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
          <SectionHeader icon={IconAlertCircle} title="اولویت پیگیری" />

          <div className="grid grid-cols-3 gap-2.5">
            {PRIORITIES.map(({ value, label, subLabel, activeClass }) => {
              const isActive = selectedPriority === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("priority", value)}
                  className={`flex flex-col items-center gap-1 py-3.5 px-2 rounded-xl border-2 text-center transition-all duration-200 ${
                    isActive
                      ? activeClass
                      : "border-blue-100 bg-white text-gray-400 hover:bg-blue-50/50 hover:border-blue-200"
                  }`}
                >
                  <span className={`text-sm font-bold ${isActive ? "" : "text-gray-600"}`}>
                    {label}
                  </span>
                  <span className={`text-xs opacity-80 ${isActive ? "" : "text-gray-400"}`}>
                    {subLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            اولویت انتخابی صرفاً راهنمایی است و زمان پاسخ‌دهی توسط تیم پشتیبانی تعیین می‌شود.
          </p>
        </div>

        {/* ── Message + email ── */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
          <SectionHeader icon={IconFileText} title="جزئیات پیام" />

          {/* Optional email */}
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

          {/* Message body */}
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
            {errors.message && (
              <p className="text-rose-500 text-xs">{errors.message.message}</p>
            )}
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={submitLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all shadow-sm shadow-blue-100"
        >
          {submitLoading ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            <><IconMessageCircle size={17} />ارسال تیکت</>
          )}
        </button>
      </form>
    </div>
  );
}