import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { Slide } from "@/store/useSideStore";

export default function SlideItem({ slide }: { slide: Slide }) {
  const hasContent = slide.heading || slide.title || slide.text || slide.btnText;

  return (
    <div className="relative w-full h-36 xs:h-44 sm:h-64 md:h-[420px] flex-shrink-0">
      <img
        src={`${IMAGE_BASE}/${slide.picture}`}
        alt={slide.pictureAlt}
        title={slide.pictureTitle}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />

      {hasContent && (
        <div className="absolute inset-0 flex items-end md:items-center p-3 sm:p-6 md:pr-14">
          <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 max-w-[85%] xs:max-w-xs sm:max-w-sm md:max-w-md text-right">

            {slide.heading && (
              <span className="inline-flex self-start items-center text-[10px] xs:text-xs sm:text-sm font-semibold text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {slide.heading}
              </span>
            )}

            {slide.title && (
              <h2 className="text-sm xs:text-base sm:text-2xl md:text-4xl font-black text-white leading-snug drop-shadow-md line-clamp-2">
                {slide.title}
              </h2>
            )}

            {slide.text && (
              <p className="hidden xs:block text-xs sm:text-sm md:text-base text-white/80 leading-relaxed line-clamp-2 drop-shadow">
                {slide.text}
              </p>
            )}

            {slide.btnText && slide.link && (
              <Link
                to={slide.link}
                className="self-start mt-0.5 sm:mt-1 inline-flex items-center gap-1.5 sm:gap-2 bg-white text-blue-800 hover:bg-blue-50 active:scale-95 font-bold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-150 shadow-md"
              >
                {slide.btnText}
                <ChevronLeft size={13} className="sm:w-[15px] sm:h-[15px]" />
              </Link>
            )}

            {!slide.btnText && slide.link && (
              <Link
                to={slide.link}
                className="self-start text-xs sm:text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors duration-150"
              >
                بیشتر بدانید
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}