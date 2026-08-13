export default function ProductCardSkeleton() {
    return (
        <div className="bg-white border border-blue-50 rounded-xl sm:rounded-2xl w-full overflow-hidden flex flex-row sm:flex-col">
            <div className="flex-shrink-0 w-28 sm:w-full sm:aspect-square bg-blue-50 animate-pulse" />
            <div className="flex-1 min-w-0 p-2.5 sm:p-4 flex flex-col justify-between gap-2 sm:gap-3">
                <div className="space-y-2 sm:space-y-3">
                    <div className="h-3 bg-blue-50 animate-pulse rounded-full w-1/3" />
                    <div className="h-4 bg-blue-50 animate-pulse rounded w-full" />
                    <div className="h-4 bg-blue-50 animate-pulse rounded w-3/4 hidden sm:block" />
                    <div className="h-3 bg-blue-50 animate-pulse rounded w-1/4" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-50">
                    <div className="h-8 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl w-16 sm:w-24" />
                    <div className="h-5 bg-blue-50 animate-pulse rounded w-1/3" />
                </div>
            </div>
        </div>
    );
}