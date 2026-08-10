import { IconShoppingBag } from "@tabler/icons-react";

export default function OrdersEmptyState({ filterStatus }: { filterStatus: string }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center py-10 sm:py-16 gap-3 sm:gap-4 px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconShoppingBag size={22} className="text-blue-300 sm:w-7 sm:h-7" />
      </div>
      <div className="text-center">
        <p className="text-xs sm:text-sm font-medium text-gray-500">
          {filterStatus === "همه" ? "هنوز سفارشی ثبت نکرده‌اید" : `سفارشی با وضعیت «${filterStatus}» یافت نشد`}
        </p>
        {filterStatus === "همه" && (
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1">پس از ثبت سفارش، اینجا نمایش داده می‌شود</p>
        )}
      </div>
    </div>
  );
}