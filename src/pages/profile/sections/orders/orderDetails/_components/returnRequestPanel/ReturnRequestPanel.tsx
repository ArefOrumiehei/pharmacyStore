import { useState } from "react";
import { IconCircleCheck, IconLock, IconRotateClockwise, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { toPersianDigits, convertDate } from "smart-persian-tools";
import { useUserStore } from "@/store/useAccountStore";

const daysSince = (dateStr: string): number => {
  try {
    const gregorianDate = convertDate(dateStr.split(" ")[0], {from: "jalali", to: "gregorian"})
    const parsed = new Date(gregorianDate.formatted.gregorian);
    if (isNaN(parsed.getTime())) return 0;
    return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.warn(error);
    return 0;
  }
};

export default function ReturnRequestPanel({ orderId, deliveredDate }: { orderId: number; deliveredDate: string }) {
  const { requestReturn, loading } = useUserStore();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  const days = daysSince(deliveredDate);
  const expired = days > 7;

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    try {
      await requestReturn({ orderId, reason });
      setDone(true);
      setOpen(false);
    } catch {
      // toast shown by store
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
        <IconCircleCheck size={14} className="text-green-600 flex-shrink-0 sm:w-[15px] sm:h-[15px]" />
        <p className="text-[11px] sm:text-xs font-medium text-green-700">درخواست مرجوعی ثبت شد</p>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
        <IconLock size={14} className="text-gray-400 flex-shrink-0 mt-0.5 sm:w-[15px] sm:h-[15px]" />
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-gray-500">مهلت مرجوعی پایان یافته</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
            {toPersianDigits(days)} روز از تحویل گذشته — مهلت مرجوعی ۷ روز است
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs sm:text-sm font-semibold transition-all"
        >
          <IconRotateClockwise size={13} className="sm:w-[15px] sm:h-[15px]" />
          درخواست مرجوعی
          <span className="text-[10px] sm:text-xs font-normal text-rose-400 whitespace-nowrap">
            ({toPersianDigits(7 - days)} روز مانده)
          </span>
        </button>
      )}

      {open && (
        <div className="flex flex-col gap-2.5 sm:gap-3 bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <IconAlertTriangle size={13} className="text-rose-500 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
            <p className="text-[11px] sm:text-xs font-semibold text-rose-700">دلیل مرجوعی را بنویسید</p>
          </div>

          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="لطفاً دلیل مرجوع کردن سفارش را توضیح دهید..."
            className="w-full border border-rose-200 bg-white rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none leading-6 sm:leading-7"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!reason.trim() || loading.requestReturn}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] sm:text-xs font-semibold transition-all"
            >
              {loading.requestReturn ? (
                <IconLoader2 size={12} className="animate-spin sm:w-[13px] sm:h-[13px]" />
              ) : (
                <IconRotateClockwise size={12} className="sm:w-[13px] sm:h-[13px]" />
              )}
              ثبت درخواست
            </button>
            <button
              onClick={() => { setOpen(false); setReason(""); }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-rose-100 hover:bg-white/80 text-rose-400 text-[11px] sm:text-xs font-semibold transition-all"
            >
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}