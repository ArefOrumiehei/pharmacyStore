import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SliderArrowsProps } from "../../types/BannerSliderTypes";

export default function SliderArrows({ onPrev, onNext }: SliderArrowsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="قبلی"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/50 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
      >
        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={onNext}
        aria-label="بعدی"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/50 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
      >
        <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
      </button>
    </>
  );
}