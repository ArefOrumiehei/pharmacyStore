import { Link } from "react-router";
import { IconHeart } from "@tabler/icons-react";

export default function FavoritesEmptyState() {
  return (
    <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center py-10 sm:py-16 gap-3 sm:gap-4 px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconHeart size={22} className="text-blue-300 sm:w-7 sm:h-7" />
      </div>
      <p className="text-xs sm:text-sm text-gray-500 text-center">
        هنوز محصولی به علاقه‌مندی‌ها اضافه نشده
      </p>
      <Link
        to="/plp"
        className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200"
      >
        مشاهده محصولات
      </Link>
    </div>
  );
}