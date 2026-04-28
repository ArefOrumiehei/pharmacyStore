import { Skeleton } from "../ui/skeleton"

function ProductCardSkeleton() {
  return (
    <div className="min-w-[200px] w-70 rounded-lg bg-white pb-4 overflow-hidden flex-shrink-0">
      {/* Image */}
      <div className="p-0 w-full flex items-center justify-center">
        <Skeleton className="w-[180px] h-[180px]" />
      </div>

      <div className="p-4 space-y-2">
        {/* Product name */}
        <Skeleton className="h-5 w-[160px]" />

        {/* Category + rating row */}
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-[80px]" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Skeleton className="h-4 w-[40px]" />
          <Skeleton className="h-6 w-[90px]" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;