export default function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 space-y-2 sm:space-y-3">
          <div className="w-full h-28 sm:h-40 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl" />
          <div className="h-3 sm:h-4 bg-blue-50 animate-pulse rounded w-3/4" />
          <div className="h-3 sm:h-4 bg-blue-50 animate-pulse rounded w-1/2" />
          <div className="h-7 sm:h-9 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl" />
        </div>
      ))}
    </div>
  );
}