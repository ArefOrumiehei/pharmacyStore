export default function OrderDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-5">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 sm:h-5 w-28 sm:w-36 bg-blue-50 animate-pulse rounded" />
          <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">
        <div className="lg:col-span-2 flex flex-col gap-3.5 sm:gap-5">
          <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5 sm:space-y-3">
            <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5 sm:gap-3 py-1.5 sm:py-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5 sm:space-y-2">
                  <div className="h-3 sm:h-3.5 w-2/3 bg-blue-50 animate-pulse rounded" />
                  <div className="h-2.5 sm:h-3 w-1/3 bg-blue-50 animate-pulse rounded" />
                </div>
                <div className="h-3.5 sm:h-4 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
            <div className="h-3.5 sm:h-4 w-24 sm:w-28 bg-blue-50 animate-pulse rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <div className="h-2 sm:h-2.5 w-14 sm:w-16 bg-blue-50 animate-pulse rounded" />
                    <div className="h-3 sm:h-3.5 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5 sm:space-y-3 h-fit">
          <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 sm:h-3.5 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
              <div className="h-3 sm:h-3.5 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
            </div>
          ))}
          <div className="h-px bg-blue-50" />
          <div className="flex justify-between">
            <div className="h-3.5 sm:h-4 w-24 sm:w-28 bg-blue-50 animate-pulse rounded" />
            <div className="h-3.5 sm:h-4 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}