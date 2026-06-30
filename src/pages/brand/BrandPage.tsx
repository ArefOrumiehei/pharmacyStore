import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconSortAscending,
  IconCheck,
  IconStarFilled,
  IconShoppingCart,
  IconHeart,
  IconHeartFilled,
  IconPercentage,
  IconLoader2,
  IconPackage,
  IconBuildingStore,
} from "@tabler/icons-react";
import { useBrandStore } from "@/store/useBrandStore";
import { useProductStore } from "@/store/useProductsStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { Product } from "@/store/useProductsStore";
import type { Brand } from "@/store/useBrandStore";
import { toPersianDigits } from "smart-persian-tools";

/* ─────────────────────────────────────────
  CONSTANTS
───────────────────────────────────────── */
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest",    label: "جدیدترین"     },
  { value: "price_asc", label: "ارزان‌ترین"   },
  { value: "price_desc",label: "گران‌ترین"    },
  { value: "rating",    label: "بهترین امتیاز" },
  { value: "popular",   label: "پرفروش‌ترین"  },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function BrandPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage]               = useState(Number(searchParams.get("page") ?? 1));
  const [sortBy, setSortBy]           = useState(searchParams.get("sort") ?? "newest");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") ?? "");

  const { selectedBrand, loading, error, fetchBrandByName, clearBrand } = useBrandStore();

  // Fetch when slug or page changes
  useEffect(() => {
    if (!brandSlug) return;
    fetchBrandByName(brandSlug, page, PAGE_SIZE);
    return () => clearBrand();
  }, [brandSlug, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state → URL
  useEffect(() => {
    const p: Record<string, string> = {};
    if (page > 1)        p.page = String(page);
    if (sortBy !== "newest") p.sort = sortBy;
    if (activeCategory)  p.cat = activeCategory;
    setSearchParams(p, { replace: true });
  }, [page, sortBy, activeCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  // Client-side sort + category filter on current page items
  const displayProducts = useMemo(() => {
    let list = [...(selectedBrand?.products?.items ?? [])];

    if (activeCategory) {
      list = list.filter((p) => p.categoryName === activeCategory);
    }

    switch (sortBy) {
      case "price_asc":  list.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": list.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "rating":     list.sort((a, b) => (b.avgRate ?? 0) - (a.avgRate ?? 0)); break;
      case "popular":    list.sort((a, b) => (b.rateCount ?? 0) - (a.rateCount ?? 0)); break;
    }

    return list;
  }, [selectedBrand, sortBy, activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const brand       = selectedBrand;
  const categories  = brand?.categories ?? [];
  const pagination  = brand?.products;
  const totalPages  = pagination?.totalPages ?? 1;

  return (
    <div className="w-full py-6" dir="rtl">

      {/* ── Brand hero ── */}
      {loading && !brand ? (
        <BrandHeroSkeleton />
      ) : error ? (
        <ErrorState />
      ) : brand ? (
        <BrandHero brand={brand} />
      ) : null}

      {/* ── Controls bar ── */}
      <div className="mt-6 flex flex-col gap-3">

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <CategoryPill
              label="همه محصولات"
              active={activeCategory === ""}
              onClick={() => handleCategoryChange("")}
            />
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
              />
            ))}
          </div>
        )}

        {/* Sort + result count */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            {toPersianDigits(pagination?.totalCount ?? 0)} محصول
          </p>
          <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} />
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="mt-4">
        {loading ? (
          <ProductGridSkeleton />
        ) : displayProducts.length === 0 ? (
          <EmptyState onReset={() => handleCategoryChange("")} hasFilter={!!activeCategory} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {displayProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination page={page} total={totalPages} onChange={handlePageChange} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BRAND HERO
───────────────────────────────────────── */
function BrandHero({ brand }: { brand: Brand }) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
      {/* Logo */}
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl border border-blue-100 bg-blue-50/50 flex items-center justify-center overflow-hidden">
        {brand.picture ? (
          <img
            src={`${IMAGE_BASE}${brand.picture}`}
            alt={brand.pictureAlt ?? brand.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <IconBuildingStore size={36} className="text-blue-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 flex-1 text-center sm:text-right">
        <h1 className="text-2xl font-bold text-blue-800">{brand.name}</h1>
        {brand.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {brand.description}
          </p>
        )}
        <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap mt-1">
          <span className="text-xs text-blue-800 font-medium bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {toPersianDigits(brand.productsCount)} محصول
          </span>
          {brand.categories?.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
              {toPersianDigits(brand.categories.length)} دسته‌بندی
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BrandHeroSkeleton() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 flex items-center gap-5">
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl bg-blue-50 animate-pulse" />
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-6 w-40 bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-blue-50 animate-pulse rounded" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-20 bg-blue-50 animate-pulse rounded-full" />
          <div className="h-6 w-24 bg-blue-50 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CATEGORY PILLS
───────────────────────────────────────── */
function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
        active
          ? "bg-blue-800 border-blue-800 text-white shadow-sm shadow-blue-200"
          : "bg-white border-blue-100 text-gray-600 hover:border-blue-300 hover:text-blue-800"
      }`}
    >
      {active && <IconCheck size={13} strokeWidth={3} />}
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────
   SORT DROPDOWN
───────────────────────────────────────── */
function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
        <IconChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-blue-100 rounded-2xl shadow-lg z-30 py-1.5 min-w-[160px]">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
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

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const [favorited, setFavorited]     = useState(product.isCurrentUserFaved ?? false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart]   = useState(false);
  const { addToFavorites, removeFromFavorites } = useProductStore();
  const { addToCart, addToGuestCart }           = useCartStore();
  const { accessToken }                         = useAuthStore();

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    const prev = favorited;
    setFavorited(!prev);
    try {
      if (prev) await removeFromFavorites(product.id);
      else      await addToFavorites(product.id);
    } catch {
      setFavorited(prev);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isInStock || addingToCart) return;
    setAddingToCart(true);
    try {
      if (!accessToken) {
        addToGuestCart({
          productId:   product.id,
          productName: product.name,
          picture:     product.picture,
          unitPrice:   Number(product.priceWithDiscount ?? product.price),
          qty:         1,
        });
      } else {
        await addToCart(product.id, 1);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } finally {
      setAddingToCart(false);
    }
  };

  const displayPrice = product.hasDiscount ? product.priceWithDiscount : product.price;
  const rating       = Number(product.avgRate ?? 0);

  return (
    <Link
      to={`/product/${encodeURIComponent(product.categoryFullSlug)}/${encodeURIComponent(product.slug)}`}
      className="group bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-blue-50/40 overflow-hidden flex items-center justify-center border-b border-blue-50">
        <img
          src={`${IMAGE_BASE}${product.picture}`}
          alt={product.pictureAlt ?? product.name}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.hasDiscount && (
            <span className="flex items-center gap-0.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              <IconPercentage size={9} />
              {product.discountRate}٪
            </span>
          )}
          {!product.isInStock && (
            <span className="bg-gray-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              ناموجود
            </span>
          )}
        </div>
        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/80 hover:bg-white border border-blue-100 flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 active:scale-90"
        >
          {favorited
            ? <IconHeartFilled size={13} className="text-rose-500" />
            : <IconHeart size={13} className="text-gray-400" />}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-5 group-hover:text-blue-800 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStarFilled
                key={i}
                size={10}
                className={i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.rateCount ?? 0})</span>
        </div>

        {/* Price + cart */}
        <div className="flex items-end justify-between gap-1 mt-auto pt-2 border-t border-blue-50">
          <div className="flex flex-col">
            {product.hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through">
                {toPersianDigits(Number(product.price))}
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-blue-800">
                {toPersianDigits(Number(displayPrice))}
              </span>
              <span className="text-[10px] text-gray-400">ت</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isInStock || addingToCart}
            className={`flex items-center justify-center gap-1 text-[11px] font-semibold px-2 py-1.5 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0 ${
              addedToCart
                ? "bg-green-50 border border-green-200 text-green-700"
                : product.isInStock
                ? "bg-blue-800 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {addingToCart
              ? <IconLoader2 size={12} className="animate-spin" />
              : addedToCart
              ? <IconCheck size={12} />
              : <IconShoppingCart size={12} />}
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   PAGINATION
───────────────────────────────────────── */
function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
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
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <IconChevronRight size={16} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`d${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
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
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-800 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <IconChevronLeft size={16} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY + ERROR + SKELETON
───────────────────────────────────────── */
function EmptyState({ onReset, hasFilter }: { onReset: () => void; hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-blue-100 rounded-2xl">
      <IconPackage size={36} className="text-blue-200" />
      <p className="text-sm text-gray-500 font-medium">محصولی یافت نشد</p>
      {hasFilter && (
        <button
          onClick={onReset}
          className="text-sm text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
        >
          نمایش همه محصولات
        </button>
      )}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-rose-100 rounded-2xl">
      <IconPackage size={36} className="text-rose-200" />
      <p className="text-sm text-gray-500 font-medium">برند مورد نظر یافت نشد</p>
      <Link
        to="/"
        className="text-sm text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-2xl overflow-hidden">
          <div className="aspect-square bg-blue-50 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-blue-50 animate-pulse rounded w-full" />
            <div className="h-3 bg-blue-50 animate-pulse rounded w-2/3" />
            <div className="h-3 bg-blue-50 animate-pulse rounded w-1/4" />
            <div className="flex justify-between pt-2 border-t border-blue-50">
              <div className="h-4 bg-blue-50 animate-pulse rounded w-1/3" />
              <div className="h-6 w-7 bg-blue-50 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}