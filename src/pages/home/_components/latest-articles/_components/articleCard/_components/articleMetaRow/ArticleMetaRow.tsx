import { IconStar, IconEye } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { IArticle } from "@/services/articleServices/articleServices";

export default function ArticleMetaRow({ article }: { article: IArticle }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 pt-1 border-t border-blue-50">
      <span className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-500">
        <IconStar size={11} className="sm:w-3 sm:h-3" />
        {toPersianDigits(article.avgRateStr || article.avgRate)}
      </span>
      <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-400">
        <IconEye size={11} className="sm:w-3 sm:h-3" />
        {toPersianDigits(article.viewsLabel || article.viewCount)}
      </span>
      <span className="text-[11px] sm:text-xs text-gray-400 mr-auto whitespace-nowrap">
        {toPersianDigits(article.commentCountStr || article.commentCount)} نظر
      </span>
    </div>
  );
}