import { IMAGE_BASE } from "@/apis/apiInstance";
import type { Product } from "@/store/useProductsStore";
import { IconShoppingCartPlus, IconStarFilled, IconFlame, IconLeaf } from "@tabler/icons-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);

type ProductCardProps = {
  productData: Product;
  onAddToCart?: (id: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ productData, onAddToCart }) => {
  const discountPercent = productData.discountRate;

  return (
    <div
      dir="rtl"
      className="group relative w-[220px] h-full flex-shrink-0 bg-white rounded-2xl border border-blue-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/60 cursor-pointer"
    >
      {/* ── Image area ── */}
      <div className="relative bg-gradient-to-b from-blue-50/60 to-white px-6 pt-6 pb-3 flex items-center justify-center min-h-[170px]">
        <img
          src={`${IMAGE_BASE}${productData.picture}`}
          alt={productData.pictureAlt}
          className="w-[130px] h-[130px] object-contain drop-shadow-sm transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 24 24' fill='none' stroke='%23bfdbfe' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {productData.isBestSeller && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-500 text-white">
              <IconFlame size={11} />
              پرفروش
            </span>
          )}
          {productData.isGoodPrice && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500 text-white">
              <IconLeaf size={11} />
              خوش‌قیمت
            </span>
          )}
        </div>

        {/* Discount bubble */}
        {productData.hasDiscount && discountPercent && (
          <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-red-500 flex flex-col items-center justify-center shadow-sm">
            <span className="text-white font-black text-xs leading-none">{discountPercent}٪</span>
            <span className="text-red-200 text-[8px] leading-none mt-0.5">تخفیف</span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 px-4 pb-4 gap-3">

        {/* Name + category */}
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
            {productData.name}
          </h3>
          <span className="text-xs text-blue-600 font-medium">{productData.categoryName}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStarFilled
                key={i}
                size={11}
                className={i < Math.round(productData.avgRate) ? "text-amber-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {Number.isInteger(productData.avgRate)
              ? productData.avgRate
              : Number(productData.avgRate).toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">({formatPrice(productData.rateCount)})</span>
        </div>

        <div className="flex-1" />

        {/* Price + cart */}
        <div className="flex items-end justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(productData.id);
            }}
            className="w-9 h-9 rounded-xl bg-blue-800 hover:bg-blue-700 flex items-center justify-center flex-shrink-0 transition-colors duration-150 active:scale-90 shadow-sm shadow-blue-200"
          >
            <IconShoppingCartPlus size={17} className="text-white" />
          </button>

          <div className="flex flex-col items-end gap-0.5">
            {productData.hasDiscount && productData.priceWithDiscount ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(productData.price)} تومان
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-blue-800">
                    {formatPrice(productData.priceWithDiscount)}
                  </span>
                  <span className="text-xs text-gray-500">تومان</span>
                </div>
              </>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-blue-800">
                  {formatPrice(productData.price)}
                </span>
                <span className="text-xs text-gray-500">تومان</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
    </div>
  );
};

export default ProductCard;