import { IconClock } from "@tabler/icons-react";

export function TicketPendingReply() {
  return (
    <div className="bg-white border border-amber-100 rounded-2xl px-4 sm:px-5 py-5 sm:py-6 flex items-center gap-3 sm:gap-4">
      <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
        <IconClock size={18} className="text-amber-500" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-amber-700">در انتظار پاسخ پشتیبانی</p>
        <p className="text-xs text-gray-400 mt-0.5">تیم پشتیبانی در اسرع وقت پاسخ خواهد داد</p>
      </div>
    </div>
  );
}