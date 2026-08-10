import { IconCalendar, IconMessageCircle } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

interface TicketFooterProps {
  creationDate: string;
  adminReplyDate?: string | null;
}

export function TicketFooter({ creationDate, adminReplyDate }: TicketFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-400 gap-2">
      <span className="flex items-center gap-1.5">
        <IconCalendar size={12} className="flex-shrink-0" />
        تاریخ ثبت: <span dir="ltr">{toPersianDigits(creationDate)}</span>
      </span>
      {adminReplyDate && (
        <span className="flex items-center gap-1.5">
          <IconMessageCircle size={12} className="flex-shrink-0" />
          تاریخ پاسخ: <span dir="ltr">{toPersianDigits(adminReplyDate)}</span>
        </span>
      )}
    </div>
  );
}