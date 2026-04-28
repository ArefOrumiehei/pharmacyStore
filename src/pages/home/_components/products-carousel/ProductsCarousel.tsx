/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../productCard/ProductCard";
import { Link } from "react-router";
import { IconArrowLeft, IconFlameFilled } from "@tabler/icons-react";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

interface ProductsCarouselProps {
  title: string;
  products: any[];
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

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const { scrollLeft, scrollWidth, clientWidth } = slider;
    setAtStart(scrollLeft >= -2);
    setAtEnd(scrollLeft <= -(scrollWidth - clientWidth) + 2);
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    checkScrollPosition();
    slider.addEventListener("scroll", checkScrollPosition);
    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? 350 : -350,
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
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    slider.scrollLeft = dragState.current.scrollStart - walk;
  };

  const wonderfulStyles = {
    wrapper: "bg-orange-50 border border-orange-200",
    header: "text-orange-600",
    headerBg: "bg-orange-50",
    divider: "border-orange-200",
    viewMore: "text-orange-600 hover:text-orange-700",
    arrowBtn: "bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200",
  };

  const regularStyles = {
    wrapper: "bg-white border border-blue-100",
    header: "text-blue-800",
    headerBg: "bg-white",
    divider: "border-blue-100",
    viewMore: "text-blue-800 hover:text-blue-600",
    arrowBtn: "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200",
  };

  const s = wonderful ? wonderfulStyles : regularStyles;

  // show skeletons while loading OR while products haven't arrived yet
  const showSkeletons = loading || !products || products.length === 0;

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${s.wrapper}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${s.divider} ${s.headerBg}`}>
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
            : products.map((p: any) => (
                <Link
                  key={p.id}
                  to={`/product/${encodeURIComponent(p.categoryFullSlug)}/${encodeURIComponent(p.slug)}`}
                  className="flex-shrink-0"
                >
                  <ProductCard
                    productData={p}
                    onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
                  />
                </Link>
              ))}
        </div>

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