import { Skeleton } from "../ui/skeleton"

function ProductCardSkeleton() {
  return (
    <div className="min-w-[200px] w-70 rounded-lg bg-white pb-6 transition-all duration-300 ease-out overflow-hidden">
      <div className="p-2 w-full h-fit flex items-center justify-center relative">
        <Skeleton className="w-full h-[200px]" />
      </div>
      <div className="p-2 flex flex-col gap-3">
        <div className="flex flex-col items-start justify-between">
          <Skeleton className="h-4 w-[200px]" />
        </div>

        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-3 w-[80px]" />
          <div className="flex items-center justify-center gap-[6px] flex-row-reverse">
            <Skeleton className="h-4 w-4" />
            <div className="flex items-center text-center gap-[4px]">
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-[4px]">
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton