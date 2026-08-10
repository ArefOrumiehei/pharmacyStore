export function CartSkeleton() {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl border border-blue-50">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3.5 bg-blue-50 animate-pulse rounded w-2/3" />
            <div className="h-3 bg-blue-50 animate-pulse rounded w-1/3" />
            <div className="h-3 bg-blue-50 animate-pulse rounded w-1/2" />
          </div>
          <div className="w-20 sm:w-24 h-9 bg-blue-50 animate-pulse rounded-xl flex-shrink-0" />
        </li>
      ))}
    </ul>
  );
}