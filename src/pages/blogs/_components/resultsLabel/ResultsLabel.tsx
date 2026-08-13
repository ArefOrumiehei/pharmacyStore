import { IconX } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

export default function ResultsLabel({
    count,
    category,
    search,
    onClear,
}: {
    count: number;
    category: string;
    search?: string;
    onClear: () => void;
}) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm text-gray-500">
                {toPersianDigits(count)} مقاله یافت شد
                {category !== "همه" && <span> در دسته «{category}»</span>}
                {search && <span> برای «{search}»</span>}
            </p>
            <button
                type="button"
                onClick={onClear}
                className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
                <IconX size={12} /> پاک کردن
            </button>
        </div>
    );
}