import { formatCurrency } from "smart-persian-tools";

interface FavoritePriceBlockProps {
  inStock: boolean;
  price: number;
  priceWithDiscount?: number;
  hasDiscount?: boolean;
}

export default function FavoritePriceBlock({ inStock, price, priceWithDiscount, hasDiscount }: FavoritePriceBlockProps) {
  return (
    <div className="flex items-baseline self-end gap-1 sm:mt-auto min-w-0">
      {!inStock ? (
        <span className="text-xs sm:text-sm font-semibold text-gray-400">ناموجود</span>
      ) : hasDiscount ? (
        <div className="flex flex-col items-end min-w-0">
          <span className="max-[280px]:text-[8px] text-[10px] sm:text-xs text-gray-400 line-through truncate">
            {formatCurrency(price, "toman", false)}
          </span>
          <span className="max-[280px]:text-[10px] text-sm sm:text-base font-bold text-blue-800 truncate">
            {formatCurrency(priceWithDiscount ?? price)}
          </span>
        </div>
      ) : (
        <span className="max-[280px]:text-[10px] text-sm sm:text-base font-bold text-blue-800 truncate">
          {formatCurrency(price)}
        </span>
      )}
    </div>
  );
}