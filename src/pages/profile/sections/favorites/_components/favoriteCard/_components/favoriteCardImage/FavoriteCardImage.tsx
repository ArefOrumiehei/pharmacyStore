import { Link } from "react-router";
import { IconPackageOff } from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import FavoriteDiscountBadge from "../favoriteDiscountBadge/FavoriteDiscountBadge";

interface FavoriteCardImageProps {
  productHref: string;
  picture: string;
  name: string;
  inStock: boolean;
  hasDiscount?: boolean;
  discountRate?: number;
}

export default function FavoriteCardImage({
  productHref, picture, name, inStock, hasDiscount, discountRate,
}: FavoriteCardImageProps) {
  return (
    <Link to={productHref} className="relative flex-shrink-0">
      <div
        className={`max-[280px]:w-16 w-24 h-full sm:w-full sm:h-40 flex items-center justify-center border-b overflow-hidden ${
          inStock ? "bg-blue-50/50 border-blue-50" : "bg-gray-50 border-gray-100"
        }`}
      >
        <img
          src={`${IMAGE_BASE}/${picture}`}
          alt={name}
          className={`h-full w-full object-contain p-2 sm:p-3 transition-transform duration-300 ${
            inStock ? "hover:scale-105" : "grayscale opacity-50"
          }`}
        />
      </div>

      {inStock && hasDiscount && discountRate ? (
        <FavoriteDiscountBadge discountRate={discountRate} />
      ) : null}

      {!inStock && (
        <div className="absolute inset-0 flex items-center justify-center px-1">
          <div className="flex items-center gap-1 bg-white/90 border border-gray-200 rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm">
            <IconPackageOff size={10} className="text-gray-400 flex-shrink-0 sm:w-[11px] sm:h-[11px]" />
            <span className="text-[8px] sm:text-xs font-semibold text-gray-400 whitespace-nowrap">ناموجود</span>
          </div>
        </div>
      )}
    </Link>
  );
}