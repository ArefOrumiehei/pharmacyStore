import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

type BannerItem = {
    src: string;
    alt?: string;
    href?: string;
    badge?: string;
};

type BannerProps = {
    items: BannerItem[];
    loading?: boolean;
};

function Banner({ items, loading = false }: BannerProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Skeleton className="w-full h-48 rounded-2xl" />
                <Skeleton className="w-full h-48 rounded-2xl" />
            </div>
        );
    }

    if (!items || items.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {items.map((item, index) => {
                const content = (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-blue-50 group cursor-pointer">
                        <img
                            src={item.src}
                            alt={item.alt ?? `banner-${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-all duration-300" />

                        {/* Optional badge */}
                        {item.badge && (
                            <div className="absolute top-3 right-3 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                {item.badge}
                            </div>
                        )}
                    </div>
                );

                return item.href ? (
                    <Link key={index} to={item.href}>
                        {content}
                    </Link>
                ) : (
                    <div key={index}>{content}</div>
                );
            })}
        </div>
    );
}

export default Banner;
