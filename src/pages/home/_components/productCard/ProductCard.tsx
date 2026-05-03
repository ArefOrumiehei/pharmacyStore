import { IMAGE_BASE } from "@/apis/apiInstance";
import type { Product } from "@/store/useProductsStore";
import { IconShoppingCartPlus, IconStarFilled, IconPackageOff } from "@tabler/icons-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);

type ProductCardProps = {
  productData: Product;
  onAddToCart?: (id: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ productData, onAddToCart }) => {
  const discountPercent = productData.discountRate;
  const inStock   = productData.isInStock ?? true;
  const stockCount: number | null = productData.stockCount ?? null;
  const isLowStock = inStock && stockCount !== null && stockCount > 0 && stockCount <= 10;

  return (
    <div
      dir="rtl"
      className={`group relative w-full h-full flex-shrink-0 bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 cursor-pointer
        ${inStock
          ? "border-blue-100 hover:shadow-lg hover:shadow-blue-100/60"
          : "border-gray-100 opacity-80"
        }`}
    >
      {/* ── Image area ── */}
      <div
        className={`relative px-4 sm:px-6 pt-4 sm:pt-6 pb-3 flex items-center justify-center min-h-[140px] sm:min-h-[170px]
          ${inStock ? "bg-gradient-to-b from-blue-50/60 to-white" : "bg-gradient-to-b from-gray-50 to-white"}`}
      >
        <img
          src={`${IMAGE_BASE}${productData.picture}`}
          alt={productData.pictureAlt}
          className={`w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] object-contain drop-shadow-sm transition-transform duration-300
            ${!inStock ? "grayscale opacity-50" : ""}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
          }}
        />

        {/* Discount bubble */}
        {inStock && productData.hasDiscount && discountPercent && (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-500 flex flex-col items-center justify-center shadow-sm">
            <span className="text-white font-black text-[10px] sm:text-xs leading-none">{discountPercent}٪</span>
            <span className="text-red-200 text-[7px] sm:text-[8px] leading-none mt-0.5">تخفیف</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1.5 bg-white/90 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
              <IconPackageOff size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-400">ناموجود</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 px-3 sm:px-4 pb-3 sm:pb-4 gap-2 sm:gap-3">

        {/* Name + category */}
        <div className="flex flex-col gap-0.5">
          <h3 className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug
            ${inStock ? "text-gray-800" : "text-gray-400"}`}>
            {productData.name}
          </h3>
          <span className={`text-[11px] sm:text-xs font-medium
            ${inStock ? "text-blue-600" : "text-gray-400"}`}>
            {productData.categoryName}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStarFilled
                key={i}
                size={10}
                className={
                  !inStock
                    ? "text-gray-200"
                    : i < Math.round(productData.avgRate)
                    ? "text-amber-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[11px] sm:text-xs text-gray-500">
            {Number.isInteger(productData.avgRate)
              ? productData.avgRate
              : Number(productData.avgRate).toFixed(1)}
          </span>
          <span className="text-[11px] sm:text-xs text-gray-400">({formatPrice(productData.rateCount)})</span>
        </div>

        {/* ── Low stock indicator ── */}
        {isLowStock && (
          <div className="flex items-center gap-1.5">
            {/* Dot pulse */}
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
            </span>
            {/* Stock bar */}
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500
                  ${stockCount! <= 3 ? "bg-red-400" : stockCount! <= 6 ? "bg-orange-400" : "bg-amber-400"}`}
                style={{ width: `${(stockCount! / 10) * 100}%` }}
              />
            </div>
            <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap flex-shrink-0
              ${stockCount! <= 3 ? "text-red-500" : stockCount! <= 6 ? "text-orange-500" : "text-amber-600"}`}>
              فقط {new Intl.NumberFormat("fa-IR").format(stockCount!)} عدد
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Price + cart */}
        <div className="flex items-end justify-between gap-2">

          {/* Cart button or notify me */}
          {inStock ? (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(productData.id); }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-800 hover:bg-blue-700 flex items-center justify-center flex-shrink-0 transition-colors duration-150 active:scale-90 shadow-sm shadow-blue-200"
            >
              <IconShoppingCartPlus size={15} className="text-white" />
            </button>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-400 text-[10px] sm:text-xs font-medium hover:border-blue-200 hover:text-blue-500 transition-all duration-150 flex-shrink-0"
            >
              اطلاع‌رسانی
            </button>
          )}

          {/* Price block */}
          <div className="flex flex-col items-end gap-0.5">
            {!inStock ? (
              <span className="text-xs text-gray-300 font-medium">نامشخص</span>
            ) : productData.hasDiscount && productData.priceWithDiscount ? (
              <>
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(productData.price)} تومان
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-base font-black text-blue-800">
                    {formatPrice(productData.priceWithDiscount)}
                  </span>
                  <span className="text-[11px] sm:text-xs text-gray-500">تومان</span>
                </div>
              </>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-black text-blue-800">
                  {formatPrice(productData.price)}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500">تومان</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom hover accent */}
      {inStock && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
      )}
    </div>
  );
};

export default ProductCard;