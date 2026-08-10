export default function OrderSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <div className="h-3 sm:h-3.5 w-24 sm:w-28 bg-blue-50 animate-pulse rounded" />
              <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
            <div className="h-5 sm:h-6 w-20 sm:w-24 bg-blue-50 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}