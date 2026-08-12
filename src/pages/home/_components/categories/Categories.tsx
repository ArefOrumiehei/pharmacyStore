import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductCatgsQueries } from "@/queries/useProductCatgsQueries";
import type { ProductCategory } from "@/store/useProductCategoriesStore";

// Components
import { CategoryItem } from "./_components/categoryItem/CategoryItem";
import { CategorySkeleton } from "./_components/categorySkeleton/CategorySkeleton";

const SKELETON_COUNT = 10;
const GRID_THRESHOLD = 6;

function Categories() {
  const { data: categories, isLoading } = useProductCatgsQueries();
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
    const slider = scrollRef.current;
    if (!slider) return;
    checkScrollPosition();
    slider.addEventListener("scroll", checkScrollPosition);
    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, [categories]);

  const scrollBy = (direction: "left" | "right") => {
    const slider = scrollRef.current;
    if (!slider) return;
    slider.scrollBy({ left: direction === "left" ? 160 : -160, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;
    dragState.current = { isDown: true, startX: e.pageX - slider.offsetLeft, scrollStart: slider.scrollLeft };
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

  const showSkeletons = isLoading || !categories || categories.length === 0;
  const useGrid = !showSkeletons && categories.length > GRID_THRESHOLD;

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 select-none w-full">
      <div className="flex items-center justify-between w-full px-1 sm:px-2">
        <h2 className="text-base sm:text-xl font-bold text-blue-800">خرید براساس دسته‌بندی</h2>
      </div>

      <div className="relative w-full">
        {!atStart && !showSkeletons && (
          <button
            onClick={() => scrollBy("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 shadow-sm rounded-full p-1.5 transition-all duration-200"
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
          className={`overflow-x-auto no-scrollbar scroll-smooth px-3 sm:px-6 py-2 ${
            useGrid
              ? "grid grid-flow-col grid-rows-2 auto-cols-max gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4"
              : "flex items-start gap-4 sm:gap-6"
          }`}
        >
          {showSkeletons
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((catg: ProductCategory) => (
                <CategoryItem key={catg.id} catg={catg} />
              ))}
        </div>

        {!atEnd && !showSkeletons && (
          <button
            onClick={() => scrollBy("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 shadow-sm rounded-full p-1.5 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Categories;