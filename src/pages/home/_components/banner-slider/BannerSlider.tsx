/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";

import { useSlideStore, type Slide } from "@/store/useSideStore";

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const {fetchSlides, slides} = useSlideStore()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delay = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!slides || slides.length === 1) return;
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === slides?.length - 1 ? 0 : prev + 1));
    }, delay);

    return () => resetTimeout();
  }, [current]);

  useEffect(() => {
    fetchSlides();
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden mt-4">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides?.map((slide: Slide, index: number) => (
          <div
            key={index}
            className="w-full h-48 md:h-86 relative flex-shrink-0 rounded-2xl overflow-hidden"
          >
            <img
              src={`https://kj686klc-5000.euw.devtunnels.ms/pictures/${slide.picture}`}
              alt={slide.pictureAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-5 text-white">
              {slide.title && (
                <h2 className="text-xl md:text-3xl font-bold">{slide.title}</h2>
              )}
              {slide.text && (
                <p className="text-sm md:text-lg">{slide.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {!(!slides || slides.length === 1)&& 
        <div className="absolute bottom-3 w-full flex items-center justify-center gap-2 transition-all duration-300">
          {slides?.map((_: any, index: number) => (
            <button
              key={index}
              className={`${index === current ? "w-5 h-3" : "w-3 h-3"} rounded-full transition-colors duration-300 ${
                index === current ? "bg-primary" : "bg-neutral-500"
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      }

      {/* <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 p-2 rounded-full transition"
        onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
      >
        <ArrowLeft />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 p-2 rounded-full transition"
        onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
      >
        <ArrowRight />
      </button> */}
    </div>
  );
}
