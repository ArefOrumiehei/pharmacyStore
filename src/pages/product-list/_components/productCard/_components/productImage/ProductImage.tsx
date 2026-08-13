import { IconPackageOff } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";

export default function ProductImage({
    picture,
    alt,
    inStock,
    hasDiscount,
    discountRate,
}: {
    picture: string;
    alt: string;
    inStock: boolean;
    hasDiscount: boolean;
    discountRate: number;
}) {
    return (
        <div
            className={`relative flex-shrink-0 w-28 sm:w-full sm:aspect-square overflow-hidden flex items-center justify-center border-l sm:border-l-0 sm:border-b ${
                inStock ? "bg-blue-50/40 border-blue-50" : "bg-gray-50/60 border-gray-100"
            }`}
        >
            <img
                src={`${IMAGE_BASE}/${picture}`}
                alt={alt}
                className={`w-4/5 h-4/5 object-contain transition-transform duration-500 ${
                    inStock ? "group-hover:scale-105" : "grayscale opacity-50"
                }`}
                loading="lazy"
            />

            {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center px-2">
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 border border-gray-200 rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 shadow-sm">
                        <IconPackageOff size={11} className="text-gray-400 flex-shrink-0 sm:w-[13px] sm:h-[13px]" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 whitespace-nowrap">ناموجود</span>
                    </div>
                </div>
            )}

            {inStock && hasDiscount && (
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-0.5 w-fit bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 rounded-full shadow-sm">
                    {toPersianDigits(discountRate)}٪
                </span>
            )}
        </div>
    );
}