import { IconStarFilled } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { ProductInfoBadgesProps } from "@/pages/product/types/productPageTypes";

export default function ProductInfoBadges({ isLoaded, product }: ProductInfoBadgesProps) {
  if (!isLoaded) {
    return (
      <div className="flex gap-1.5 sm:gap-2">
        <div className="h-6 sm:h-7 w-24 sm:w-28 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl" />
        <div className="h-6 sm:h-7 w-16 sm:w-20 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
      <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 border border-amber-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl">
        <IconStarFilled size={11} className="text-amber-400 sm:w-[13px] sm:h-[13px]" />
        <span className="font-bold text-xs sm:text-sm text-amber-700">
          {toPersianDigits((product?.avgRate ?? 0).toFixed(1))}
        </span>
        <span className="text-[10px] sm:text-xs text-amber-400 whitespace-nowrap">
          ({toPersianDigits(product?.rateCount ?? 0)} نظر)
        </span>
      </div>
      <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl whitespace-nowrap">
        کد: {product?.code}
      </span>
      {!product?.isInStock && (
        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-medium whitespace-nowrap">
          ناموجود
        </span>
      )}
    </div>
  );
}