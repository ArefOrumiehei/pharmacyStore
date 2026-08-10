export default function StatsSkeleton() {
  return (
    <div className="grid max-[280px]:grid-cols-1 max-[420px]:grid-cols-2 grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse" />
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <div className="h-4 sm:h-6 w-10 sm:w-12 bg-blue-50 animate-pulse rounded" />
            <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}