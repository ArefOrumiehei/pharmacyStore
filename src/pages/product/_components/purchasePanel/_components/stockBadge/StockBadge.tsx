import { useState, useCallback } from "react";
import { IconTruck, IconBellRinging, IconBellCheck, IconLoader2 } from "@tabler/icons-react";
import type { StockBadgeProps } from "@/pages/product/types/productPageTypes";

export default function StockBadge({
  isLoaded, product, initialNotifyRequested = false, onToggleNotifyMe,
}: StockBadgeProps) {
  const [notifying, setNotifying] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(initialNotifyRequested);

  const handleToggleNotify = useCallback(async () => {
    if (!product || notifying) return;
    const next = !notifyRequested;
    setNotifying(true);
    try {
      await onToggleNotifyMe?.(product.id, next);
      setNotifyRequested(next);
    } finally {
      setNotifying(false);
    }
  }, [product, notifying, notifyRequested, onToggleNotifyMe]);

  if (!isLoaded) {
    return <div className="h-9 sm:h-10 w-full bg-blue-50 animate-pulse rounded-lg sm:rounded-xl" />;
  }

  if (!product?.isInStock) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={handleToggleNotify}
          disabled={notifying}
          className={`flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border w-full transition-all duration-200 active:scale-95 disabled:opacity-60 ${
            notifyRequested
              ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
              : "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100"
          }`}
        >
          {notifying ? (
            <IconLoader2 size={13} className="animate-spin sm:w-[14px] sm:h-[14px]" />
          ) : notifyRequested ? (
            <IconBellCheck size={13} className="sm:w-[14px] sm:h-[14px]" />
          ) : (
            <IconBellRinging size={13} className="sm:w-[14px] sm:h-[14px]" />
          )}
          <span className="truncate">
            {notifyRequested ? "دیگه لازم نیست خبرم کنید" : "موجود شد خبرم کنید"}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border font-medium w-full bg-green-50 border-green-100 text-green-700">
      <IconTruck size={13} className="text-green-600 flex-shrink-0 sm:w-[15px] sm:h-[15px]" />
      <span className="truncate">موجود در انبار</span>
      <span className="text-gray-400 mr-auto whitespace-nowrap">ارسال پست</span>
    </div>
  );
}