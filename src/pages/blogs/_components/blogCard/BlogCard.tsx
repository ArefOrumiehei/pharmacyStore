import { Link } from "react-router";
import { IconCalendar, IconEye, IconStar } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";

export default function BlogCard({ article }: { article: IArticle }) {
    return (
        <Link
            to={`/blog/${article.categorySlug}/${article.slug}`}
            className="group bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-300"
        >
            <div className="w-full h-40 sm:h-48 overflow-hidden bg-blue-50 relative flex-shrink-0">
                <img
                    src={`${IMAGE_BASE}/${article.picture}`}
                    alt={article.pictureAlt}
                    title={article.pictureTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[10px] sm:text-xs font-medium text-blue-800 bg-white/90 backdrop-blur-sm border border-blue-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    {article.categoryName}
                </span>
            </div>

            <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5 flex-1">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-5 sm:leading-6 group-hover:text-blue-800 transition-colors duration-200">
                    {article.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-5 flex-1">
                    {article.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-blue-50 flex-wrap gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <IconCalendar size={11} />
                            {toPersianDigits(article.publishDate)}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500">
                            <IconStar size={11} />
                            {toPersianDigits(article.avgRateStr || article.avgRate)}
                        </span>
                        <span className="flex items-center gap-1">
                            <IconEye size={11} />
                            {toPersianDigits(article.viewsLabel || article.viewCount)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}