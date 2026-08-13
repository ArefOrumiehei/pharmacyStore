import { Link } from "react-router";
import { IconCalendar, IconClock, IconEye, IconStar } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";

export default function FeaturedCard({ article }: { article: IArticle }) {
    return (
        <Link
            to={`/blog/${article.categorySlug}/${article.slug}`}
            className="group w-full col-span-full bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col sm:flex-row"
        >
            <div className="w-full h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-blue-50 relative flex-shrink-0">
                <img
                    src={`${IMAGE_BASE}/${article.picture}`}
                    alt={article.pictureAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[10px] sm:text-xs font-bold text-white bg-blue-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    ویژه
                </span>
            </div>
            <div className="flex-1 p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3 justify-center">
                <span className="text-[10px] sm:text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-2 sm:px-2.5 py-0.5 rounded-full w-fit">
                    {article.categoryName}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-6 sm:leading-7 group-hover:text-blue-800 transition-colors line-clamp-2">
                    {article.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-5 sm:leading-6 line-clamp-3">
                    {article.shortDescription}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-3 sm:pt-4 border-t border-blue-50 flex-wrap">
                    <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1"><IconCalendar size={12} />{toPersianDigits(article.publishDate)}</span>
                        <span className="flex items-center gap-1 text-amber-500"><IconStar size={12} />{toPersianDigits(article.avgRateStr || article.avgRate)}</span>
                        <span className="flex items-center gap-1"><IconEye size={12} />{toPersianDigits(article.viewsLabel || article.viewCount)}</span>
                        <span className="flex items-center gap-1"><IconClock size={12} />{article.commentCountStr || article.commentCount} نظر</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}