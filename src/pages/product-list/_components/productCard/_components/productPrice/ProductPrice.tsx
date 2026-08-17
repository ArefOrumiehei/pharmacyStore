import { formatCurrency } from "smart-persian-tools";

export default function ProductPrice({
    price,
    displayPrice,
    hasDiscount,
}: {
    price: number;
    displayPrice: number;
    hasDiscount: boolean;
}) {
    return (
        <div className="flex flex-col items-end min-w-0">
            {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through truncate">
                    {formatCurrency(price, "toman", false)}
                </span>
            )}
            <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-sm sm:text-base font-bold truncate text-blue-800">
                    {formatCurrency(displayPrice, "toman", false)}
                </span>
                <span className="text-[10px] sm:text-xs whitespace-nowrap text-gray-400">تومان</span>
            </div>
        </div>
    );
}