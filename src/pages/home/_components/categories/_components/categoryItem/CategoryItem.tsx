import { Link } from "react-router";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { ProductCategory } from "@/store/useProductCategoriesStore";

export function CategoryItem({ catg }: { catg: ProductCategory }) {
  return (
    <Link
      to={`/category/${catg.slug}`}
      className="flex flex-col items-center gap-2 sm:gap-3 flex-shrink-0 w-20 sm:w-28 group"
    >
      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:shadow-lg transition-all duration-300">
        {catg.picture ? (
          <img
            src={`${IMAGE_BASE}/pictures/${catg.picture}`}
            alt={catg.pictureAlt ?? catg.name}
            className="w-9 h-9 sm:w-12 sm:h-12 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
          />
        ) : (
          <span className="text-base sm:text-xl font-bold text-blue-800 group-hover:text-white transition-colors duration-300">
            {catg.name?.[0]}
          </span>
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-blue-800 text-center leading-4 sm:leading-5 line-clamp-2 transition-colors duration-200">
        {catg.name}
      </span>
    </Link>
  );
}