import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { IconArrowRight, IconSearchOff } from "@tabler/icons-react";
import BlogSearchBar from "../blogs/_components/blogSearchBar/BlogSearchBar";
import CategoryTabs from "../blogs/_components/categoryTabs/CategoryTabs";
import BlogGridSkeleton from "../blogs/_components/skeletons/BlogGridSkeleton";
import BlogCard from "../blogs/_components/blogCard/BlogCard";
import { useArticleSearchStore } from "@/store/useArticleSearchStore";

export default function BlogSearchResult() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const [search, setSearch] = useState(query);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { fetchResults, items, loading: searchLoading} = useArticleSearchStore();

    useEffect(() => {
        setSearch(query);
        setActiveCategory(null);
        if (query) fetchResults({value: query, page: 1, pageSize: 12});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = search.trim();
        if (!q) return;
        setSearchParams({ q });
    };

    const handleClearSearch = () => {
        setSearch("");
        navigate("/blog");
    };

    const handleCategory = (cat: string) => {
        setActiveCategory((prev) => (prev === cat ? null : cat));
    };

    // ── Derived data ─────────────────────────────────────────────────────────

    const categoryNames = Array.from(
        new Set(items.map((a) => a.categoryName).filter((name): name is string => Boolean(name))),
    );
    const filtered = activeCategory
        ? items.filter((a) => a.categoryName === activeCategory)
        : items;

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            {/* Page header */}
            <div className="space-y-3 py-2 sm:py-4">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors"
                >
                    <IconArrowRight size={16} />
                    بازگشت به مجله سلامت
                </Link>
                <div className="text-center space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-blue-800">
                        نتایج جستجو برای «{query}»
                    </h1>
                    {!searchLoading && (
                        <p className="text-gray-400 text-xs sm:text-sm">
                            {items.length} مقاله یافت شد
                        </p>
                    )}
                </div>
            </div>

            <BlogSearchBar
                value={search}
                onChange={setSearch}
                onSubmit={handleSearchSubmit}
                onClear={handleClearSearch}
            />

            {categoryNames.length > 0 && (
                <CategoryTabs categories={categoryNames} active={activeCategory} onSelect={handleCategory} />
            )}

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">
                <div className="flex-1 min-w-0 w-full">
                    {searchLoading ? (
                        <BlogGridSkeleton />
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center gap-3 py-16 text-gray-400">
                            <IconSearchOff size={40} className="opacity-50" />
                            <p className="text-sm">
                                نتیجه‌ای برای «{query}» پیدا نشد. عبارت دیگری را امتحان کنید.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {filtered.map((article) => (
                                <BlogCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}