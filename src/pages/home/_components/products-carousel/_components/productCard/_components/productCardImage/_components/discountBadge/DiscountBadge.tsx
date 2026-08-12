import { toPersianDigits } from "smart-persian-tools";

export default function DiscountBadge({ discountPercent }: { discountPercent: number }) {
  return (
    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-red-500 flex flex-col items-center justify-center shadow-sm">
      <span className="text-white font-black text-[8px] sm:text-xs leading-none">{toPersianDigits(discountPercent)}٪</span>
      <span className="hidden sm:block text-red-200 text-[8px] leading-none mt-0.5">تخفیف</span>
    </div>
  );
}