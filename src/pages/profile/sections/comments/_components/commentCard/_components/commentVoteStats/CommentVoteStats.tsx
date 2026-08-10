import { IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

export default function CommentVoteStats({ likeCount, dislikeCount }: { likeCount: number; dislikeCount: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      {likeCount > 0 && 
        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600">
          <IconThumbUp size={12} className="sm:w-[13px] sm:h-[13px]" />
          {`این نظر برای ${toPersianDigits(likeCount)} نفر مفید بود.`}
        </span>
      }
      {dislikeCount > 0 && 
        <span className="hidden items-center gap-1 text-[10px] sm:text-xs text-rose-500">
          <IconThumbDown size={12} className="sm:w-[13px] sm:h-[13px]" />
          {toPersianDigits(dislikeCount)}
        </span>
      }
    </div>
  );
}