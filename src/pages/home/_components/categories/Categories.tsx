/* eslint-disable react-hooks/exhaustive-deps */
import { useProductCategoriesStore, type ProductCategory } from "@/store/useProductCategoriesStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Categories() {
  const {fetchAllProductCategories, categories} = useProductCategoriesStore()
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;
    const { scrollLeft, scrollWidth, clientWidth } = slider;

    const maxScroll = scrollWidth - clientWidth;

    setAtStart(scrollLeft >= 0);
    setAtEnd(Math.abs(scrollLeft) >= maxScroll - 1); 
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition()

    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, []);

  useEffect(() => {
    fetchAllProductCategories()
  }, [])

  const scrollBy = (direction: "left" | "right") => {
    const slider = scrollRef.current;
    if (!slider) return;
    const itemWidth = 160;
    slider.scrollBy({
      left: direction === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;

    slider.dataset.isDown = "true";
    slider.dataset.startX = String(e.pageX - slider.offsetLeft);
    slider.dataset.scrollLeftStart = String(slider.scrollLeft);
  };

  const handleMouseLeave = () => {
    const slider = scrollRef.current;
    if (slider) slider.dataset.isDown = "false";
  };

  const handleMouseUp = () => {
    const slider = scrollRef.current;
    if (slider) slider.dataset.isDown = "false";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider || slider.dataset.isDown !== "true") return;

    e.preventDefault();
    const startX = Number(slider.dataset.startX || 0);
    const scrollLeftStart = Number(slider.dataset.scrollLeftStart || 0);
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeftStart - walk;
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex items-center justify-center flex-col gap-6 my-12 select-none relative">
      <h2 className="text-2xl font-iranYekanBold">خرید براساس دسته‌بندی</h2>

      {!atStart && categories?.length > 6 && <ChevronRight onClick={() => scrollBy("right")} className="absolute right-2 top-70 -translate-y-1/2 z-10 rounded-full border shadow bg-white text-neutral-400 cursor-pointer w-8 h-8" />}
      {!atEnd && categories?.length > 6 && <ChevronLeft onClick={() => scrollBy("left")} className="absolute left-2 top-70 -translate-y-1/2 z-10 rounded-full border shadow bg-white text-neutral-400 cursor-pointer w-8 h-8" />}

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center justify-center w-full gap-12 p-4`}
      >
        {categories?.map((catg: ProductCategory) => (
          <div key={catg.id} className="flex items-center justify-center flex-col gap-2 w-32 h-32 p-4 border rounded-3xl shadow-sm cursor-pointer transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center justify-center bg-gray-400 rounded-sm w-16 h-16 flex-shrink-0" />
            <h3>{catg.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
