import { IconPackage } from "@tabler/icons-react";

export default function OrderNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl sm:rounded-2xl border border-blue-100 py-16 sm:py-24 gap-3 sm:gap-4 text-center px-4" dir="rtl">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconPackage size={24} className="text-blue-300 sm:w-7 sm:h-7" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-500">سفارش مورد نظر یافت نشد</p>
      <button
        onClick={onBack}
        className="text-xs sm:text-sm font-semibold text-blue-800 underline underline-offset-2"
      >
        بازگشت به سفارش‌ها
      </button>
    </div>
  );
}