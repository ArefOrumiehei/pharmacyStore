export default function FeaturedSkeleton() {
    return (
        <div className="col-span-full bg-white border border-blue-50 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
            <div className="w-full h-48 sm:h-auto sm:w-2/5 bg-blue-50 animate-pulse flex-shrink-0" />
            <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3">
                <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-blue-50 animate-pulse rounded-full" />
                <div className="h-5 sm:h-6 w-full bg-blue-50 animate-pulse rounded" />
                <div className="h-5 sm:h-6 w-3/4 bg-blue-50 animate-pulse rounded" />
                <div className="h-3.5 sm:h-4 w-full bg-blue-50 animate-pulse rounded" />
                <div className="h-3.5 sm:h-4 w-2/3 bg-blue-50 animate-pulse rounded" />
                <div className="h-3.5 sm:h-4 w-1/2 bg-blue-50 animate-pulse rounded" />
            </div>
        </div>
    );
}