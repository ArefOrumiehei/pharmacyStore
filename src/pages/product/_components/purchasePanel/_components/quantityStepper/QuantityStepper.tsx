import type { QuantityStepperProps } from "@/pages/product/types/productPageTypes";
import { IconLoader2, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

export default function QuantityStepper({ qty, max, loading, onIncrement, onDecrement }: QuantityStepperProps) {
  const isLast = qty === 1;
  const atMax  = qty >= max;

  return (
    <div className="flex items-stretch w-full h-11 sm:h-12 rounded-lg sm:rounded-xl border border-blue-200 bg-white overflow-hidden">
      <button
        onClick={onDecrement}
        disabled={loading}
        className={`flex-1 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          isLast ? "hover:bg-rose-50" : "hover:bg-blue-50"
        }`}
      >
        {isLast ? (
          <IconTrash size={15} className="text-rose-500 sm:w-[17px] sm:h-[17px]" />
        ) : (
          <IconMinus size={15} className="text-blue-800 sm:w-[17px] sm:h-[17px]" />
        )}
      </button>

      <div className="w-px bg-blue-100" />

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
        {loading ? (
          <IconLoader2 size={16} className="text-blue-400 animate-spin sm:w-[18px] sm:h-[18px]" />
        ) : (
          <>
            <span className="text-xs sm:text-sm font-bold text-blue-800 tabular-nums leading-none">
              {toPersianDigits(qty)}
            </span>
            {atMax && (
              <span className="text-[9px] sm:text-[10px] text-amber-600 leading-none">حداکثر</span>
            )}
          </>
        )}
      </div>

      <div className="w-px bg-blue-100" />

      <button
        onClick={onIncrement}
        disabled={loading || atMax}
        className="flex-1 flex items-center justify-center hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <IconPlus size={15} className="text-blue-800 sm:w-[17px] sm:h-[17px]" />
      </button>
    </div>
  );
}