interface FavoritesHeaderProps {
  count: number;
  showCount: boolean;
}

export default function FavoritesHeader({ count, showCount }: FavoritesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-bold text-blue-800">علاقه‌مندی‌ها</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">محصولاتی که ذخیره کرده‌اید</p>
      </div>
      {showCount && (
        <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg whitespace-nowrap flex-shrink-0">
          {count} محصول
        </span>
      )}
    </div>
  );
}