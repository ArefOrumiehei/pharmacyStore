import { IconPackageOff } from "@tabler/icons-react";

export default function OutOfStockOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-2">
      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 border border-gray-200 rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 shadow-sm">
        <IconPackageOff size={11} className="text-gray-400 flex-shrink-0 sm:w-[13px] sm:h-[13px]" />
        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 whitespace-nowrap">ناموجود</span>
      </div>
    </div>
  );
}