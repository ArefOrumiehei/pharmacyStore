export default function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-blue-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <div className="h-3 sm:h-3.5 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
              <div className="h-2.5 sm:h-3 w-28 sm:w-32 bg-blue-50 animate-pulse rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="h-3 sm:h-3.5 w-16 sm:w-20 bg-blue-50 animate-pulse rounded hidden sm:block" />
            <div className="h-5 sm:h-6 w-16 sm:w-24 bg-blue-50 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}