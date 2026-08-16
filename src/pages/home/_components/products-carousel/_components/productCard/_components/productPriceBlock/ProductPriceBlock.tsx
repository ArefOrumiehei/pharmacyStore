import { formatCurrency } from "smart-persian-tools";
import type { ProductPriceBlockProps } from "../interfaces/ProductCardInterfaces";

export default function ProductPriceBlock({ inStock, price, priceWithDiscount, hasDiscount }: ProductPriceBlockProps) {
  if (!inStock) return null;

  return (
    <div className="flex flex-col items-end gap-0.5 min-w-0">
      {hasDiscount && priceWithDiscount ? (
        <>
          <span className="text-[8px] sm:text-xs text-gray-400 line-through truncate">
            {formatCurrency(price, "toman", false)}
          </span>
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span className="text-xs sm:text-base font-black text-blue-800 truncate">
              {formatCurrency(priceWithDiscount, "toman", false)}
            </span>
            <span className="text-[8px] sm:text-xs text-gray-500 whitespace-nowrap">تومان</span>
          </div>
        </>
      ) : (
        <div className="flex items-baseline gap-0.5 sm:gap-1">
          <span className="text-xs sm:text-base font-black text-blue-800 truncate">
            {formatCurrency(price, "toman", false)}
          </span>
          <span className="text-[8px] sm:text-xs text-gray-500 whitespace-nowrap">تومان</span>
        </div>
      )}
    </div>
  );
}