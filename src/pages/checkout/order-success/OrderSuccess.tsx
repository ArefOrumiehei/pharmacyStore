import { useLocation, useNavigate, Link } from "react-router";
import {
  IconCircleCheck,
  IconClock,
  IconReceipt,
  IconHeadset,
  IconHome,
  IconShoppingBag,
  IconCreditCard,
  IconHash,
} from "@tabler/icons-react";

interface OrderSuccessState {
  orderId?: number;
  payMethod?: 1 | 2;
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state as OrderSuccessState | undefined;

  // Guard — if landed here directly without state, send home
  if (!state?.orderId) {
    navigate("/", { replace: true });
    return null;
  }

  const { orderId } = state;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      dir="rtl"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0fdf4 100%)" }}
    >
      {/* ── Decorative bg ── */}
      <div
        className="absolute top-[-100px] right-[-100px] w-[360px] h-[360px] rounded-full opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, #16a34a 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-80px] left-[-80px] w-[260px] h-[260px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #16a34a 0%, transparent 70%)" }}
      />

      {/* ── Card ── */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl shadow-xl shadow-green-100/30 px-8 py-10 flex flex-col items-center gap-7">

        {/* ── Icon ── */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-200 animate-[spin_16s_linear_infinite]" />
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-300/40">
            <IconCircleCheck size={40} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* ── Title ── */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-2xl font-extrabold text-gray-800">
            سفارش شما ثبت شد!
          </h1>
          <p className="text-sm text-gray-500 leading-7 max-w-sm">
            سفارش شما با موفقیت ثبت شد و در انتظار تأیید رسید پرداخت است.
            <br />
            پس از تأیید، سفارش شما پردازش و ارسال خواهد شد.
          </p>
        </div>

        {/* ── Order ID ── */}
        <div className="w-full bg-green-50 border border-green-100 rounded-2xl px-5 py-4 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-gray-400">
            <IconHash size={13} />
            <p className="text-xs font-medium">شماره سفارش</p>
          </div>
          <p className="text-2xl font-black text-green-700 tracking-widest">
            #{orderId}
          </p>
          <p className="text-xs text-green-500 mt-0.5">این شماره را نزد خود نگه دارید</p>
        </div>

        {/* ── Status steps ── */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Step 1 — done */}
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <IconCircleCheck size={15} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700">ثبت سفارش</p>
              <p className="text-xs text-green-600 mt-0.5">سفارش شما با موفقیت ثبت شد</p>
            </div>
          </div>

          {/* Step 2 — pending */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
              <IconClock size={15} className="text-white animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700">در انتظار تأیید رسید</p>
              <p className="text-xs text-amber-600 mt-0.5">تیم ما رسید پرداخت شما را بررسی می‌کند</p>
            </div>
          </div>

          {/* Step 3 — upcoming */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 opacity-50">
            <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              <IconShoppingBag size={15} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">پردازش و ارسال</p>
              <p className="text-xs text-gray-400 mt-0.5">پس از تأیید رسید انجام می‌شود</p>
            </div>
          </div>
        </div>

        {/* ── Info strip ── */}
        <div className="w-full flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <IconCreditCard size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-600 leading-5">
            رسید پرداخت کارت به کارت شما دریافت شد. تأیید رسید معمولاً در کمتر از
            <span className="font-bold mx-1">۲ ساعت</span>
            انجام می‌شود.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-green-50" />

        {/* ── Actions ── */}
        <div className="flex flex-col gap-2.5 w-full">
          <Link
            to={`/profile/orders/${orderId}`}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-green-200"
          >
            <IconReceipt size={16} />
            مشاهده جزئیات سفارش
          </Link>

          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-green-50 border border-green-100 text-gray-700 font-semibold text-sm transition-all duration-150"
          >
            <IconHome size={16} />
            بازگشت به صفحه اصلی
          </Link>

          <Link
            to="/profile/tickets/new"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm transition-all duration-150"
          >
            <IconHeadset size={16} />
            ارتباط با پشتیبانی
          </Link>
        </div>

        {/* ── Footer ── */}
        <p className="text-xs text-gray-400 text-center leading-6">
          در صورت هرگونه سوال از طریق
          <span className="text-green-600 font-medium mx-1">support@pharmaplus.ir</span>
          با ما در ارتباط باشید.
        </p>
      </div>

      <p className="mt-8 text-xs text-green-400 font-medium tracking-wide">
        فارماپلاس — داروخانه آنلاین شما
      </p>
    </div>
  );
}