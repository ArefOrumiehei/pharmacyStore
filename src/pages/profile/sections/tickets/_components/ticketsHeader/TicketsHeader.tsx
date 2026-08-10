import { Link } from "react-router";
import { IconHeadset, IconPlus } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

interface TicketsHeaderProps {
  count: number;
  showCount: boolean;
}

export default function TicketsHeader({ count, showCount }: TicketsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-start sm:items-start flex-col sm:flex-row gap-1.5 sm:gap-2 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <IconHeadset size={17} className="text-blue-800 flex-shrink-0 sm:w-5 sm:h-5" />
          <h1 className="text-sm sm:text-lg font-bold text-blue-800">تیکت‌های پشتیبانی</h1>
        </div>
        {showCount && (
          <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-50 border border-gray-100 px-1.5 sm:px-2 py-0.5 rounded-lg flex-shrink-0 whitespace-nowrap">
            {toPersianDigits(count)} تیکت
          </span>
        )}
      </div>
      {count > 0 && 
        <Link
          to="/profile/tickets/new"
          className="flex items-center gap-1 sm:gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 flex-shrink-0 whitespace-nowrap"
        >
          <IconPlus size={13} className="sm:w-[15px] sm:h-[15px]" />
          <span className="hidden sm:inline">تیکت جدید</span>
        </Link>
      }
    </div>
  );
}