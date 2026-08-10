import type { StepConfig } from "@/pages/checkout/constants/Steps";
import { IconCheck } from "@tabler/icons-react";

interface StepIndicatorItemProps {
  step: StepConfig;
  done: boolean;
  active: boolean;
}

export function StepIndicatorItem({ step, done, active }: StepIndicatorItemProps) {
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 flex-shrink-0">
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
          done
            ? "bg-blue-800 border-blue-800 shadow-md shadow-blue-200"
            : active
            ? "bg-white border-blue-800 shadow-md shadow-blue-100"
            : "bg-white border-blue-100"
        }`}
      >
        {done ? (
          <IconCheck size={15} className="text-white sm:w-4 sm:h-4" strokeWidth={2.5} />
        ) : (
          <Icon size={15} className={`sm:w-4 sm:h-4 ${active ? "text-blue-800" : "text-gray-300"}`} />
        )}
      </div>
      <span
        className={`text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
          active ? "text-blue-800" : done ? "text-blue-400" : "text-gray-300"
        }`}
      >
        {step.label}
      </span>
    </div>
  );
}