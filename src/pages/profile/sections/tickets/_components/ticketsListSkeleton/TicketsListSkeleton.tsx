export default function TicketsListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 flex-1">
              <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
              <div className="h-3.5 sm:h-4 w-32 sm:w-40 bg-blue-50 animate-pulse rounded" />
            </div>
            <div className="h-5 sm:h-6 w-24 sm:w-28 bg-blue-50 animate-pulse rounded-lg flex-shrink-0" />
          </div>
          <div className="h-2.5 sm:h-3 w-full bg-blue-50 animate-pulse rounded" />
          <div className="flex justify-between gap-2">
            <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
            <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}