import { IconX } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { FilterState } from "../../lib/plpFilters";
import FilterPanel from "../filterPanel/FilterPanel";

export default function MobileFilterDrawer({
    open,
    onClose,
    filters,
    brands,
    activeCount,
    onChange,
    onReset,
    totalCount,
}: {
    open: boolean;
    onClose: () => void;
    filters: FilterState;
    brands: string[];
    activeCount: number;
    onChange: (p: Partial<FilterState>) => void;
    onReset: () => void;
    totalCount: number;
}) {
    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-blue-50 sticky top-0 bg-white z-10">
                    <span className="font-bold text-blue-800 text-base">فیلترها</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-blue-50 text-gray-400 transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                </div>
                <div className="p-4">
                    <FilterPanel
                        filters={filters}
                        brands={brands}
                        activeCount={activeCount}
                        onChange={onChange}
                        onReset={onReset}
                    />
                </div>
                <div className="sticky bottom-0 p-4 bg-white border-t border-blue-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all duration-150"
                    >
                        نمایش {toPersianDigits(totalCount)} محصول
                    </button>
                </div>
            </div>
        </>
    );
}