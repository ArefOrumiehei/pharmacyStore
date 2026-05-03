/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../productCard/ProductCard";
import { Link } from "react-router";
import { IconArrowLeft, IconFlameFilled } from "@tabler/icons-react";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "قرص سیتالوپرام ۲۰mg فارما پلاس",
    picture: "",
    pictureAlt: "قرص سیتالوپرام",
    categoryName: "داروهای روان‌پزشکی",
    categoryFullSlug: "medications/psychiatric",
    slug: "citalopram-20mg",
    avgRate: 4.7,
    rateCount: 128,
    price: 185000,
    priceWithDiscount: 148000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: true,
    isGoodPrice: false,
  },
  {
    id: "2",
    name: "شربت بروفن کودک ۱۰۰ml",
    picture: "",
    pictureAlt: "شربت بروفن",
    categoryName: "مسکن‌ها",
    categoryFullSlug: "medications/painkillers",
    slug: "ibuprofen-syrup-100ml",
    avgRate: 4.3,
    rateCount: 84,
    price: 98000,
    priceWithDiscount: null,
    hasDiscount: false,
    discountRate: null,
    isBestSeller: false,
    isGoodPrice: true,
  },
  {
    id: "3",
    name: "ویتامین C 1000mg جوشان لیمویی",
    picture: "",
    pictureAlt: "ویتامین C",
    categoryName: "مکمل‌ها",
    categoryFullSlug: "supplements/vitamins",
    slug: "vitamin-c-1000mg-effervescent",
    avgRate: 4.9,
    rateCount: 312,
    price: 145000,
    priceWithDiscount: 116000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: true,
    isGoodPrice: false,
  },
  {
    id: "4",
    name: "کرم ضدآفتاب بی‌رنگ SPF50",
    picture: "",
    pictureAlt: "ضدآفتاب",
    categoryName: "مراقبت پوست",
    categoryFullSlug: "skincare/sunscreen",
    slug: "sunscreen-spf50-clear",
    avgRate: 4.5,
    rateCount: 196,
    price: 320000,
    priceWithDiscount: 256000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: false,
    isGoodPrice: false,
  },
  {
    id: "5",
    name: "امگا ۳ روغن ماهی ۱۰۰۰mg",
    picture: "",
    pictureAlt: "امگا ۳",
    categoryName: "مکمل‌ها",
    categoryFullSlug: "supplements/omega",
    slug: "omega3-fish-oil-1000mg",
    avgRate: 4.6,
    rateCount: 241,
    price: 275000,
    priceWithDiscount: null,
    hasDiscount: false,
    discountRate: null,
    isBestSeller: false,
    isGoodPrice: true,
    stockCount: 9,
  },
  {
    id: "6",
    name: "شامپو ضد ریزش بایوتین پرو",
    picture: "",
    pictureAlt: "شامپو بایوتین",
    categoryName: "مراقبت مو",
    categoryFullSlug: "haircare/shampoo",
    slug: "biotin-anti-hairloss-shampoo",
    avgRate: 4.1,
    rateCount: 67,
    price: 189000,
    priceWithDiscount: 151000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: false,
    isGoodPrice: false,
    stockCount: 2,
  },
  {
    id: "7",
    name: "فشارسنج بازویی دیجیتال امرون",
    picture: "",
    pictureAlt: "فشارسنج امرون",
    categoryName: "تجهیزات پزشکی",
    categoryFullSlug: "medical-equipment/blood-pressure",
    slug: "omron-blood-pressure-monitor",
    avgRate: 4.8,
    rateCount: 153,
    price: 1250000,
    priceWithDiscount: 1000000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: true,
    isGoodPrice: false,
    stockCount: 4,
  },
  {
    id: "8",
    name: "فشارسنج بازویی دیجیتال امرون",
    picture: "",
    pictureAlt: "فشارسنج امرون",
    categoryName: "تجهیزات پزشکی",
    categoryFullSlug: "medical-equipment/blood-pressure",
    slug: "omron-blood-pressure-monitor",
    avgRate: 4.8,
    rateCount: 153,
    price: 1250000,
    priceWithDiscount: 1000000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: true,
    isGoodPrice: false,
    isInStock: false,
  },
  {
    id: "9",
    name: "فشارسنج بازویی دیجیتال امرون",
    picture: "",
    pictureAlt: "فشارسنج امرون",
    categoryName: "تجهیزات پزشکی",
    categoryFullSlug: "medical-equipment/blood-pressure",
    slug: "omron-blood-pressure-monitor",
    avgRate: 4.8,
    rateCount: 153,
    price: 1250000,
    priceWithDiscount: 1000000,
    hasDiscount: true,
    discountRate: 20,
    isBestSeller: true,
    isGoodPrice: false,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface ProductsCarouselProps {
  title: string;
  products?: any[];
  loading?: boolean;
  viewMoreLink?: string;
  wonderful?: boolean;
}

const SKELETON_COUNT = 6;

function ProductsCarousel({
  title,
  products,
  loading = false,
  viewMoreLink,
  wonderful = false,
}: ProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const displayProducts = !loading && products && products.length > 0 ? products : MOCK_PRODUCTS;

  const showSkeletons = loading;

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const { scrollLeft, scrollWidth, clientWidth } = slider;
    // In RTL layouts, scrollLeft starts at 0 (right/start) and decreases (goes negative) as
    // the user scrolls toward the left. Chrome normalizes this; Firefox may use positive values.
    // We normalize to an absolute value to handle both browsers safely.
    const absScroll = Math.abs(scrollLeft);
    const maxScroll = scrollWidth - clientWidth;
    setAtStart(absScroll <= 2);              // at the rightmost edge (RTL start)
    setAtEnd(absScroll >= maxScroll - 2);   // at the leftmost edge (RTL end)
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    checkScrollPosition();
    slider.addEventListener("scroll", checkScrollPosition, { passive: true });
    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, [displayProducts]);

  // RTL scroll: positive left = scroll toward right (back), negative = toward left (forward)
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
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
  const handleMouseLeave = () => {
    dragState.current.isDown = false;
  };
  const handleMouseUp = () => {
    dragState.current.isDown = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider || !dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    slider.scrollLeft = dragState.current.scrollStart - walk;
  };

  const s = wonderful
    ? {
        wrapper: "bg-orange-50 border border-orange-200",
        header: "text-orange-600",
        headerBg: "bg-orange-50",
        divider: "border-orange-200",
        viewMore: "text-orange-600 hover:text-orange-700",
        arrowBtn:
          "bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200",
      }
    : {
        wrapper: "bg-white border border-blue-100",
        header: "text-blue-800",
        headerBg: "bg-white",
        divider: "border-blue-100",
        viewMore: "text-blue-800 hover:text-blue-600",
        arrowBtn:
          "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200",
      };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${s.wrapper}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-6 py-4 border-b ${s.divider} ${s.headerBg}`}
      >
        <div className="flex items-center gap-2">
          {wonderful && (
            <IconFlameFilled size={22} className="text-orange-500" />
          )}
          <h3 className={`text-lg font-bold ${s.header}`}>{title}</h3>
        </div>
        {viewMoreLink && !showSkeletons && (
          <Link
            to={viewMoreLink}
            className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${s.viewMore}`}
          >
            مشاهده همه
            <IconArrowLeft size={16} />
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative px-4 py-4">

        {/* Left arrow — visible when NOT at the left end (RTL end) */}
        {!atEnd && !showSkeletons && (
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
          {showSkeletons
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : displayProducts.map((p: any) => (
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

        {/* Right arrow — visible when NOT at the right start (RTL start) */}
        {!atStart && !showSkeletons && (
          <button
            onClick={() => scroll("right")}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-sm transition-all duration-200 ${s.arrowBtn}`}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductsCarousel;