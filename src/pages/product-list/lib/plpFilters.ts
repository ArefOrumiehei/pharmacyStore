export interface FilterState {
    search: string;
    brand: string | null;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    inStockOnly: boolean;
    hasDiscount: boolean;
}

export const MAX_PRICE = 10_000_000;

export const DEFAULT_FILTERS: FilterState = {
    search: "",
    brand: null,
    minPrice: 0,
    maxPrice: MAX_PRICE,
    minRating: 0,
    inStockOnly: false,
    hasDiscount: false,
};

export const SORT_OPTIONS: { value: number; label: string; enLabel: string }[] = [
    { value: 1, label: "جدیدترین", enLabel: "Newest" },
    { value: 2, label: "ارزان‌ترین", enLabel: "PriceAsc" },
    { value: 3, label: "گران‌ترین", enLabel: "PriceDesc" },
    { value: 4, label: "محبوب‌ترین", enLabel: "Popularuty" },
    { value: 5, label: "بیشترین تخفیف", enLabel: "HighestDiscount" },
    { value: 6, label: "پربازدیدترین", enLabel: "MostViewed" },
];

export function sortValueToEnLabel(value: number): string {
    return SORT_OPTIONS.find((o) => o.value === value)?.enLabel ?? SORT_OPTIONS[0].enLabel;
}

export function sortEnLabelToValue(label: string | null): number {
    return SORT_OPTIONS.find((o) => o.enLabel === label)?.value ?? SORT_OPTIONS[0].value;
}

export function filtersFromParams(params: URLSearchParams): FilterState {
    return {
        search:      params.get("q") ?? "",
        brand:       params.get("brand"),
        minPrice:    Number(params.get("minPrice") ?? 0),
        maxPrice:    Number(params.get("maxPrice") ?? MAX_PRICE),
        minRating:   Number(params.get("minRating") ?? 0),
        inStockOnly: params.get("inStock") === "1",
        hasDiscount: params.get("discount") === "1",
    };
}

export function filtersToParams(f: FilterState, sort: number, page: number): Record<string, string> {
    const p: Record<string, string> = {};
    if (f.search)               p.q = f.search;
    if (f.brand != null && f.brand !== "") p.brand = f.brand;
    if (f.minPrice > 0)         p.minPrice = String(f.minPrice);
    if (f.maxPrice < MAX_PRICE) p.maxPrice = String(f.maxPrice);
    if (f.minRating > 0)        p.minRating = String(f.minRating);
    if (f.inStockOnly)          p.inStock = "1";
    if (f.hasDiscount)          p.discount = "1";
    if (sort !== SORT_OPTIONS[0].value) p.sort = sortValueToEnLabel(sort);
    if (page > 1)                p.page = String(page);
    return p;
}