export default function BlogCardSkeleton() {
    return (
        <div className="bg-white border border-blue-50 rounded-2xl overflow-hidden">
            <div className="w-full h-40 sm:h-48 bg-blue-50 animate-pulse" />
            <div className="p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
                <div className="h-3 w-20 bg-blue-50 animate-pulse rounded-full" />
                <div className="h-4 sm:h-5 w-full bg-blue-50 animate-pulse rounded" />
                <div className="h-3.5 sm:h-4 w-3/4 bg-blue-50 animate-pulse rounded" />
                <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
                <div className="flex items-center justify-between pt-2 border-t border-blue-50">
                    <div className="h-5 sm:h-6 w-24 sm:w-28 bg-blue-50 animate-pulse rounded-full" />
                    <div className="h-3 w-14 sm:w-16 bg-blue-50 animate-pulse rounded" />
                </div>
            </div>
        </div>
    );
}