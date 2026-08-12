import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselArrowBtnProps } from "../../interfaces/ProductsCarouselInterfaces";

export default function CarouselArrowBtn({ direction, onClick, className }: CarouselArrowBtnProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const positionClass = direction === "left" ? "left-1 sm:left-2" : "right-1 sm:right-2";

  return (
    <button
      onClick={onClick}
      className={`hidden sm:flex absolute ${positionClass} top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full shadow-sm transition-all duration-200 ${className}`}
    >
      <Icon size={18} className="sm:w-5 sm:h-5" />
    </button>
  );
}