import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

export default function Pagination({
    page,
    total,
    onChange,
}: {
    page: number;
    total: number;
    onChange: (p: number) => void;
}) {
    const pages: (number | "...")[] = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i);
        if (page < total - 2) pages.push("...");
        pages.push(total);
    }

    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 flex-wrap">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
                <IconChevronRight size={16} />
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 text-sm">
                        ...
                    </span>
                ) : (
                    <button
                        type="button"
                        key={p}
                        onClick={() => onChange(p as number)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                            page === p
                                ? "bg-blue-800 text-white shadow-sm shadow-blue-200"
                                : "border border-blue-100 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-800"
                        }`}
                    >
                        {toPersianDigits(p)}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page === total}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
                <IconChevronLeft size={16} />
            </button>
        </div>
    );
}