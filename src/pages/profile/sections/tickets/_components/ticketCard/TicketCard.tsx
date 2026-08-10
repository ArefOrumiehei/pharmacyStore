import { Link } from "react-router";
import { IconHash, IconCalendar, IconClock } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { ITicket } from "@/services/accountServices/accountServices";
import { getTicketStatus } from "@/pages/profile/constants/Constants";

export default function TicketCard({ ticket }: { ticket: ITicket }) {
  const status = getTicketStatus(ticket);

  return (
    <Link
      to={`/profile/tickets/${ticket.id}`}
      className="group w-full max-w-full text-right bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-start justify-between flex-col min-[260px]:flex-row gap-2 sm:gap-3">
        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <IconHash size={11} className="text-gray-300 flex-shrink-0 sm:w-3 sm:h-3" />
            <span className="text-[10px] sm:text-xs font-mono text-gray-400 truncate">{ticket.trackingCode}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{ticket.subject}</p>
        </div>
        <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border flex-shrink-0 whitespace-nowrap ${status.className}`}>
          <status.Icon size={11} className="sm:w-3 sm:h-3" />
          <span className="max-[360px]:hidden">{status.label}</span>
        </span>
      </div>

      {/* Message preview */}
      <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1 border-t border-blue-50 pt-2.5 sm:pt-3 text-right">
        {ticket.message}
      </p>

      <div className="flex items-center justify-between max-[360px]:flex-col max-[360px]:items-start gap-2 text-[10px] sm:text-xs text-gray-400">
        <span className="flex items-center gap-1 min-w-0 truncate">
          <IconCalendar size={11} className="flex-shrink-0 sm:w-3 sm:h-3" />
          ثبت: <span dir="ltr" className="truncate">{toPersianDigits(ticket.creationDate)}</span>
        </span>
        {ticket.adminReplyDate && (
          <span className="flex items-center gap-1 min-w-0 truncate flex-shrink-0">
            <IconClock size={11} className="flex-shrink-0 sm:w-3 sm:h-3" />
            پاسخ: <span dir="ltr" className="truncate">{toPersianDigits(ticket.adminReplyDate)}</span>
          </span>
        )}
      </div>
    </Link>
  );
}