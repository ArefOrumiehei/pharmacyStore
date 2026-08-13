import { Link, useLocation } from "react-router";
import MoreCatgsDropdown from "../moreCatgsDropdown/MoreCatgsDropdown";

interface CategoryItem {
    slug: string;
    name: string;
    articlesCount: number;
}

export default function CategoryNavStrip({ categories, loading }: { categories: CategoryItem[]; loading: boolean }) {
    const location = useLocation();
    const visibleCategories = categories.slice(0, 6);
    const overflowCategories = categories.slice(6);

    return (
        <nav className="flex items-center gap-1 h-10 border-t border-blue-50">
            <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden">
                <Link
                    to="/blog"
                    className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ${
                        location.pathname === "/blog"
                            ? "bg-blue-800 text-white"
                            : "text-gray-600 hover:text-blue-800 hover:bg-blue-50"
                    }`}
                >
                    همه
                </Link>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 h-6 w-20 bg-blue-50 animate-pulse rounded-lg" />
                    ))
                ) : (
                    visibleCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/blog?category=${encodeURIComponent(cat.name)}`}
                            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap ${
                                location.search.includes(`category=${encodeURIComponent(cat.name)}`)
                                    ? "bg-blue-800 text-white"
                                    : "text-gray-600 hover:text-blue-800 hover:bg-blue-50"
                            }`}
                        >
                            {cat.name}
                            {cat.articlesCount > 0 && <span className="mr-1 text-[10px] opacity-60">({cat.articlesCount})</span>}
                        </Link>
                    ))
                )}
            </div>

            {/* Kept outside the scroll container above so its dropdown panel isn't clipped */}
            {!loading && <MoreCatgsDropdown categories={overflowCategories} />}
        </nav>
    );
}