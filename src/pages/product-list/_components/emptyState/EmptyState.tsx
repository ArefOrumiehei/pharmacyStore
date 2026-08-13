import { IconPackage, IconX } from "@tabler/icons-react";

export default function EmptyState({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 gap-4 bg-white border border-blue-100 rounded-2xl px-4 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <IconPackage size={28} className="text-blue-300" />
            </div>
            <div>
                <p className="text-gray-600 font-medium text-sm sm:text-md">محصولی یافت نشد</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {hasFilters ? "فیلترهای انتخابی را تغییر دهید" : "محصولات به زودی اضافه می‌شوند"}
                </p>
            </div>
            {hasFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
                >
                    <IconX size={14} />
                    پاک کردن فیلترها
                </button>
            )}
        </div>
    );
}