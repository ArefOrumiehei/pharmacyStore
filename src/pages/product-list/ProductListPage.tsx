/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { IconFilter } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { useProductSearchStore } from "@/store/useProductSearchStore";
import type { Product } from "@/store/useProductsStore";
import { DEFAULT_FILTERS, filtersFromParams, filtersToParams, MAX_PRICE, sortEnLabelToValue, type FilterState } from "./lib/plpFilters";

// Components
import Breadcrumb from "@/components/common/breadcrumb/Breadcrumb";
import SortDropdown from "./_components/sortDropdown/SortDropdown";
import FilterPanel from "./_components/filterPanel/FilterPanel";
import ProductGridSkeleton from "./_components/productGridSkeleton/ProductGridSkeleton";
import EmptyState from "./_components/emptyState/EmptyState";
import ProductCard from "./_components/productCard/ProductCard";
import Pagination from "./_components/pagination/Pagination";
import MobileFilterDrawer from "./_components/mobileFilterDrawer/MobileFilterDrawer";
import { Skeleton } from "@/components/ui/skeleton";


export default function ProductListPage() {
    const params = useParams<{ "*": string }>();
    const slugSegments = (params["*"] ?? "").split("/").filter(Boolean);
    const categorySlug = slugSegments[slugSegments.length - 1] ?? undefined;

    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState<FilterState>(() => filtersFromParams(searchParams));
    const [sort, setSort] = useState<number>(() => sortEnLabelToValue(searchParams.get("sort")));
    const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { items, loading, totalPages, currentPage, totalCount, fetchResults, reset } = useProductSearchStore();

    /* Sync URL <-> fetch on every meaningful change */
    useEffect(() => {
        const brandSlug = searchParams.get("brand") ?? undefined;

        fetchResults({
            searchTerm: filters.search || undefined,
            categoryFullSlug: params["*"],
            minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
            maxPrice: filters.maxPrice < MAX_PRICE ? filters.maxPrice : undefined,
            onlyInStock: filters.inStockOnly ? true : undefined,
            hasDiscount: filters.hasDiscount ? true : undefined,
            brand: filters.brand ?? brandSlug,
            sortBy: sort,
            page,
            pageSize: 12,
        } as Parameters<typeof fetchResults>[0]);

        const urlParams = filtersToParams(filters, sort, page);
        // if (brandSlug) urlParams.brand = brandSlug;
        setSearchParams(urlParams, { replace: true });
    }, [filters, sort, page, categorySlug, searchParams.get("brand")]);

    // Reset store when leaving this page entirely
    useEffect(() => () => reset(), []);

    const availableBrands: string[] = [
        ...new Set(items?.map((item) => item.brand).filter((brand): brand is string => Boolean(brand)) ?? []),
    ];

    const activeFilterCount = [
        !!filters.brand,
        filters.minPrice > DEFAULT_FILTERS.minPrice,
        filters.maxPrice < DEFAULT_FILTERS.maxPrice,
        filters.minRating > 0,
        filters.inStockOnly,
        filters.hasDiscount,
    ].filter(Boolean).length;

    const handleFilterChange = useCallback((patch: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...patch }));
        setPage(1);
    }, []);

    const handleReset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }, []);

    const handleSortChange = useCallback((value: number) => {
        setSort(value);
        setPage(1);
    }, []);

    const pageTitle = categorySlug?.replace(/-/g, " ") ?? (searchParams.get("q") ? `نتایج جستجو برای "${searchParams.get("q")}"` : "همه محصولات");

    return (
        <div className="w-full py-6 px-2" dir="rtl">
            <Breadcrumb categories={params["*"] ?? ""} />

            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 my-6 flex-wrap">
                <div>
                    <h1 className="text-md md:text-lg sm:text-xl font-bold text-blue-800">{pageTitle}</h1>
                    {loading ? 
                        <Skeleton className="w-full h-3 mt-0.5" />
                        :  
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{toPersianDigits(totalCount)} محصول یافت شد</p>
                    }
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <SortDropdown value={sort} onChange={handleSortChange} />

                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="lg:hidden flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2.5 rounded-xl transition-all duration-200 relative"
                    >
                        <IconFilter size={16} />
                        <span className="hidden sm:inline">فیلترها</span>
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-blue-800 text-white text-[10px] flex items-center justify-center font-bold">
                                {toPersianDigits(activeFilterCount)}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main layout */}
            <div className="flex gap-6 items-start">
                <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-36 self-start">
                    <FilterPanel
                        filters={filters}
                        brands={availableBrands}
                        activeCount={activeFilterCount}
                        onChange={handleFilterChange}
                        onReset={handleReset}
                    />
                </aside>

                <div className="flex-1 min-w-0 w-full">
                    {loading ? (
                        <ProductGridSkeleton />
                    ) : !items.length ? (
                        <EmptyState onReset={handleReset} hasFilters={activeFilterCount > 0 || !!filters.search} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {items.map((p) => (
                                    <ProductCard key={p.id} product={p as unknown as Product} />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <Pagination
                                    page={currentPage}
                                    total={totalPages}
                                    onChange={(p) => {
                                        setPage(p);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>

            </div>

            <MobileFilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                filters={filters}
                brands={availableBrands}
                activeCount={activeFilterCount}
                onChange={handleFilterChange}
                onReset={handleReset}
                totalCount={totalCount}
            />
        </div>
    );
}