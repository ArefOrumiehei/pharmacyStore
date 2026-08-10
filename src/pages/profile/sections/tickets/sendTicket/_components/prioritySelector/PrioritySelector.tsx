import { IconAlertCircle } from "@tabler/icons-react";
import type { UseFormSetValue } from "react-hook-form";
import { SectionHeader } from "../sectionHeader/SectionHeader";
import { PRIORITIES, type TicketFormValues, type TicketPriority } from "@/pages/profile/constants/Constants";

interface PrioritySelectorProps {
  selected: TicketPriority;
  setValue: UseFormSetValue<TicketFormValues>;
}

export function PrioritySelector({ selected, setValue }: PrioritySelectorProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <SectionHeader icon={IconAlertCircle} title="اولویت پیگیری" />

      <div className="grid grid-cols-3 max-[320px]:grid-cols-1 gap-1.5 sm:gap-2.5">
        {PRIORITIES.map(({ value, label, subLabel, activeClass }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setValue("priority", value)}
              className={`flex flex-col items-center gap-1 py-3 sm:py-3.5 px-1 sm:px-2 rounded-xl border-2 text-center transition-all duration-200 ${
                isActive ? activeClass : "border-blue-100 bg-white text-gray-400 hover:bg-blue-50/50 hover:border-blue-200"
              }`}
            >
              <span className={`text-xs sm:text-sm font-bold ${isActive ? "" : "text-gray-600"}`}>{label}</span>
              <span className={`text-[10px] sm:text-xs opacity-80 leading-tight ${isActive ? "" : "text-gray-400"}`}>
                {subLabel}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
        اولویت انتخابی صرفاً راهنمایی است و زمان پاسخ‌دهی توسط تیم پشتیبانی تعیین می‌شود.
      </p>
    </div>
  );
}