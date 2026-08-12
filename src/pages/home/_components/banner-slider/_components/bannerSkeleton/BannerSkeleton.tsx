import { Skeleton } from "@/components/ui/skeleton";

export default function BannerSkeleton() {
  return (
    <div className="relative w-full mt-3 sm:mt-4">
      <Skeleton className="w-full h-36 xs:h-44 sm:h-64 md:h-[420px] rounded-xl sm:rounded-2xl" />
      <div className="absolute bottom-2.5 sm:bottom-4 w-full flex items-center justify-center gap-1.5 sm:gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" />
        ))}
      </div>
    </div>
  );
}