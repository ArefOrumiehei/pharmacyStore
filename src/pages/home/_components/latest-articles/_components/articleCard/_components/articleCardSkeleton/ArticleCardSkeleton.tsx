export default function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-50 overflow-hidden flex flex-col">
      <div className="w-full h-32 sm:h-44 bg-blue-50 animate-pulse" />
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
        <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
        <div className="h-3.5 sm:h-4 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3.5 sm:h-4 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="hidden sm:block h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="hidden sm:block h-3 w-2/3 bg-blue-50 animate-pulse rounded" />
        <div className="flex gap-2 sm:gap-3 mt-1">
          <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-blue-50 animate-pulse rounded" />
          <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-blue-50 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}