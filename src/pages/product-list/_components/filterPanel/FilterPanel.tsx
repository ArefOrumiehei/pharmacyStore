import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { MAX_PRICE, type FilterState } from "../../lib/plpFilters";
import FilterSection from "./_components/filterSection/FilterSection";
import ToggleFilter from "./_components/toggleFilter/ToggleFilter";
import BrandSelect from "./_components/brandSelect/BrandSelect";

// const RATING_OPTIONS = [4, 3, 2, 0];

export default function FilterPanel({
    filters,
    brands,
    activeCount,
    onChange,
    onReset,
}: {
    filters: FilterState;
    brands: string[];
    activeCount: number;
    onChange: (p: Partial<FilterState>) => void;
    onReset: () => void;
}) {
    return (
        <div className="bg-white border border-blue-100 rounded-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50 bg-blue-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <IconAdjustmentsHorizontal size={16} className="text-blue-800" />
                    <span className="text-sm font-bold text-blue-800">فیلترها</span>
                    {activeCount > 0 && (
                        <span className="text-xs bg-blue-800 text-white px-1.5 py-0.5 rounded-full font-bold">
                            {toPersianDigits(activeCount)}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                    >
                        پاک کردن
                    </button>
                )}
            </div>

            <div className="divide-y divide-blue-50">
                {/* Search */}
                <FilterSection title="جستجو">
                    <div className="relative">
                        <IconSearch
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            value={filters.search}
                            onChange={(e) => onChange({ search: e.target.value })}
                            placeholder="نام محصول یا برند..."
                            className="w-full border border-blue-100 bg-blue-50/30 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400 transition-all duration-200"
                        />
                    </div>
                </FilterSection>

                {/* Price range */}
                <FilterSection title="محدوده قیمت">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{toPersianDigits(filters.minPrice)} تومان</span>
                            <span>{toPersianDigits(filters.maxPrice)} تومان</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={MAX_PRICE}
                            step={100_000}
                            value={filters.maxPrice}
                            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
                            className="w-full accent-blue-800 h-1.5 rounded-full cursor-pointer"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">از</label>
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
                                    className="border border-blue-100 bg-blue-50/30 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">تا</label>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
                                    className="border border-blue-100 bg-blue-50/30 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
                                />
                            </div>
                        </div>
                    </div>
                </FilterSection>

                {/* Brand — searchable single-select, de-duplicated */}
                <FilterSection title="برند" defaultOpen={false}>
                    {brands.length > 0 && (
                        <BrandSelect
                            brands={brands}
                            value={filters.brand}
                            onChange={(brand) => onChange({ brand })}
                        />
                    )}
                </FilterSection>

                {/* Rating */}
                {/* <FilterSection title="حداقل امتیاز">
                    <div className="flex flex-col gap-1">
                        {RATING_OPTIONS.map((r) => (
                            <button
                                type="button"
                                key={r}
                                onClick={() => onChange({ minRating: r })}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                                    filters.minRating === r
                                        ? "bg-blue-50 border border-blue-200 text-blue-800"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {r === 0 ? (
                                    <span>همه</span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <IconStarFilled
                                                key={i}
                                                size={12}
                                                className={i < r ? "text-amber-400" : "text-gray-200"}
                                            />
                                        ))}
                                        <span className="text-xs mr-1">و بالاتر</span>
                                    </span>
                                )}
                                {filters.minRating === r && <IconCheck size={13} className="text-blue-800 mr-auto" />}
                            </button>
                        ))}
                    </div>
                </FilterSection> */}

                {/* Toggles */}
                <FilterSection title="سایر فیلترها" defaultOpen={false}>
                    <div className="flex flex-col gap-3">
                        <ToggleFilter
                            label="فقط موجود"
                            desc="محصولاتی که در انبار هستند"
                            checked={filters.inStockOnly}
                            onChange={() => onChange({ inStockOnly: !filters.inStockOnly })}
                            color="blue"
                        />
                        <ToggleFilter
                            label="دارای تخفیف"
                            desc="محصولاتی که تخفیف دارند"
                            checked={filters.hasDiscount}
                            onChange={() => onChange({ hasDiscount: !filters.hasDiscount })}
                            color="green"
                        />
                    </div>
                </FilterSection>
            </div>
        </div>
    );
}