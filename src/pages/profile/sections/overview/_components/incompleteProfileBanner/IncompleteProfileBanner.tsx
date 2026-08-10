import { Link } from "react-router";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";

export default function IncompleteProfileBanner() {
  return (
    <Link
      to="/profile/account"
      className="group flex items-center gap-2.5 sm:gap-4 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-3 sm:py-4 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
        <IconAlertCircle size={16} className="text-amber-600 sm:w-5 sm:h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-amber-800">پروفایل شما ناقص است</p>
        <p className="hidden min-[280px]:block text-[10px] sm:text-xs text-amber-600 mt-0.5 leading-relaxed">
          برای استفاده کامل از امکانات، نام، نام کاربری و رمز عبور خود را تکمیل کنید.
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-amber-700 bg-amber-200 group-hover:bg-amber-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex-shrink-0 transition-colors whitespace-nowrap">
        <span className="hidden sm:inline">تکمیل پروفایل</span>
        <span className="sm:hidden">تکمیل</span>
        <IconArrowLeft size={12} className="sm:w-[13px] sm:h-[13px]" />
      </div>
    </Link>
  );
}