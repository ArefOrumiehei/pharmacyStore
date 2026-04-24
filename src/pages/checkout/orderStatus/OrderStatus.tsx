import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type PaymentStatus = "success" | "failure" | "loading";

interface VerifyResponse {
  success: boolean;
}

/* ---------------- HOOK ---------------- */
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
          setMessage(rawOrderId);
        }
      })
      .catch(() => {
        setStatus("failure");
        setMessage("خطا در بررسی وضعیت پرداخت. لطفاً دوباره تلاش کنید.");
      });
  }, [verifyPayment]);

  return { status, message, orderId };
}

/* ---------------- COMPONENT ---------------- */
export default function OrderStatus() {
  const { downloadInvoice } = useOrderStore();
  const navigate = useNavigate();
  const { status, message, orderId } = usePaymentVerification();

  const handleDownload = async () => {
    if (!orderId) return;
    await downloadInvoice(orderId);
  };

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-4" dir="rtl">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 h-[600px] rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${
            status === "success"
              ? "bg-emerald-400"
              : status === "failure"
              ? "bg-rose-400"
              : "bg-sky-400"
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 h-[500px] rounded-full blur-3xl opacity-15 transition-colors duration-1000 ${
            status === "success"
              ? "bg-teal-300"
              : status === "failure"
              ? "bg-orange-300"
              : "bg-blue-300"
          }`}
        />
      </div>

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
          <FailureCard message={message} onHome={() => navigate("/")} />
        )}
      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */
function LoadingCard() {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-8 text-center">
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
      </div>
      <p className="text-gray-600 text-base font-medium">
        در حال بررسی وضعیت پرداخت...
      </p>
    </div>
  );
}

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
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 border-t-5 border-t-emerald-400 shadow-2xl overflow-hidden">

      <div className="p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">پرداخت موفقیت‌آمیز بود</h2>
        <p className="text-gray-400 text-sm mb-6">سفارش شما با موفقیت ثبت شد</p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-emerald-600 mb-1">کد پیگیری</p>
          <p className="text-sm font-mono font-semibold text-emerald-800 tracking-wider">
            {trackId}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onDownload}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white py-2.5 text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            دانلود فاکتور
          </button>
          <button
            onClick={onHome}
            className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 py-2.5 text-sm font-medium transition-all duration-150"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
}

function FailureCard({
  message,
  onHome,
}: {
  message: string;
  onHome: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 border-t-5 border-t-rose-400 shadow-2xl overflow-hidden">

      <div className="p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">پرداخت ناموفق بود</h2>
        <p className="text-gray-400 text-sm mb-6">متأسفانه پرداخت شما تأیید نشد</p>

        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-rose-700">{message}</p>
        </div>

        <button
          onClick={onHome}
          className="w-full rounded-xl bg-gray-800 hover:bg-gray-900 active:scale-95 text-white py-2.5 text-sm font-medium transition-all duration-150"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}