export function SpecificationsSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3">
      <div className="h-4 sm:h-5 w-28 sm:w-36 bg-blue-50 animate-pulse rounded mb-1.5 sm:mb-2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 sm:gap-4">
          <div className="h-3.5 sm:h-4 w-1/4 bg-blue-50 animate-pulse rounded" />
          <div className="h-3.5 sm:h-4 w-2/4 bg-blue-50 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}