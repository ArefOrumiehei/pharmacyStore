export default function CommentsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl sm:rounded-2xl border border-blue-50 p-3 sm:p-4 text-center">
            <div className="h-5 sm:h-7 w-6 sm:w-8 bg-blue-50 animate-pulse rounded mx-auto" />
            <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-blue-50 animate-pulse rounded mx-auto mt-1.5 sm:mt-2" />
          </div>
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-start justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div className="h-3 sm:h-3.5 w-28 sm:w-32 bg-blue-50 animate-pulse rounded" />
                <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-blue-50 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-5 sm:h-6 w-14 sm:w-16 bg-blue-50 animate-pulse rounded-lg" />
          </div>
          <div className="border-t border-blue-50 pt-2.5 sm:pt-3 flex flex-col gap-1.5 sm:gap-2">
            <div className="h-2.5 sm:h-3 w-20 sm:w-24 bg-blue-50 animate-pulse rounded" />
            <div className="h-2.5 sm:h-3 w-full bg-blue-50 animate-pulse rounded" />
            <div className="h-2.5 sm:h-3 w-3/4 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}