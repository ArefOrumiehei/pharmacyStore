export default function SideCardSkeleton() {
    return (
        <div className="flex gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-xl border border-blue-50">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
                <div className="h-3 w-2/3 bg-blue-50 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-blue-50 animate-pulse rounded" />
            </div>
        </div>
    );
}