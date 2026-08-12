import { IMAGE_BASE } from "@/apis/apiInstance";
import DiscountBadge from "./_components/discountBadge/DiscountBadge";
import OutOfStockOverlay from "./_components/outOfStockOverlay/OutOfStockOverlay";
import type { ProductCardImageProps } from "../interfaces/ProductCardInterfaces";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

export default function ProductCardImage({ picture, pictureAlt, inStock, hasDiscount, discountPercent }: ProductCardImageProps) {
  return (
    <div
      className={`relative px-2.5 sm:px-6 pt-2.5 sm:pt-6 pb-2 sm:pb-3 flex items-center justify-center min-h-[100px] sm:min-h-[170px]
        ${inStock ? "bg-gradient-to-b from-blue-50/60 to-white" : "bg-gradient-to-b from-gray-50 to-white"}`}
    >
      <img
        src={`${IMAGE_BASE}/${picture}`}
        alt={pictureAlt}
        className={`w-[70px] h-[70px] sm:w-[130px] sm:h-[130px] object-contain drop-shadow-sm transition-transform duration-300
          ${!inStock ? "grayscale opacity-50" : ""}`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />

      {inStock && hasDiscount && discountPercent ? <DiscountBadge discountPercent={discountPercent} /> : null}
      {!inStock && <OutOfStockOverlay />}
    </div>
  );
}