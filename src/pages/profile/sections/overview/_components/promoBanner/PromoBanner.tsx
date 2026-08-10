import { Link } from "react-router";
import { IconSparkles } from "@tabler/icons-react";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";

export default function PromoBanner() {
  return (
    <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
      <SectionTitle>پیشنهاد ویژه برای شما</SectionTitle>
      <div className="mt-3 sm:mt-4 bg-gradient-to-l from-blue-800 to-blue-600 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <IconSparkles size={14} className="text-amber-300 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-medium text-blue-200">پیشنهاد محدود</span>
          </div>
          <h3 className="font-bold text-white text-sm sm:text-base mb-1">
            تخفیف ویژه محصولات سلامت
          </h3>
          <p className="text-blue-200 text-xs sm:text-sm">
            تا ۳۰٪ تخفیف روی محصولات منتخب بهداشت و سلامت
          </p>
        </div>
        <Link
          to="/plp"
          className="flex-shrink-0 w-full sm:w-auto self-end text-center bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap"
        >
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}