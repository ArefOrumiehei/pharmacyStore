import BlogCardSkeleton from "./BlogCardSkeleton";
import FeaturedSkeleton from "./FeaturedSkeleton";

export default function BlogGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FeaturedSkeleton />
            {Array.from({ length: 4 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    );
}