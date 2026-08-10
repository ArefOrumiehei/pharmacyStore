import { IconTruck } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

interface ShippingBannerProps {
  trackingNumber: string;
  cardClass: string;
}

export default function ShippingBanner({ trackingNumber, cardClass }: ShippingBannerProps) {
  return (
    <div className={`flex items-center justify-between gap-2.5 sm:gap-3 border rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-3 sm:py-4 flex-wrap ${cardClass}`}>
      <div className="flex items-center gap-2.5 sm:gap-3">
        <IconTruck size={18} className="text-blue-800 flex-shrink-0 sm:w-5 sm:h-5" />
        <div>
          <p className="text-xs sm:text-sm font-bold text-blue-800">مرسوله در راه است</p>
          <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5">
            کد رهگیری: {toPersianDigits(trackingNumber)}
          </p>
        </div>
      </div>
      <button className="text-[10px] sm:text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
        پیگیری مرسوله
      </button>
    </div>
  );
}