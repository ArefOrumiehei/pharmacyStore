import { toPersianDigits } from "smart-persian-tools";

export default function FavoriteDiscountBadge({ discountRate }: { discountRate: number }) {
  return (
    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 max-[280px]:w-5 max-[280px]:h-5 w-7 h-7 sm:w-9 sm:h-9 max-[280px]:rounded-md rounded-lg sm:rounded-xl bg-red-500 flex flex-col items-center justify-center shadow-sm">
      <span className="text-white font-black text-[8px] sm:text-xs leading-none">{toPersianDigits(discountRate)}٪</span>
      <span className="hidden sm:block text-red-200 text-[8px] leading-none mt-0.5">تخفیف</span>
    </div>
  );
}