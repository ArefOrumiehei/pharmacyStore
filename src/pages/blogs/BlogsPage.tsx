import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IconFlame, IconTrendingUp } from "@tabler/icons-react";
import { useArticleStore } from "@/store/useArticlsStore";

import BlogSearchBar from "./_components/blogSearchBar/BlogSearchBar";
import BlogEmptyState from "./_components/blogEmptyState/BlogEmptyState";
import FeaturedCard from "./_components/featuredCard/FeaturedCard";
import BlogCard from "./_components/blogCard/BlogCard";
import SidePanel from "./_components/sidePanel/SidePanel";
import BlogGridSkeleton from "./_components/skeletons/BlogGridSkeleton";

export default function BlogsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const {
        latestArticles, topRatedArticles, mostViewedArticles,
        loading, error,
        fetchLatestArticles, fetchTopRated, fetchMostViewed,
    } = useArticleStore();

    useEffect(() => {
        fetchLatestArticles();
        fetchTopRated();
        fetchMostViewed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = search.trim();
        if (!q) return;
        navigate(`/blog/search?q=${encodeURIComponent(q)}`);
    };

    const handleClearSearch = () => setSearch("");


    // Featured card only when no category filter is applied
    const featured = latestArticles[0] ?? null;

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            {/* Page header */}
            <div className="text-center space-y-2 py-2 sm:py-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">مجله سلامت فارماپلاس</h1>
                <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-6 px-2">
                    آخرین مقالات علمی در حوزه سلامت، دارو، تغذیه و سبک زندگی سالم
                </p>
            </div>

            <BlogSearchBar
                value={search}
                onChange={setSearch}
                onSubmit={handleSearchSubmit}
                onClear={handleClearSearch}
            />

            {/* ── Main layout: grid + sidebars ── */}
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">
                <div className="flex-3 min-w-0 w-full">
                    {loading.latest ? (
                        <BlogGridSkeleton />
                    ) : latestArticles.length === 0 && !featured ? (
                        <BlogEmptyState />
                    ) : (
                        <div className="flex flex-col items-start gap-2 w-full">
                            {featured && <FeaturedCard article={featured} />}
                            <div className="flex items-start flex-col gap-4 my-4">
                                <h3 className="text-sm sm:text-md md:text-lg lg:text-2xl text-blue-800">جدید ترین مقالات</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                                    {latestArticles.map((article) => (
                                        <BlogCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-72 xl:w-80 flex flex-1 flex-col gap-4 sm:gap-5 lg:sticky lg:top-24">
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