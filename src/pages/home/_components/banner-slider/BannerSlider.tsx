import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlideStore, type Slide } from "@/store/useSideStore";
import { IMAGE_BASE } from "@/apis/apiInstance";
import { Link } from "react-router";

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

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (loading || !slides) {
    return (
      <div className="relative w-full mt-4">
        <Skeleton className="w-full h-52 md:h-[420px] rounded-2xl" />
        <div className="absolute bottom-4 w-full flex items-center justify-center gap-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="w-3 h-3 rounded-full" />)}
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden mt-4 rounded-2xl select-none" dir="rtl">

      {/* ── Slides track ── */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides.map((slide: Slide, i: number) => (
          <SlideItem key={i} slide={slide} />
        ))}
      </div>

      {/* ── Prev / Next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="قبلی"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/50 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={goNext}
            aria-label="بعدی"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/50 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
          >
            <ChevronLeft size={20} />
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 w-full flex items-center justify-center gap-2 z-10">
          {slides.map((_: Slide, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`اسلاید ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Single slide ─────────────────────────────────────────────────────────────

function SlideItem({ slide }: { slide: Slide }) {
  const hasContent = slide.heading || slide.title || slide.text || slide.btnText;

  return (
    <div className="relative w-full h-52 md:h-[420px] flex-shrink-0">

      {/* Image */}
      <img
        src={`${IMAGE_BASE}/${slide.picture}`}
        alt={slide.pictureAlt}
        title={slide.pictureTitle}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      {hasContent && (
        <div className="absolute inset-0 flex items-end md:items-center p-6 md:pr-14">
          <div className="flex flex-col gap-2 md:gap-3 max-w-sm md:max-w-md text-right">

            {/* Heading — small label above title */}
            {slide.heading && (
              <span className="inline-flex self-start items-center text-xs md:text-sm font-semibold text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
                {slide.heading}
              </span>
            )}

            {/* Title */}
            {slide.title && (
              <h2 className="text-xl md:text-4xl font-black text-white leading-snug drop-shadow-md">
                {slide.title}
              </h2>
            )}

            {/* Body text */}
            {slide.text && (
              <p className="text-sm md:text-base text-white/80 leading-relaxed line-clamp-2 drop-shadow">
                {slide.text}
              </p>
            )}

            {/* CTA button */}
            {slide.btnText && slide.link && (
              <Link
                to={slide.link}
                className="self-start mt-1 inline-flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-50 active:scale-95 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md"
              >
                {slide.btnText}
                <ChevronLeft size={15} />
              </Link>
            )}

            {/* Link without button text — subtle arrow link */}
            {!slide.btnText && slide.link && (
              <Link
                to={slide.link}
                className="self-start text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors duration-150"
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