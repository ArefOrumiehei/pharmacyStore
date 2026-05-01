/* eslint-disable react-hooks/exhaustive-deps */
import { useProductCategoriesStore, type ProductCategory } from "@/store/useProductCategoriesStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { IMAGE_BASE } from "@/apis/apiInstance";

const SKELETON_COUNT = 16;

function CategorySkeleton() {
  return (
    <div className="flex items-center justify-center flex-col gap-3 flex-shrink-0 w-28">
      <Skeleton className="w-20 h-20 rounded-2xl" />
      <Skeleton className="h-4 w-20 rounded-md" />
    </div>
  );
}

function Categories() {
  const { fetchAllProductCategories, categories, loading } = useProductCategoriesStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollStart: 0 });

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const { scrollLeft, scrollWidth, clientWidth } = slider;
    const maxScroll = scrollWidth - clientWidth;
    setAtStart(scrollLeft >= -2);
    setAtEnd(Math.abs(scrollLeft) >= maxScroll - 2);
  };

  useEffect(() => {
    fetchAllProductCategories();
  }, []);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    checkScrollPosition();
    slider.addEventListener("scroll", checkScrollPosition);
    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, [categories]);

  const scrollBy = (direction: "left" | "right") => {
    const slider = scrollRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction === "left" ? 160 : -160,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider || !dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    slider.scrollLeft = dragState.current.scrollStart - walk;
  };

  const showSkeletons = loading || !categories || categories.length === 0;

  return (
    <div className="flex flex-col items-center gap-6 select-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-2">
        <h2 className="text-xl font-bold text-blue-800">خرید براساس دسته‌بندی</h2>
        {!showSkeletons && (
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            مشاهده همه
            <ChevronLeft className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Carousel wrapper */}
      <div className="relative w-full">
        {/* Right arrow */}
        {!atStart && !showSkeletons && (
          <button
            onClick={() => scrollBy("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 shadow-sm rounded-full p-1.5 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          dir="rtl"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex items-start gap-6 overflow-x-auto no-scrollbar scroll-smooth px-6 py-2 cursor-grab active:cursor-grabbing"
        >
          {showSkeletons
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : categories.map((catg: ProductCategory) => (
                <Link
                  key={catg.id}
                  to={`/category/${catg.slug ?? catg.id}`}
                  className="flex flex-col items-center gap-3 flex-shrink-0 w-28 group"
                >
                  {/* Icon box */}
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:shadow-lg transition-all duration-300">
                    {catg.picture ? (
                      <img
                        src={`${IMAGE_BASE}/pictures/${catg.picture}`}
                        alt={catg.name}
                        className="w-12 h-12 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
                      />
                    ) : (
                      <span className="text-2xl">{catg.icon ?? "💊"}</span>
                    )}
                  </div>
                  {/* Name */}
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-800 text-center leading-5 transition-colors duration-200">
                    {catg.name}
                  </span>
                </Link>
              ))}
        </div>

        {/* Left arrow */}
        {!atEnd && !showSkeletons && (
          <button
            onClick={() => scrollBy("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 shadow-sm rounded-full p-1.5 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Categories;