import { IconHeadset, IconArrowRight, IconChevronLeft } from "@tabler/icons-react";

interface SendTicketHeaderProps {
  onBack: () => void;
}

export function SendTicketHeader({ onBack }: SendTicketHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6 sm:mb-8">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0"
      >
        <IconArrowRight size={17} className="text-blue-800" />
      </button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl md:rounded-2xl bg-blue-800 flex items-center justify-center flex-shrink-0">
          <IconHeadset size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-blue-800">ارسال تیکت پشتیبانی</h1>
          <p className="text-xs text-gray-400 mt-0.5 ">مشکل یا سوال خود را با ما در میان بگذارید</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
        <span className="hover:text-blue-800 cursor-pointer transition-colors" onClick={onBack}>
          تیکت‌ها
        </span>
        <IconChevronLeft size={12} />
        <span className="text-blue-800 font-medium">تیکت جدید</span>
      </div>
    </div>
  );
}