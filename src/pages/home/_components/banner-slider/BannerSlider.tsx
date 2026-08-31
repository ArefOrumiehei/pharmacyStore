import { useState, useEffect, useRef } from "react";

// Types
import type { ISlide } from "@/services/slide_services/slideServices";

// Components
import BannerSkeleton from "./_components/bannerSkeleton/BannerSkeleton";
import SlideItem from "./_components/slideItem/SlideItem";
import SliderArrows from "./_components/sliderArrows/SliderArrows";
import SliderDots from "./_components/sliderDots/SliderDots";
import { useSlidesQuery } from "@/queries/useSlideQueries";

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const {data: slides, isLoading} = useSlidesQuery();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DELAY = 5000;

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, DELAY);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [current, slides]);

  if (isLoading || !slides) {
    return <BannerSkeleton />;
  }
  
  if (slides.length === 0) return null;

  const goTo   = (i: number) => setCurrent(i);
  const goPrev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const goNext = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  
  return (
    <div className="relative w-full overflow-hidden mt-3 sm:mt-4 rounded-xl sm:rounded-2xl select-none" dir="rtl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides.map((slide: ISlide, i: number) => (
          <SlideItem key={i} slide={slide} />
        ))}
      </div>

      {slides.length > 1 && <SliderArrows onPrev={goPrev} onNext={goNext} />}
      {slides.length > 1 && <SliderDots count={slides.length} current={current} onSelect={goTo} />}
    </div>
  );
}