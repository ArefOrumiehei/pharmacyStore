import { useNavigate } from "react-router";
import { IconRefresh, IconArrowLeft, IconCloudOff } from "@tabler/icons-react";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      dir="rtl"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0f9ff 100%)",
      }}
    >
      {/* ── Decorative bg ── */}
      <div
        className="absolute top-[-100px] left-[-100px] w-[360px] h-[360px] rounded-full opacity-[0.15] pointer-events-none"
        style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-80px] right-[-80px] w-[260px] h-[260px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)" }}
      />

      {/* ── Card ── */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-sm border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/30 px-8 py-10 flex flex-col items-center gap-7">

        {/* ── Icon ── */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-100 animate-[spin_14s_linear_infinite]" />
          <div className="w-16 h-16 rounded-2xl bg-blue-800 flex items-center justify-center shadow-md shadow-blue-300/30">
            <IconCloudOff size={30} className="text-white" strokeWidth={1.5} />
          </div>
          {/* Pulse dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-400 border-2 border-white shadow animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* ── Text ── */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-xl font-extrabold text-blue-800">
            مشکلی پیش آمد
          </h1>
          <p className="text-sm text-gray-500 leading-7">
            سرور با یک خطای غیرمنتظره مواجه شد.
            <br />
            لطفاً لحظاتی دیگر دوباره تلاش کنید.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-blue-50" />

        {/* ── Actions ── */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-200"
          >
            <IconRefresh size={16} />
            تلاش مجدد
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-blue-800 font-semibold text-sm transition-all duration-150"
          >
            <IconArrowLeft size={16} />
            بازگشت به صفحه قبل
          </button>
        </div>

        {/* ── Footer ── */}
        <p className="text-xs text-gray-400 text-center leading-6">
          اگر مشکل ادامه داشت از طریق
          <span className="text-blue-700 font-medium mx-1">support@pharmaplus.ir</span>
          با ما در ارتباط باشید.
        </p>
      </div>

      <p className="mt-8 text-xs text-blue-300 font-medium tracking-wide">
        فارماپلاس — داروخانه آنلاین شما
      </p>
    </div>
  );
}