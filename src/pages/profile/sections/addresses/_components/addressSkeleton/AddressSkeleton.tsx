export default function AddressSkeleton() {
  return (
    <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
            <div className="h-3 sm:h-4 w-14 sm:w-16 bg-blue-50 animate-pulse rounded" />
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <div className="h-2.5 sm:h-3 w-full bg-blue-50 animate-pulse rounded" />
            <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
            <div className="h-2.5 sm:h-3 w-28 sm:w-32 bg-blue-50 animate-pulse rounded" />
          </div>
          <div className="flex gap-2 pt-1 border-t border-blue-50">
            <div className="flex-1 h-7 sm:h-8 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl" />
            <div className="w-9 sm:w-10 h-7 sm:h-8 bg-blue-50 animate-pulse rounded-lg sm:rounded-xl flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}