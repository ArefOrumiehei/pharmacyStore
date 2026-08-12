import { Skeleton } from "../../../../../../../../components/ui/skeleton";

function ProductCardSkeleton() {
    return (
        <div className="w-[130px] xs:w-[150px] sm:w-[200px] md:w-[220px] h-fit xs:h-[290px] sm:h-[360px] rounded-xl sm:rounded-2xl bg-white pb-2 sm:pb-4 overflow-hidden flex-shrink-0 border border-blue-50">
            {/* Image */}
            <div className="p-2.5 sm:p-6 w-full flex items-center justify-center min-h-[100px] sm:min-h-[170px]">
                <Skeleton className="w-[70px] h-[70px] sm:w-[130px] sm:h-[130px]" />
            </div>

            <div className="px-2 sm:px-4 space-y-1.5 sm:space-y-2">
                {/* Product name */}
                <Skeleton className="h-3 sm:h-5 w-[100px] sm:w-[160px]" />
                <Skeleton className="h-2.5 sm:h-4 w-[70px] sm:w-[100px]" />

                {/* Rating row */}
                <div className="flex items-center gap-1 pt-0.5 sm:pt-1">
                    <Skeleton className="h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full" />
                    <Skeleton className="h-2.5 sm:h-4 w-[50px] sm:w-[60px]" />
                </div>

                {/* Cart + price row */}
                <div className="flex items-end justify-between flex-col-reverse gap-2 pt-1.5 sm:pt-2">
                    <Skeleton className="flex self-start h-6 w-full sm:h-9 sm:w-9 rounded-md sm:rounded-xl flex-shrink-0" />
                    <Skeleton className="h-4 sm:h-6 w-[50px] sm:w-[90px]" />
                </div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
