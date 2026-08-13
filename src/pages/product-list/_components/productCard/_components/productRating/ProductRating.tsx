import { IconStarFilled } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

export default function ProductRating({
    rating,
    rateCount,
    inStock,
}: {
    rating: number;
    rateCount: number;
    inStock: boolean;
}) {
    return (
        <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <IconStarFilled
                        key={i}
                        size={10}
                        className={`sm:w-3 sm:h-3 ${!inStock ? "text-gray-200" : i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
                    />
                ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400">({toPersianDigits(rateCount)})</span>
        </div>
    );
}