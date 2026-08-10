import { IconStar, IconStarFilled } from "@tabler/icons-react";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <IconStarFilled key={i} size={12} className="text-amber-400 sm:w-[13px] sm:h-[13px]" />
        ) : (
          <IconStar key={i} size={12} className="text-gray-200 sm:w-[13px] sm:h-[13px]" />
        )
      )}
    </div>
  );
}