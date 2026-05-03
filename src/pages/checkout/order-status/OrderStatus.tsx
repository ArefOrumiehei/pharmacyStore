import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { IconLoader2, IconCheck, IconX, IconDownload, IconHome, IconReceipt } from "@tabler/icons-react";

type PaymentStatus = "success" | "failure" | "loading";

interface VerifyResponse {
  success: boolean;
}

function usePaymentVerification() {
  const { verifyPayment } = useOrderStore();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const params = new URLSearchParams(window.location.search);
    const rawOrderId = params.get("orderId");
    const rawTrackId = params.get("trackId");

    if (!rawOrderId || !rawTrackId) {
      setStatus("failure");
      setMessage("اطلاعات پرداخت ناقص است.");
      return;
    }

    const parsedOrderId = Number(rawOrderId);
    setOrderId(parsedOrderId);

    verifyPayment(parsedOrderId, rawTrackId)
      .then((res: unknown) => {
        const result = res as VerifyResponse;
        if (result?.success) {
          setStatus("success");
          setMessage(rawTrackId);
        } else {
          setStatus("failure");
          setMessage("پرداخت تأیید نشد. در صورت کسر وجه، ظرف ۷۲ ساعت بازگشت داده می‌شود.");
        }
      })
      .catch(() => {
        setStatus("failure");
        setMessage("خطا در بررسی وضعیت پرداخت. لطفاً دوباره تلاش کنید.");
      });
  }, [verifyPayment]);

  return { status, message, orderId };
}

export default function OrderStatus() {
  const { downloadInvoice } = useOrderStore();
  const navigate = useNavigate();
  const { status, message, orderId } = usePaymentVerification();

  const handleDownload = async () => {
    if (!orderId) return;
    await downloadInvoice(orderId);
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        {status === "loading" && <LoadingCard />}
        {status === "success" && (
          <SuccessCard
            trackId={message}
            onDownload={handleDownload}
            onHome={() => navigate("/")}
          />
        )}
        {status === "failure" && (
          <FailureCard
            message={message}
            onHome={() => navigate("/")}
            onRetry={() => navigate("/cart")}
          />
        )}
      </div>
    </div>
  );
}

/* ── Loading ── */
function LoadingCard() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-10 text-center shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
        <IconLoader2 size={28} className="text-blue-800 animate-spin" />
      </div>
      <p className="text-gray-700 text-base font-semibold">در حال بررسی پرداخت</p>
      <p className="text-gray-400 text-sm mt-1">لطفاً صبر کنید...</p>
    </div>
  );
}

/* ── Success ── */
function SuccessCard({
  trackId,
  onDownload,
  onHome,
}: {
  trackId: string;
  onDownload: () => void;
  onHome: () => void;
}) {
  return (
    <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Top accent */}
      <div className="h-1.5 bg-green-500 w-full" />

      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
          <IconCheck size={28} className="text-green-600" strokeWidth={2.5} />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">پرداخت موفق!</h2>
        <p className="text-gray-400 text-sm mb-6">سفارش شما با موفقیت ثبت شد</p>

        {/* Track ID */}
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6 text-right">
          <div className="flex items-center gap-2 mb-1">
            <IconReceipt size={14} className="text-green-600" />
            <p className="text-xs text-green-600 font-medium">کد پیگیری</p>
          </div>
          <p className="text-sm font-mono font-bold text-green-800 tracking-wider">
            {trackId}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-100"
          >
            <IconDownload size={16} />
            دانلود فاکتور
          </button>
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 active:scale-95 text-blue-800 py-3 text-sm font-semibold transition-all duration-150"
          >
            <IconHome size={16} />
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Failure ── */
function FailureCard({
  message,
  onHome,
  onRetry,
}: {
  message: string;
  onHome: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Top accent */}
      <div className="h-1.5 bg-rose-500 w-full" />

      <div className="p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5">
          <IconX size={28} className="text-rose-500" strokeWidth={2.5} />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">پرداخت ناموفق</h2>
        <p className="text-gray-400 text-sm mb-6">متأسفانه پرداخت شما تأیید نشد</p>

        {/* Error message */}
        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 mb-6 text-right">
          <p className="text-sm text-rose-700 leading-6">{message}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-100"
          >
            تلاش مجدد
          </button>
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 active:scale-95 text-blue-800 py-3 text-sm font-semibold transition-all duration-150"
          >
            <IconHome size={16} />
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
}