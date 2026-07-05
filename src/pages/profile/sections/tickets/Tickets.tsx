import { useEffect } from "react";
import { Link } from "react-router";
import {
  IconHeadset,
  IconPlus,
  IconCircleDot,
  IconCircleCheck,
  IconHash,
  IconCalendar,
  IconPackage,
  IconClock,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import type { ITicket } from "@/services/accountServices/accountServices";
import { toPersianDigits } from "smart-persian-tools";

/* ─────── HELPERS ──────────────────────────── */
const getStatus = (ticket: ITicket) =>
  ticket.isAnswered
    ? { label: "پاسخ داده شده", className: "text-green-700 bg-green-50 border-green-200", Icon: IconCircleCheck }
    : { label: "در انتظار پاسخ", className: "text-blue-700 bg-blue-50 border-blue-200",   Icon: IconCircleDot   };

/* ────────────── SKELETON ────────────────────── */
function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-3 w-24 bg-blue-50 animate-pulse rounded" />
              <div className="h-4 w-40 bg-blue-50 animate-pulse rounded" />
            </div>
            <div className="h-6 w-28 bg-blue-50 animate-pulse rounded-lg" />
          </div>
          <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: ITicket }) {
  const status = getStatus(ticket);

  return (
    <Link
      to={`/profile/tickets/${ticket.id}`}
      className="group w-full text-right bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <IconHash size={11} className="text-gray-300" />
            <span className="text-xs font-mono text-gray-400">{ticket.trackingCode}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 truncate">{ticket.subject}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${status.className}`}>
          <status.Icon size={12} />
          {status.label}
        </span>
      </div>

      {/* Message preview */}
      <p className="text-xs text-gray-400 line-clamp-1 border-t border-blue-50 pt-3 text-right">
        {ticket.message}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <IconCalendar size={11} />
          ثبت: <span dir="ltr">{toPersianDigits(ticket.creationDate)}</span>
        </span>
        {ticket.adminReplyDate && (
          <span className="flex items-center gap-1">
            <IconClock size={11} />
            پاسخ: <span dir="ltr">{toPersianDigits(ticket.adminReplyDate)}</span>
          </span>
        )}
      </div>
    </Link>
  );
}

/* ──────────────────── MAIN PAGE ───────────────────────── */
export default function Tickets() {
  const { userTickets, loading, fetchUserTickets } = useUserStore();

  useEffect(() => {
    fetchUserTickets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tickets: ITicket[] = userTickets ?? [];

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconHeadset size={20} className="text-blue-800" />
          <h1 className="text-lg font-bold text-blue-800">تیکت‌های پشتیبانی</h1>
          {!loading.tickets && tickets.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
              {toPersianDigits(tickets.length)} تیکت
            </span>
          )}
        </div>
        <Link
          to="/profile/tickets/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold transition-all active:scale-95"
        >
          <IconPlus size={15} />
          تیکت جدید
        </Link>
      </div>

      {/* Content */}
      {loading.tickets ? (
        <ListSkeleton />
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <IconPackage size={28} className="text-blue-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">تیکتی ثبت نشده است</p>
          <p className="text-xs text-gray-400">برای ارتباط با پشتیبانی تیکت جدید ثبت کنید</p>
          <Link
            to="/profile/tickets/new"
            className="mt-1 text-sm font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all"
          >
            ثبت اولین تیکت
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}