import { useState, useEffect, useRef } from "react";
import { useSlideStore, type Slide } from "@/store/useSideStore";

// Components
import BannerSkeleton from "./_components/bannerSkeleton/BannerSkeleton";
import SlideItem from "./_components/slideItem/SlideItem";
import SliderArrows from "./_components/sliderArrows/SliderArrows";
import SliderDots from "./_components/sliderDots/SliderDots";

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const { fetchSlides, slides, loading } = useSlideStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DELAY = 5000;

  useEffect(() => {
    fetchSlides();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, DELAY);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [current, slides]);

  const goTo   = (i: number) => setCurrent(i);
  const goPrev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const goNext = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));

  if (loading || !slides) {
    return <BannerSkeleton />;
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden mt-3 sm:mt-4 rounded-xl sm:rounded-2xl select-none" dir="rtl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides.map((slide: Slide, i: number) => (
          <SlideItem key={i} slide={slide} />
        ))}
      </div>

      {slides.length > 1 && <SliderArrows onPrev={goPrev} onNext={goNext} />}
      {slides.length > 1 && <SliderDots count={slides.length} current={current} onSelect={goTo} />}
    </div>
  );
}