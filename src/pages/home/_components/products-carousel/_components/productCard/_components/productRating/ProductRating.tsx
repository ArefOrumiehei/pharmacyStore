import { IconStarFilled } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { ProductRatingProps } from "../interfaces/ProductCardInterfaces";



export default function ProductRating({ avgRate, rateCount, inStock }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStarFilled
            key={i}
            size={8}
            className={`sm:w-[10px] sm:h-[10px] ${
              !inStock ? "text-gray-200" : i < Math.round(avgRate) ? "text-amber-400" : "text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] sm:text-xs text-gray-500">
        {toPersianDigits(Number(avgRate) ? avgRate : avgRate.toFixed(1))}
      </span>
      <span className="text-[10px] sm:text-xs text-gray-400">({toPersianDigits(rateCount)})</span>
    </div>
  );
}