import { Link } from "react-router";
import { IconEye, IconStar } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";

export default function SideBlogCard({
    article,
    rank,
    variant,
}: {
    article: IArticle;
    rank: number;
    variant: "topRated" | "mostViewed";
}) {
    return (
        <Link
            to={`/blog/${article.categorySlug}/${article.slug}`}
            className="group flex gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
        >
            {/* Rank */}
            <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs font-black ${
                    rank === 1
                        ? "bg-amber-400 text-white"
                        : rank === 2
                        ? "bg-gray-300 text-white"
                        : rank === 3
                        ? "bg-orange-400 text-white"
                        : "bg-blue-50 text-blue-800 border border-blue-100"
                }`}
            >
                {toPersianDigits(rank)}
            </div>

            {/* Thumbnail */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-blue-50 flex-shrink-0">
                <img
                    src={`${IMAGE_BASE}/${article.picture}`}
                    alt={article.pictureAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-800 transition-colors">
                    {article.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-400">
                    {variant === "topRated" ? (
                        <span className="flex items-center gap-0.5 text-amber-500">
                            <IconStar size={10} />
                            {toPersianDigits(article.avgRateStr || article.avgRate)}
                        </span>
                    ) : (
                        <span className="flex items-center gap-0.5">
                            <IconEye size={10} />
                            {toPersianDigits(article.viewsLabel || article.viewCount)}
                        </span>
                    )}
                    <span className="truncate">{article.categoryName}</span>
                </div>
            </div>
        </Link>
    );
}