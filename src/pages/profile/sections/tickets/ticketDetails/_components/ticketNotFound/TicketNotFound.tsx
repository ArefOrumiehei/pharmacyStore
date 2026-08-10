import { IconArrowRight } from "@tabler/icons-react";

interface TicketNotFoundProps {
  onBack: () => void;
}

export function TicketNotFound({ onBack }: TicketNotFoundProps) {
  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors"
      >
        <IconArrowRight size={17} className="text-blue-800" />
      </button>
      <div className="bg-white border border-blue-100 rounded-2xl p-8 sm:p-12 flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-gray-500">تیکت یافت نشد</p>
        <p className="text-xs text-gray-400">این تیکت ممکن است حذف شده یا کد آن نادرست باشد</p>
      </div>
    </div>
  );
}