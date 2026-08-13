export default function ProductBadges({
    category,
    brand,
    inStock,
}: {
    category: string;
    brand?: string;
    inStock: boolean;
}) {
    return (
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span
                className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full border truncate max-w-full ${
                    inStock ? "text-blue-800 bg-blue-50 border-blue-100" : "text-gray-400 bg-gray-50 border-gray-100"
                }`}
            >
                {category}
            </span>
            {brand && (
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium bg-gray-50 border border-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-full">
                    {brand}
                </span>
            )}
        </div>
    );
}