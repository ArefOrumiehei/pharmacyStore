export function TabsSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="h-10 sm:h-12 bg-blue-50 animate-pulse rounded-xl sm:rounded-2xl" />
      <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3">
        <div className="h-4 sm:h-5 w-24 sm:w-32 bg-blue-50 animate-pulse rounded mb-1.5 sm:mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-3.5 sm:h-4 bg-blue-50 animate-pulse rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}