import { IconReceipt } from "@tabler/icons-react";

export default function CouponBanner({ couponCode }: { couponCode: string }) {
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
      <IconReceipt size={13} className="text-green-600 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-400">کد تخفیف اعمال شده</p>
        <p className="text-xs sm:text-sm font-bold text-green-700 mt-0.5 truncate">{couponCode}</p>
      </div>
    </div>
  );
}