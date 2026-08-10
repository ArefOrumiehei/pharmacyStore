export function TicketDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-5 w-40 sm:w-48 bg-blue-50 animate-pulse rounded" />
      <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        <div className="h-4 w-32 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-blue-50 animate-pulse rounded" />
      </div>
      <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        <div className="h-4 w-32 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-blue-50 animate-pulse rounded" />
      </div>
    </div>
  );
}