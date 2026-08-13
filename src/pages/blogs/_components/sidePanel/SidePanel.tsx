import type { IArticle } from "@/services/articleServices/articleServices";
import SideCardSkeleton from "../skeletons/SideCardSkelton";
import SideBlogCard from "../sideBlogCard/SideBlogCard";

export default function SidePanel({
    title,
    icon: Icon,
    articles,
    loading,
    error,
    variant,
}: {
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    articles: IArticle[];
    loading: boolean;
    error?: string | null;
    variant: "topRated" | "mostViewed";
}) {
    return (
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-blue-50">
                <Icon size={16} className="text-blue-800" />
                <h3 className="text-sm font-bold text-blue-800">{title}</h3>
            </div>
            <div className="p-2 sm:p-3 flex flex-col gap-2">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <SideCardSkeleton key={i} />)
                ) : error ? (
                    <p className="text-xs text-rose-500 text-center py-4">{error}</p>
                ) : articles.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">موردی یافت نشد</p>
                ) : (
                    articles.slice(0, 5).map((article, i) => (
                        <SideBlogCard key={article.id} article={article} rank={i + 1} variant={variant} />
                    ))
                )}
            </div>
        </div>
    );
}