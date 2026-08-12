import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="flex items-center justify-center flex-col gap-2 sm:gap-3 flex-shrink-0 w-20 sm:w-28">
      <Skeleton className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl" />
      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 rounded-md" />
    </div>
  );
}