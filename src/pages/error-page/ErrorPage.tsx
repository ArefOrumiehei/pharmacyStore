import { IconRefresh, IconArrowRight, IconHeadset, IconAlertTriangle } from "@tabler/icons-react";

interface ErrorPageProps {
  error?: Error;
  onReset?: () => void;
}

export default function ErrorPage({ error, onReset }: ErrorPageProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      dir="rtl"
      style={{ background: "linear-gradient(135deg, #fff7ed 0%, #f8fafc 50%, #fff7ed 100%)" }}
    >
      {/* ── Decorative bg ── */}
      <div
        className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ea580c 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-80px] left-[-80px] w-[280px] h-[280px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ea580c 0%, transparent 70%)" }}
      />

      {/* ── Card ── */}
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl shadow-xl shadow-orange-100/40 px-8 py-10 flex flex-col items-center gap-8">

        {/* ── Icon ── */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-200 animate-[spin_15s_linear_infinite]" />
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-300/40">
            <IconAlertTriangle size={36} className="text-white" strokeWidth={1.5} />
          </div>
          {/* Error dot */}
          <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* ── Text ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-extrabold text-gray-800 leading-snug">
            مشکلی پیش آمد
          </h1>
          <p className="text-sm text-gray-500 leading-7 max-w-sm">
            یک خطای غیرمنتظره در صفحه رخ داده است.
            <br />
            این مشکل به صورت خودکار گزارش شد و تیم ما آن را بررسی می‌کند.
            <br />
            می‌توانید صفحه را مجدداً بارگذاری کنید.
          </p>
        </div>

        {/* ── Error detail (dev/debugging aid) ── */}
        {error?.message && (
          <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
            <p className="text-xs font-semibold text-gray-400 mb-1.5">جزئیات خطا</p>
            <p className="text-xs font-mono text-rose-500 break-all leading-5">
              {error.message}
            </p>
          </div>
        )}

        {/* ── Status pills ── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3.5 py-2 rounded-xl">
            <IconAlertTriangle size={13} className="text-orange-400" />
            خطای غیرمنتظره
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-2 rounded-xl">
            <IconHeadset size={13} className="text-blue-400" />
            تیم فنی آگاه شد
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-orange-200" />

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-orange-200"
          >
            <IconRefresh size={16} />
            بارگذاری مجدد
          </button>

          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-orange-50 border border-orange-100 text-gray-700 font-semibold text-sm transition-all duration-150"
          >
            <IconArrowRight size={16} />
            بازگشت به صفحه اصلی
          </a>

          <a
            href="/contactus"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-orange-50 border border-orange-100 text-orange-600 font-semibold text-sm transition-all duration-150"
          >
            <IconHeadset size={16} />
            تماس با پشتیبانی
          </a>
        </div>

        {/* ── Footer note ── */}
        <p className="text-xs text-gray-400 text-center leading-6">
          اگر مشکل ادامه داشت از طریق
          <span className="text-orange-600 font-medium mx-1">support@pharmaplus.ir</span>
          با ما در ارتباط باشید.
        </p>
      </div>

      {/* ── Brand ── */}
      <p className="mt-8 text-xs text-orange-300 font-medium tracking-wide">
        فارماپلاس — داروخانه آنلاین شما
      </p>
    </div>
  );
}