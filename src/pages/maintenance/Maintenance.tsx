import { Link } from "react-router";
import {
  IconHeadset,
  IconRefresh,
  IconClock,
  IconShieldCheck,
} from "@tabler/icons-react";

export default function Maintenance() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      dir="rtl"
      style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eff6ff 100%)" }}
    >
      {/* ── Decorative background circles ── */}
      <div
        className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)" }}
      />

      {/* ── Card ── */}
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-sm border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/40 px-8 py-10 flex flex-col items-center gap-8">

        {/* ── Icon cluster ── */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200 animate-[spin_12s_linear_infinite]" />
          {/* Inner bg */}
          <div className="w-20 h-20 rounded-2xl bg-blue-800 flex items-center justify-center shadow-lg shadow-blue-300/40">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-[pulse_2s_ease-in-out_infinite]"
            >
              {/* Wrench + gear icon hand-crafted */}
              <circle cx="18" cy="18" r="10" stroke="white" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="18" cy="18" r="5" fill="white" fillOpacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="#1e40af" />
              <line x1="18" y1="4" x2="18" y2="8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18" y1="28" x2="18" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="4" y1="18" x2="8" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="28" y1="18" x2="32" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          {/* Status dot */}
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* ── Text ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-extrabold text-blue-800 leading-snug">
            در حال بهبود خدمات هستیم
          </h1>
          <p className="text-sm text-gray-500 leading-7 max-w-sm">
            سایت فارماپلاس در حال انجام عملیات فنی است.
            <br />
            تیم ما در کوتاه‌ترین زمان ممکن مشکل را برطرف می‌کند.
            <br />
            از صبر و همراهی شما سپاسگزاریم.
          </p>
        </div>

        {/* ── Status pills ── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-2 rounded-xl">
            <IconClock size={14} className="text-blue-500" />
            بازگشایی به زودی
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3.5 py-2 rounded-xl">
            <IconShieldCheck size={14} className="text-emerald-500" />
            اطلاعات شما محفوظ است
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-blue-50" />

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-200"
          >
            <IconRefresh size={16} />
            تلاش مجدد
          </button>

          <Link
            to="/contactus"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-blue-800 font-semibold text-sm transition-all duration-150"
          >
            <IconHeadset size={16} />
            تماس با پشتیبانی
          </Link>
        </div>

        {/* ── Footer note ── */}
        <p className="text-xs text-gray-400 text-center leading-6">
          اگر مشکل ادامه داشت، می‌توانید از طریق
          <span className="text-blue-700 font-medium mx-1">support@pharmaplus.ir</span>
          با ما در ارتباط باشید.
        </p>
      </div>

      {/* ── Brand mark ── */}
      <p className="mt-8 text-xs text-blue-300 font-medium tracking-wide">
        فارماپلاس — داروخانه آنلاین شما
      </p>
    </div>
  );
}