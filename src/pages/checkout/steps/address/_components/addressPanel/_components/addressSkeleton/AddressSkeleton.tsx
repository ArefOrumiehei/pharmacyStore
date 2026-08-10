export function AddressSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-blue-50 p-3 sm:p-4 flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-50 animate-pulse flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="h-3.5 w-32 bg-blue-50 animate-pulse rounded" />
              <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
              <div className="h-3 w-40 max-w-full bg-blue-50 animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}