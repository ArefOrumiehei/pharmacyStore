import { IconPackage, IconTruck } from "@tabler/icons-react";

export default function ShippingPerks() {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500 w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2">
        <IconTruck size={12} className="text-blue-400 flex-shrink-0 sm:w-[13px] sm:h-[13px]" />
        <span className="leading-snug">ارسال رایگان برای سفارش های بالای ۵۰۰ هزار تومان</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 border border-gray-100 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2">
        <IconPackage size={12} className="text-blue-400 flex-shrink-0 sm:w-[13px] sm:h-[13px]" />
        <span className="leading-snug">ضمانت اصالت کالا</span>
      </div>
    </div>
  );
}