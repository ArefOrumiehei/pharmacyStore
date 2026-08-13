import ProductCardSkeleton from "../productCardSkeleton/ProductCardSkeleton";

export default function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}