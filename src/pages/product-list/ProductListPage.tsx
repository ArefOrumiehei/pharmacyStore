/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import {
  IconFilter,
  IconX,
  IconStarFilled,
  IconShoppingCart,
  IconHeart,
  IconHeartFilled,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconAdjustmentsHorizontal,
  IconPercentage,
  IconSearch,
  IconSortAscending,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { useProductStore } from "@/store/useProductsStore";
import { useProductCategoriesStore } from "@/store/useProductCategoriesStore";
import { useCartStore } from "@/store/useCartStore";

const IMAGE_BASE = "https://tk9839fd-5000.euw.devtunnels.ms/pictures/";
const formatPrice = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

interface FilterState {
  search: string;
  categoryId: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  hasDiscount: boolean;
  sortBy: string;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categoryId: "",
  brands: [],
  minPrice: 0,
  maxPrice: 5000000,
  minRating: 0,
  inStockOnly: false,
  hasDiscount: false,
  sortBy: "newest",
};

const SORT_OPTIONS = [
  { value: "newest",     label: "جدیدترین" },
  { value: "price_asc",  label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
  { value: "rating",     label: "بهترین امتیاز" },
  { value: "popular",    label: "پرفروش‌ترین" },
];

const MOCK_BRANDS = ["داروپخش", "رازی", "ابوریحان", "باریج اسانس", "زاگرس فارمد", "البرز دارو"];

const ITEMS_PER_PAGE = 12;

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    search: searchParams.get("q") ?? "",
    categoryId: searchParams.get("category") ?? "",
  });

  const { product, loading, fetchLatestArrivals } = useProductStore();
  const { categories, fetchAllProductCategories } = useProductCategoriesStore();

  useEffect(() => {
    fetchAllProductCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLatestArrivals();
  }, [filters, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeFilterCount = [
    filters.categoryId !== "",
    filters.brands.length > 0,
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

  const totalPages = Math.ceil((product?.total ?? 0) / ITEMS_PER_PAGE) || 1;

  return (
    <div className="w-full py-6" dir="rtl">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-blue-800">محصولات</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {product?.total ?? 0} محصول یافت شد
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <IconSearch size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="جستجو در محصولات..."
              className="border border-blue-100 bg-blue-50/30 rounded-xl pl-4 pr-9 py-2.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
            />
          </div>

          <SortDropdown value={filters.sortBy} onChange={(v) => handleFilterChange({ sortBy: v })} />

          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2.5 rounded-xl transition-all duration-200 relative"
          >
            <IconFilter size={16} />
            فیلترها
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-blue-800 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-6 items-start">

        {/* Desktop sidebar — sticky, page scrolls normally */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
          <FilterPanel
            filters={filters}
            categories={categories ?? []}
            brands={MOCK_BRANDS}
            activeCount={activeFilterCount}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </aside>

        {/* Product grid — normal page flow, no nested scroll */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton />
          ) : !product?.items?.length ? (
            <EmptyState onReset={handleReset} hasFilters={activeFilterCount > 0} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {product.items.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination page={page} total={totalPages} onChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-blue-50 sticky top-0 bg-white z-10">
              <span className="font-bold text-blue-800 text-base">فیلترها</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-blue-50 text-gray-400 transition-colors"
              >
                <IconX size={18} />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                filters={filters}
                categories={categories ?? []}
                brands={MOCK_BRANDS}
                activeCount={activeFilterCount}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-blue-50">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-150"
              >
                نمایش نتایج
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   FILTER PANEL
══════════════════════════════════════════ */
function FilterPanel({
  filters,
  categories,
  brands,
  activeCount,
  onChange,
  onReset,
}: {
  filters: FilterState;
  categories: any[];
  brands: string[];
  activeCount: number;
  onChange: (p: Partial<FilterState>) => void;
  onReset: () => void;
}) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50 bg-blue-50/50">
        <div className="flex items-center gap-2">
          <IconAdjustmentsHorizontal size={16} className="text-blue-800" />
          <span className="text-sm font-bold text-blue-800">فیلترها</span>
          {activeCount > 0 && (
            <span className="text-xs bg-blue-800 text-white px-1.5 py-0.5 rounded-full font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            پاک کردن
          </button>
        )}
      </div>

      <div className="divide-y divide-blue-50">
        <FilterSection title="جستجو">
          <div className="relative">
            <IconSearch size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              placeholder="نام محصول یا برند..."
              className="w-full border border-blue-100 bg-blue-50/30 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </FilterSection>

        <FilterSection title="مرتب‌سازی">
          <div className="flex flex-col gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ sortBy: opt.value })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                  filters.sortBy === opt.value
                    ? "bg-blue-50 border border-blue-200 text-blue-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
                {filters.sortBy === opt.value && <IconCheck size={14} className="text-blue-800" />}
              </button>
            ))}
          </div>
        </FilterSection>

        {categories.length > 0 && (
          <FilterSection title="دسته‌بندی">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onChange({ categoryId: "" })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                  filters.categoryId === ""
                    ? "bg-blue-50 border border-blue-200 text-blue-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                همه دسته‌ها
                {filters.categoryId === "" && <IconCheck size={14} className="text-blue-800" />}
              </button>
              {categories.slice(0, 8).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => onChange({ categoryId: String(cat.id) })}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                    filters.categoryId === String(cat.id)
                      ? "bg-blue-50 border border-blue-200 text-blue-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                  </span>
                  {filters.categoryId === String(cat.id) && (
                    <IconCheck size={14} className="text-blue-800" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        <FilterSection title="محدوده قیمت">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatPrice(filters.minPrice)} تومان</span>
              <span>{formatPrice(filters.maxPrice)} تومان</span>
            </div>
            <input
              type="range"
              min={0}
              max={5000000}
              step={50000}
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

        <FilterSection title="برند">
          <div className="flex flex-col gap-1">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div
                  onClick={() => {
                    const next = filters.brands.includes(brand)
                      ? filters.brands.filter((b) => b !== brand)
                      : [...filters.brands, brand];
                    onChange({ brands: next });
                  }}
                  className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 cursor-pointer ${
                    filters.brands.includes(brand)
                      ? "bg-blue-800 border-blue-800"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {filters.brands.includes(brand) && (
                    <IconCheck size={10} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="حداقل امتیاز">
          <div className="flex flex-col gap-1">
            {[4, 3, 2, 0].map((r) => (
              <button
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
                {filters.minRating === r && (
                  <IconCheck size={13} className="text-blue-800 mr-auto" />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="سایر فیلترها">
          <div className="flex flex-col gap-3">
            <ToggleFilter
              label="فقط موجود"
              desc="محصولاتی که در انبار هستند"
              checked={filters.inStockOnly}
              onChange={() => onChange({ inStockOnly: !filters.inStockOnly })}
              color="green"
            />
            <ToggleFilter
              label="دارای تخفیف"
              desc="محصولاتی که تخفیف دارند"
              checked={filters.hasDiscount}
              onChange={() => onChange({ hasDiscount: !filters.hasDiscount })}
              color="rose"
              icon={<IconPercentage size={13} className="text-rose-500" />}
            />
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="px-4 py-3">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-800 transition-colors">
          {title}
        </span>
        <IconChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </div>
  );
}

function ToggleFilter({
  label,
  desc,
  checked,
  onChange,
  color = "blue",
  icon,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
  color?: "blue" | "green" | "rose";
  icon?: React.ReactNode;
}) {
  const trackColor = {
    blue: "bg-blue-800",
    green: "bg-green-600",
    rose: "bg-rose-500",
  }[color];

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {desc && <p className="text-xs text-gray-400">{desc}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${
          checked ? trackColor : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "مرتب‌سازی";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2.5 rounded-xl transition-all duration-200"
      >
        <IconSortAscending size={16} />
        {label}
        <IconChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-blue-100 rounded-2xl shadow-lg z-30 py-1.5 min-w-[160px]">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150 ${
                value === opt.value
                  ? "text-blue-800 font-semibold bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
              {value === opt.value && <IconCheck size={13} className="text-blue-800" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════ */
function ProductCard({ product }: { product: any }) {
  const [favorited, setFavorited] = useState(product.currentUserFaved ?? false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToFavorites, removeFromFavorites } = useProductStore();
  const { addToCart } = useCartStore();

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    const prev = favorited;
    setFavorited(!prev);
    try {
      if (prev) await removeFromFavorites(product.id);
      else await addToFavorites(product.id);
    } catch {
      setFavorited(prev);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isInStock || addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } finally {
      setAddingToCart(false);
    }
  };

  const displayPrice = product.hasDiscount ? product.priceWithDiscount : product.price;
  const rating = Number(product.avgRate ?? 0);

  return (
    <Link
      to={`/product/${encodeURIComponent(product.categoryFullSlug)}/${encodeURIComponent(product.slug)}`}
      className="group bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col"
    >
      <div className="relative w-full aspect-square bg-blue-50/40 overflow-hidden flex items-center justify-center border-b border-blue-50">
        <img
          src={`${IMAGE_BASE}${product.picture}`}
          alt={product.name}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.hasDiscount && (
            <span className="flex items-center gap-0.5 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              <IconPercentage size={10} />
              {product.discountRate}٪
            </span>
          )}
          {!product.isInStock && (
            <span className="bg-gray-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              ناموجود
            </span>
          )}
        </div>

        <button
          onClick={handleFavorite}
          className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/80 hover:bg-white border border-blue-100 flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 active:scale-90"
        >
          {favorited
            ? <IconHeartFilled size={15} className="text-rose-500" />
            : <IconHeart size={15} className="text-gray-400" />
          }
        </button>
      </div>

      <div className="flex flex-col gap-2.5 p-4 flex-1">
        <span className="text-xs text-blue-800 font-medium bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full w-fit">
          {product.categoryName}
        </span>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-6 group-hover:text-blue-800 transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStarFilled
                key={i}
                size={12}
                className={i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.rateCount ?? 0})</span>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-blue-50">
          <div className="flex flex-col items-start">
            {product.hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)} ت
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-blue-800">
                {formatPrice(displayPrice)}
              </span>
              <span className="text-xs text-gray-400">تومان</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isInStock || addingToCart}
            className={`flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0 ${
              addedToCart
                ? "bg-green-50 border border-green-200 text-green-700"
                : product.isInStock
                ? "bg-blue-800 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {addingToCart ? (
              <IconLoader2 size={14} className="animate-spin" />
            ) : addedToCart ? (
              <>
                <IconCheck size={14} />
                افزوده شد
              </>
            ) : product.isInStock ? (
              <>
                <IconShoppingCart size={14} />
                سبد خرید
              </>
            ) : (
              "ناموجود"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════
   PAGINATION
══════════════════════════════════════════ */
function Pagination({
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
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
      >
        <IconChevronRight size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 ${
              page === p
                ? "bg-blue-800 text-white shadow-sm shadow-blue-200"
                : "border border-blue-100 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-800"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
      >
        <IconChevronLeft size={16} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SKELETONS + EMPTY
══════════════════════════════════════════ */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-2xl overflow-hidden">
          <div className="aspect-square bg-blue-50 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-blue-50 animate-pulse rounded-full w-1/3" />
            <div className="h-4 bg-blue-50 animate-pulse rounded w-full" />
            <div className="h-4 bg-blue-50 animate-pulse rounded w-3/4" />
            <div className="h-3 bg-blue-50 animate-pulse rounded w-1/4" />
            <div className="flex items-center justify-between pt-2 border-t border-blue-50">
              <div className="h-5 bg-blue-50 animate-pulse rounded w-1/3" />
              <div className="h-8 bg-blue-50 animate-pulse rounded-xl w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  onReset,
  hasFilters,
}: {
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white border border-blue-100 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconSearch size={28} className="text-blue-300" />
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">محصولی یافت نشد</p>
        <p className="text-gray-400 text-sm mt-1">
          {hasFilters
            ? "فیلترهای انتخابی را تغییر دهید"
            : "محصولات به زودی اضافه می‌شوند"}
        </p>
      </div>
      {hasFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <IconX size={14} />
          پاک کردن فیلترها
        </button>
      )}
    </div>
  );
}