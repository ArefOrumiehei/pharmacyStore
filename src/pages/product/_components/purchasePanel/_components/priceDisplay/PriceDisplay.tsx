import type { PriceDisplayProps } from "@/pages/product/types/productPageTypes";
import { toPersianDigits } from "smart-persian-tools";

export default function PriceDisplay({ isLoaded, product, displayPrice }: PriceDisplayProps) {
  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
        <div className="h-7 sm:h-8 w-32 sm:w-40 bg-blue-50 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {product?.hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-400 line-through truncate">
            {toPersianDigits(product.price)} تومان
          </span>
          <span className="flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
            {toPersianDigits(product.discountRate)}٪ تخفیف
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 truncate">
          {toPersianDigits(displayPrice ?? "")}
        </span>
        <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">تومان</span>
      </div>
      <div className="h-px bg-blue-50" />
    </div>
  );
}