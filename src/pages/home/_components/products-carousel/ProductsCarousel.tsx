import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../productCard/ProductCard";
import { Link } from "react-router";
import {
  IconArrowLeft,
  IconFlameFilled,
  IconStarFilled,
  IconTrendingUp,
  IconSparkles,
  IconClockHour3,
  IconMoodEmpty,
} from "@tabler/icons-react";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import type { Product } from "@/store/useProductsStore";

/* ─────────────────────────────────────────
   VARIANT CONFIG
───────────────────────────────────────── */
export type CarouselVariant = "latest" | "topRated" | "recommended" | "forYou" | "default";

interface VariantStyle {
  wrapper: string;
  header: string;
  headerBg: string;
  divider: string;
  viewMore: string;
  arrowBtn: string;
  icon: React.ReactNode;
  emptyText: string;
}

const VARIANT_STYLES: Record<CarouselVariant, VariantStyle> = {
  latest: {
    wrapper: "bg-white border border-blue-100",
    header: "text-blue-800",
    headerBg: "bg-white",
    divider: "border-blue-100",
    viewMore: "text-blue-800 hover:text-blue-600",
    arrowBtn: "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200",
    icon: <IconClockHour3 size={20} className="text-blue-500" />,
    emptyText: "محصول جدیدی برای نمایش وجود ندارد",
  },
  topRated: {
    wrapper: "bg-orange-50 border border-orange-200",
    header: "text-orange-600",
    headerBg: "bg-orange-50",
    divider: "border-orange-200",
    viewMore: "text-orange-600 hover:text-orange-700",
    arrowBtn: "bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200",
    icon: <IconFlameFilled size={20} className="text-orange-500" />,
    emptyText: "محصول برتری برای نمایش وجود ندارد",
  },
  recommended: {
    wrapper: "bg-white border border-emerald-100",
    header: "text-emerald-700",
    headerBg: "bg-white",
    divider: "border-emerald-100",
    viewMore: "text-emerald-700 hover:text-emerald-600",
    arrowBtn: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: <IconTrendingUp size={20} className="text-emerald-500" />,
    emptyText: "محصول پرفروشی برای نمایش وجود ندارد",
  },
  forYou: {
    wrapper: "bg-violet-50 border border-violet-100",
    header: "text-violet-700",
    headerBg: "bg-violet-50",
    divider: "border-violet-100",
    viewMore: "text-violet-700 hover:text-violet-600",
    arrowBtn: "bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-200",
    icon: <IconSparkles size={20} className="text-violet-500" />,
    emptyText: "پیشنهادی برای نمایش وجود ندارد",
  },
  default: {
    wrapper: "bg-white border border-blue-100",
    header: "text-blue-800",
    headerBg: "bg-white",
    divider: "border-blue-100",
    viewMore: "text-blue-800 hover:text-blue-600",
    arrowBtn: "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200",
    icon: <IconStarFilled size={20} className="text-blue-400" />,
    emptyText: "محصولی برای نمایش وجود ندارد",
  },
};

const SKELETON_COUNT = 6;

/* ─── PROPS ───── */
interface ProductsCarouselProps {
  title: string;
  products?: Product[];
  loading?: boolean;
  viewMoreLink?: string;
  variant?: CarouselVariant;
}

/* ─────────COMPONENT──────── */
function ProductsCarousel({
  title,
  products,
  loading = false,
  viewMoreLink,
  variant = "default",
}: ProductsCarouselProps) {
  const s = VARIANT_STYLES[variant];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Three clear states
  const hasProducts = !loading && Array.isArray(products) && products.length > 0;
  const isEmpty = !loading && (!Array.isArray(products) || products.length === 0);

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const absScroll = Math.abs(slider.scrollLeft);
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    setAtStart(absScroll <= 2);
    setAtEnd(absScroll >= maxScroll - 2);
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    checkScrollPosition();
    slider.addEventListener("scroll", checkScrollPosition, { passive: true });
    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? 350 : -350,
      behavior: "smooth",
    });
  };

  const dragState = useRef({ isDown: false, startX: 0, scrollStart: 0 });
  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX - slider.offsetLeft,
      scrollStart: slider.scrollLeft,
    };
  };
  const handleMouseLeave = () => { dragState.current.isDown = false; };
  const handleMouseUp = () => { dragState.current.isDown = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider || !dragState.current.isDown) return;
    e.preventDefault();
    const walk = (e.pageX - slider.offsetLeft - dragState.current.startX) * 1.5;
    slider.scrollLeft = dragState.current.scrollStart - walk;
  };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${s.wrapper}`}>
      {/* Header — always visible */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${s.divider} ${s.headerBg}`}>
        <div className="flex items-center gap-2">
          {s.icon}
          <h3 className={`text-lg font-bold ${s.header}`}>{title}</h3>
        </div>
        {viewMoreLink && hasProducts && (
          <Link
            to={viewMoreLink}
            className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${s.viewMore}`}
          >
            مشاهده همه
            <IconArrowLeft size={16} />
          </Link>
        )}
      </div>

      {/* Body */}
      <div className="relative px-4 py-4">

        {/* ── SKELETON ── */}
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center" dir="rtl">
            <IconMoodEmpty size={36} className="text-gray-300" />
            <p className="text-sm text-gray-400">{s.emptyText}</p>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {hasProducts && (
          <>
            {!atEnd && (
              <button
                onClick={() => scroll("left")}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-sm transition-all duration-200 ${s.arrowBtn}`}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div
              ref={scrollRef}
              dir="rtl"
              className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {products!.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${encodeURIComponent(p.categoryFullSlug)}/${encodeURIComponent(p.slug)}`}
                  className="w-[160px] sm:w-[200px] md:w-[220px] h-[320px] sm:h-[360px] flex-shrink-0"
                >
                  <ProductCard
                    productData={p}
                    onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
                  />
                </Link>
              ))}
            </div>

            {!atStart && (
              <button
                onClick={() => scroll("right")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-sm transition-all duration-200 ${s.arrowBtn}`}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductsCarousel;