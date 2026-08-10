import { Link } from "react-router";
import { IconPackage } from "@tabler/icons-react";

export default function TicketsEmptyState() {
  return (
    <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-8 sm:p-12 flex flex-col items-center gap-2.5 sm:gap-3 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center">
        <IconPackage size={24} className="text-blue-300 sm:w-7 sm:h-7" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-500">تیکتی ثبت نشده است</p>
      <p className="text-[10px] sm:text-xs text-gray-400">برای ارتباط با پشتیبانی تیکت جدید ثبت کنید</p>
      <Link
        to="/profile/tickets/new"
        className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all"
      >
        ثبت اولین تیکت
      </Link>
    </div>
  );
}