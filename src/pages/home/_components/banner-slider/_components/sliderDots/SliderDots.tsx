import type { SliderDotsProps } from "../../types/BannerSliderTypes";

export default function SliderDots({ count, current, onSelect }: SliderDotsProps) {
  return (
    <div className="absolute bottom-2.5 sm:bottom-4 w-full flex items-center justify-center gap-1.5 sm:gap-2 z-10">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`اسلاید ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-4 h-2 sm:w-6 sm:h-2.5 bg-white"
              : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/40 hover:bg-white/70"
          }`}
        />
      ))}
    </div>
  );
}