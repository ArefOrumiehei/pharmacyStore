/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlideStore, type Slide } from "@/store/useSideStore";
import { IMAGE_BASE } from "@/apis/apiInstance";

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const { fetchSlides, slides, loading } = useSlideStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delay = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, delay);
    return () => resetTimeout();
  }, [current, slides]);

  const goTo = (index: number) => setCurrent(index);
  const goPrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  // Skeleton
  if (loading || !slides) {
    return (
      <div className="relative w-full mt-4">
        <Skeleton className="w-full h-48 md:h-86 rounded-2xl" />
        <div className="absolute bottom-3 w-full flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden mt-4 rounded-2xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides.map((slide: Slide, index: number) => (
          <div
            key={index}
            className="w-full h-48 md:h-86 relative flex-shrink-0"
          >
            <img
              src={`${IMAGE_BASE}/pictures/${slide.picture}`}
              alt={slide.pictureAlt}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Text */}
            {(slide.title || slide.text) && (
              <div className="absolute bottom-10 right-6 text-white text-right">
                {slide.title && (
                  <h2 className="text-xl md:text-3xl font-bold drop-shadow">
                    {slide.title}
                  </h2>
                )}
                {slide.text && (
                  <p className="text-sm md:text-lg mt-1 text-white/80 drop-shadow">
                    {slide.text}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrow buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
            aria-label="قبلی"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={goNext}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
            aria-label="بعدی"
          >
            <ChevronLeft size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 w-full flex items-center justify-center gap-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? "w-5 h-3 bg-white"
                  : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}