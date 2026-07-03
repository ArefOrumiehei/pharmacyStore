import { useEffect } from "react";
import { Link } from "react-router";
import {
  IconCalendar,
  IconEye,
  IconStar,
  IconArrowLeft,
  IconMoodEmpty,
} from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";
import { useArticleStore } from "@/store/useArticlsStore";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-blue-50 overflow-hidden flex flex-col">
      <div className="w-full h-44 bg-blue-50 animate-pulse" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-blue-50 animate-pulse rounded" />
        <div className="flex gap-3 mt-1">
          <div className="h-3 w-16 bg-blue-50 animate-pulse rounded" />
          <div className="h-3 w-16 bg-blue-50 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Article card ─────────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: IArticle }) {
  return (
    <Link
      to={`/blog/${article.categorySlug}/${article.slug}`}
      className="group bg-white rounded-2xl border border-blue-100 overflow-hidden flex flex-col hover:shadow-md hover:shadow-blue-100/60 hover:border-blue-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden bg-blue-50 flex-shrink-0">
        <img
          src={`${IMAGE_BASE}/${article.picture}`}
          alt={article.pictureAlt}
          title={article.pictureTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 text-xs font-semibold text-blue-800 bg-white/90 backdrop-blur-sm border border-blue-100 px-2.5 py-1 rounded-full">
          {article.categoryName}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <IconCalendar size={12} />
          <span className="text-xs">{article.publishDate}</span>
        </div>

        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-800 transition-colors duration-200">
          {article.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {article.shortDescription}
        </p>

        <div className="flex items-center gap-3 pt-1 border-t border-blue-50">
          <span className="flex items-center gap-1 text-xs text-amber-500">
            <IconStar size={12} />
            {article.avgRateStr || article.avgRate}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <IconEye size={12} />
            {article.viewsLabel || article.viewCount}
          </span>
          <span className="text-xs text-gray-400 mr-auto">
            {article.commentCountStr || article.commentCount} نظر
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function LatestArticles() {
  const { latestArticles, loading, fetchLatestArticles } = useArticleStore();

  useEffect(() => {
    fetchLatestArticles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = !loading.latest && (latestArticles.length ?? 0) === 0;

  return (
    <section className="flex flex-col gap-4" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-bold text-blue-800">جدیدترین مقالات</h2>
          <p className="text-xs text-gray-400">آخرین محتوای منتشر شده در فارماپلاس</p>
        </div>
        {!isEmpty && !loading.latest && (
          <Link
            to="/blog"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            همه مقالات
            <IconArrowLeft size={15} />
          </Link>
        )}
      </div>

      {/* Skeleton */}
      {loading.latest && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading.latest && !isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 bg-white rounded-xl border border-blue-100 text-center">
          <IconMoodEmpty size={36} className="text-gray-300" />
          <p className="text-sm text-gray-400">مقاله‌ای برای نمایش وجود ندارد</p>
        </div>
      )}
    </section>
  );
}