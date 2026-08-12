import { useEffect, useState } from "react";
import { IconClock } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { CountdownTimerProps } from "../../interfaces/ProductsCarouselInterfaces";

function getRemaining(endTime: string | Date) {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

const pad = (n: number) => toPersianDigits(String(n).padStart(2, "0"));

export default function CountdownTimer({ endTime, onExpire, className }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => getRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getRemaining(endTime);
      setRemaining(next);
      if (!next) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!remaining) return null;

  const isUrgent = remaining.hours === 0 && remaining.minutes < 30;

  return (
    <div
      className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold tabular-nums px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg ${
        isUrgent ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-white/60 text-rose-600"
      } ${className ?? ""}`}
    >
      <IconClock size={13} className="sm:w-4 sm:h-4 flex-shrink-0" />
      <span>{pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}</span>
    </div>
  );
}