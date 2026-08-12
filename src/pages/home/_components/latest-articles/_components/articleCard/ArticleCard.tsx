import { Link } from "react-router";
import { IconCalendar } from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";
import { toPersianDigits } from "smart-persian-tools";
import ArticleMetaRow from "./_components/articleMetaRow/ArticleMetaRow";

export default function ArticleCard({ article }: { article: IArticle }) {
  return (
    <Link
      to={`/blog/${article.categorySlug}/${article.slug}`}
      className="group bg-white rounded-xl sm:rounded-2xl border border-blue-100 overflow-hidden flex flex-col hover:shadow-md hover:shadow-blue-100/60 hover:border-blue-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-32 sm:h-44 overflow-hidden bg-blue-50 flex-shrink-0">
        <img
          src={`${IMAGE_BASE}/${article.picture}`}
          alt={article.pictureAlt}
          title={article.pictureTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[10px] sm:text-xs font-semibold text-blue-800 bg-white/90 backdrop-blur-sm border border-blue-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
          {article.categoryName}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2 sm:gap-2.5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <IconCalendar size={11} className="sm:w-3 sm:h-3" />
          <span className="text-[11px] sm:text-xs">{toPersianDigits(article.publishDate)}</span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-800 transition-colors duration-200">
          {article.title}
        </h3>

        <p className="hidden min-[480px]:block text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {article.shortDescription}
        </p>

        <ArticleMetaRow article={article} />
      </div>
    </Link>
  );
}