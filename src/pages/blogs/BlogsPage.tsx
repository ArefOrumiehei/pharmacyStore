import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  IconClock, IconCalendar, IconSearch, IconX,
  IconEye, IconStar, IconFlame, IconTrendingUp,
} from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";
import { useArticleCategoriesStore } from "@/store/useArticleCategoriesStore";
import { useArticleStore } from "@/store/useArticlsStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AuthorInitial({ name, size = "sm" }: { name?: string; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  const char = name?.[0] ?? "؟";
  return (
    <div className={`${s} rounded-full bg-blue-800 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {char}
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function BlogCardSkeleton() {
  return (
    <div className="bg-white border border-blue-50 rounded-2xl overflow-hidden">
      <div className="w-full h-48 bg-blue-50 animate-pulse" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-20 bg-blue-50 animate-pulse rounded-full" />
        <div className="h-5 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="flex items-center justify-between pt-2 border-t border-blue-50">
          <div className="h-6 w-28 bg-blue-50 animate-pulse rounded-full" />
          <div className="h-3 w-16 bg-blue-50 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="col-span-full bg-white border border-blue-50 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
      <div className="sm:w-2/5 h-56 bg-blue-50 animate-pulse flex-shrink-0" />
      <div className="flex-1 p-6 flex flex-col gap-3">
        <div className="h-4 w-24 bg-blue-50 animate-pulse rounded-full" />
        <div className="h-6 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-6 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-blue-50 animate-pulse rounded" />
      </div>
    </div>
  );
}

function SideCardSkeleton() {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-blue-50">
      <div className="w-16 h-16 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-blue-50 animate-pulse rounded" />
      </div>
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function BlogCard({ article }: { article: IArticle }) {
  return (
    <Link
      to={`/blog/${article.categorySlug}/${article.slug}`}
      className="group bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-300"
    >
      <div className="w-full h-48 overflow-hidden bg-blue-50 relative flex-shrink-0">
        <img
          src={`${IMAGE_BASE}/${article.picture}`}
          alt={article.pictureAlt}
          title={article.pictureTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 text-xs font-medium text-blue-800 bg-white/90 backdrop-blur-sm border border-blue-100 px-2.5 py-1 rounded-full">
          {article.categoryName}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-6 group-hover:text-blue-800 transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-5 flex-1">
          {article.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-blue-50 flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <IconCalendar size={11} />
              {article.publishDate}
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <IconStar size={11} />
              {article.avgRateStr || article.avgRate}
            </span>
            <span className="flex items-center gap-1">
              <IconEye size={11} />
              {article.viewsLabel || article.viewCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ article }: { article: IArticle }) {
  return (
    <Link
      to={`/blog/${article.categorySlug}/${article.slug}`}
      className="group col-span-full bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col sm:flex-row"
    >
      <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden bg-blue-50 relative flex-shrink-0">
        <img
          src={`${IMAGE_BASE}/${article.picture}`}
          alt={article.pictureAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 text-xs font-bold text-white bg-blue-800 px-2.5 py-1 rounded-full">
          ویژه
        </span>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-3 justify-center">
        <span className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full w-fit">
          {article.categoryName}
        </span>
        <h2 className="text-lg font-bold text-gray-800 leading-7 group-hover:text-blue-800 transition-colors line-clamp-2">
          {article.title}
        </h2>
        <p className="text-sm text-gray-500 leading-6 line-clamp-3">
          {article.shortDescription}
        </p>
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-blue-50 flex-wrap">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><IconCalendar size={12} />{article.publishDate}</span>
            <span className="flex items-center gap-1 text-amber-500"><IconStar size={12} />{article.avgRateStr || article.avgRate}</span>
            <span className="flex items-center gap-1"><IconEye size={12} />{article.viewsLabel || article.viewCount}</span>
            <span className="flex items-center gap-1"><IconClock size={12} />{article.commentCountStr || article.commentCount} نظر</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Side card (top rated / most viewed) ─────────────────────────────────────

function SideArticleCard({
  article,
  rank,
  variant,
}: {
  article:  IArticle;
  rank:     number;
  variant:  "topRated" | "mostViewed";
}) {
  return (
    <Link
      to={`/blog/${article.categorySlug}/${article.slug}`}
      className="group flex gap-3 p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
    >
      {/* Rank */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black
        ${rank === 1 ? "bg-amber-400 text-white" :
          rank === 2 ? "bg-gray-300 text-white" :
          rank === 3 ? "bg-orange-400 text-white" :
          "bg-blue-50 text-blue-800 border border-blue-100"}`}
      >
        {rank}
      </div>

      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-50 flex-shrink-0">
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
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          {variant === "topRated" ? (
            <span className="flex items-center gap-0.5 text-amber-500">
              <IconStar size={10} />
              {article.avgRateStr || article.avgRate}
            </span>
          ) : (
            <span className="flex items-center gap-0.5">
              <IconEye size={10} />
              {article.viewsLabel || article.viewCount}
            </span>
          )}
          <span>{article.categoryName}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Side panel ───────────────────────────────────────────────────────────────

function SidePanel({
  title,
  icon: Icon,
  articles,
  loading,
  variant,
}: {
  title:    string;
  icon:     React.ComponentType<{ size?: number; className?: string }>;
  articles: IArticle[];
  loading:  boolean;
  variant:  "topRated" | "mostViewed";
}) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-50">
        <Icon size={16} className="text-blue-800" />
        <h3 className="text-sm font-bold text-blue-800">{title}</h3>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SideCardSkeleton key={i} />)
        ) : articles.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">موردی یافت نشد</p>
        ) : (
          articles.slice(0, 5).map((article, i) => (
            <SideArticleCard
              key={article.id}
              article={article}
              rank={i + 1}
              variant={variant}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]             = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") ?? "همه",
  );

  const {
    latestArticles, searchResults, topRatedArticles, mostViewedArticles,
    loading, error,
    fetchLatestArticles, fetchArticlesBySearch, fetchTopRated, fetchMostViewed,
    clearSearchResults,
  } = useArticleStore();

  const { categories, fetchAllCategories } = useArticleCategoriesStore();

  // Fetch on mount
  useEffect(() => {
    fetchLatestArticles();
    fetchTopRated();
    fetchMostViewed();
    fetchAllCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Search from URL on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) fetchArticlesBySearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Which articles to show in the main grid
  const isSearching   = !!search && searchResults.length > 0;
  const displayList   = isSearching ? searchResults : latestArticles;
  const featured      = !isSearching && activeCategory === "همه"
    ? displayList[0] ?? null
    : null;
  const gridArticles  = featured
    ? displayList.slice(1)
    : displayList;

  const filtered = activeCategory === "همه"
    ? gridArticles
    : gridArticles.filter((a) => a.categoryName === activeCategory);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) { clearSearchResults(); setSearchParams({}); return; }
    fetchArticlesBySearch(q);
    setSearchParams({ q });
  };

  const handleClearSearch = () => {
    setSearch("");
    clearSearchResults();
    setSearchParams({});
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    const params: Record<string, string> = {};
    if (cat !== "همه") params.category = cat;
    if (search)        params.q = search;
    setSearchParams(params);
  };

  const categoryNames = ["همه", ...categories.map((c) => c.name)];
  const mainLoading   = loading.latest || loading.search;

  return (
    <div className="flex flex-col gap-8">

      {/* Page header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold text-blue-800">مجله سلامت فارماپلاس</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-6">
          آخرین مقالات علمی در حوزه سلامت، دارو، تغذیه و سبک زندگی سالم
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto w-full">
        <div className="relative">
          <IconSearch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در مقالات..."
            className="w-full border border-blue-100 bg-white rounded-2xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <IconX size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-white text-gray-600 border-blue-100 hover:border-blue-300 hover:text-blue-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results label */}
      {(search || activeCategory !== "همه") && !mainLoading && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            {filtered.length} مقاله یافت شد
            {activeCategory !== "همه" && <span> در دسته «{activeCategory}»</span>}
            {search && <span> برای «{search}»</span>}
          </p>
          <button
            onClick={() => { setActiveCategory("همه"); handleClearSearch(); }}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <IconX size={12} /> پاک کردن
          </button>
        </div>
      )}

      {/* ── Main layout: grid + sidebars ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* Main grid */}
      <div className="flex-1 min-w-0">
        {mainLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FeaturedSkeleton />
            {Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <IconSearch size={28} className="text-blue-300" />
            </div>
            <p className="text-gray-500 font-medium">مقاله‌ای یافت نشد</p>
            <p className="text-gray-400 text-sm">فیلتر یا عبارت جستجو را تغییر دهید</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {featured && <FeaturedCard article={featured} />}
            {filtered.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

        {/* Sidebars */}
        <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-5 lg:sticky lg:top-24">
          <SidePanel
            title="پربازدیدترین مقالات"
            icon={IconFlame}
            articles={mostViewedArticles}
            loading={loading.mostViewed}
            error={error.mostViewed}
            variant="mostViewed"
          />
          <SidePanel
            title="بهترین مقالات"
            icon={IconTrendingUp}
            articles={topRatedArticles}
            loading={loading.topRated}
            error={error.topRated}
            variant="topRated"
          />
        </div>
      </div>
    </div>
  );
}