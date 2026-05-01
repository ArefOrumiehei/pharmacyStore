/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { IconHeart, IconShoppingCart, IconHeartOff } from "@tabler/icons-react";
import { Link } from "react-router";
import { useProductStore } from "@/store/useProductsStore";
import { useUserStore } from "@/store/useAccountStore";
import { IMAGE_BASE } from "@/apis/apiInstance";

const formatPrice = (price: number) => new Intl.NumberFormat("fa-IR").format(price);

export default function Favorites() {
  const { removeFromFavorites, loading } = useProductStore();
  const { fetchUserFavorites, userFavorites } = useUserStore();

  useEffect(() => {
    fetchUserFavorites();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-blue-800">علاقه‌مندی‌ها</h1>
          <p className="text-sm text-gray-400 mt-0.5">محصولاتی که ذخیره کرده‌اید</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-blue-100 rounded-2xl p-4 space-y-3">
              <div className="w-full h-40 bg-blue-50 animate-pulse rounded-xl" />
              <div className="h-4 bg-blue-50 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-blue-50 animate-pulse rounded w-1/2" />
              <div className="h-9 bg-blue-50 animate-pulse rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">علاقه‌مندی‌ها</h1>
          <p className="text-sm text-gray-400 mt-0.5">محصولاتی که ذخیره کرده‌اید</p>
        </div>
        {userFavorites?.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
            {userFavorites.length} محصول
          </span>
        )}
      </div>

      {/* Empty */}
      {!userFavorites || userFavorites.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <IconHeart size={28} className="text-blue-300" />
          </div>
          <p className="text-sm text-gray-500">هنوز محصولی به علاقه‌مندی‌ها اضافه نشده</p>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userFavorites.map((item: any) => (
            <div
              key={item.id}
              className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-sm hover:border-blue-200 transition-all duration-200 flex flex-col"
            >
              {/* Image */}
              <Link
                to={`/product/${encodeURIComponent(item.categoryFullSlug)}/${encodeURIComponent(item.slug)}`}
              >
                <div className="w-full h-40 bg-blue-50/50 flex items-center justify-center border-b border-blue-50 overflow-hidden">
                  <img
                    src={`${IMAGE_BASE}${item.picture}`}
                    alt={item.name}
                    className="h-full w-full object-contain p-3 hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Name */}
                <Link
                  to={`/product/${encodeURIComponent(item.categoryFullSlug)}/${encodeURIComponent(item.slug)}`}
                >
                  <h3 className="text-sm font-semibold text-gray-700 line-clamp-2 hover:text-blue-800 transition-colors">
                    {item.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-1 mt-auto">
                  {item.hasDiscount ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.price)} تومان
                      </span>
                      <span className="text-base font-bold text-blue-800">
                        {formatPrice(item.priceWithDiscount)} تومان
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-blue-800">
                      {formatPrice(item.price)} تومان
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 active:scale-95 py-2.5 rounded-xl transition-all duration-150"
                  >
                    <IconShoppingCart size={14} />
                    افزودن به سبد
                  </button>
                  <button
                    onClick={() => removeFromFavorites(item.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all duration-150 flex-shrink-0"
                    title="حذف از علاقه‌مندی‌ها"
                  >
                    <IconHeartOff size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}