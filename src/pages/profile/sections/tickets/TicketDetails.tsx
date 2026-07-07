import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  IconCircleDot,
  IconCircleCheck,
  IconHash,
  IconCalendar,
  IconArrowRight,
  IconUser,
  IconMessageCircle,
  IconMessageCheck,
  IconClock,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import type { ITicket } from "@/services/accountServices/accountServices";
import { toPersianDigits } from "smart-persian-tools";

/* ──────────────── HELPERS ───────────────────────────── */
const getStatus = (ticket: ITicket) =>
  ticket.isAnswered
    ? { label: "پاسخ داده شده", className: "text-green-700 bg-green-50 border-green-200", Icon: IconCircleCheck }
    : { label: "در انتظار پاسخ", className: "text-blue-700 bg-blue-50 border-blue-200",   Icon: IconCircleDot   };

/* ──────────────────────── SKELETON ─────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-5 w-48 bg-blue-50 animate-pulse rounded" />
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
        <div className="h-4 w-32 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-blue-50 animate-pulse rounded" />
      </div>
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
        <div className="h-4 w-32 bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-blue-50 animate-pulse rounded" />
      </div>
    </div>
  );
}

/* ──────────────────── NOT FOUND ──────────────── */
function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors"
      >
        <IconArrowRight size={17} className="text-blue-800" />
      </button>
      <div className="bg-white border border-blue-100 rounded-2xl p-12 flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-gray-500">تیکت یافت نشد</p>
        <p className="text-xs text-gray-400">این تیکت ممکن است حذف شده یا کد آن نادرست باشد</p>
      </div>
    </div>
  );
}

/* ─────────── MAIN PAGE ─────────────────────── */
export default function TicketDetails() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { selectedTicket, loading, fetchTicketDetails, clearSelectedTicket } = useUserStore();

  useEffect(() => {
    if (ticketId) fetchTicketDetails(ticketId);
    return () => clearSelectedTicket();
  }, [ticketId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onBack = () => navigate("/profile/tickets");

  if (loading.ticket) {
    return (
      <div className="flex flex-col gap-5" dir="rtl">
        <DetailSkeleton />
      </div>
    );
  }

  if (!selectedTicket) {
    return <NotFound onBack={onBack} />;
  }

  const ticket = selectedTicket;
  const status = getStatus(ticket);

  return (
    <div className="flex flex-col gap-4" dir="rtl">

      {/* Back button + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <IconArrowRight size={17} className="text-blue-800" />
        </button>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-blue-800 truncate">{ticket.subject}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <IconHash size={11} className="text-gray-300" />
            <span className="text-xs font-mono text-gray-400">{ticket.trackingCode}</span>
          </div>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 mr-auto ${status.className}`}>
          <status.Icon size={12} />
          {status.label}
        </span>
      </div>

      {/* User message block */}
      <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-blue-50 bg-blue-50/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0">
              <IconUser size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-800">پیام شما</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <IconCalendar size={11} />
            <span dir="ltr">{toPersianDigits(ticket.creationDate)}</span>
          </span>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm text-gray-700 leading-8 whitespace-pre-wrap">{ticket.message}</p>
        </div>
      </div>

      {/* Admin reply block */}
      {ticket.isAnswered && ticket.adminReply ? (
        <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-emerald-50 bg-emerald-50/40">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <IconMessageCheck size={13} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-700">پاسخ پشتیبانی</span>
            </div>
            {ticket.adminReplyDate && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <IconCalendar size={11} />
                <span dir="ltr">{toPersianDigits(ticket.adminReplyDate)}</span>
              </span>
            )}
          </div>

          <div className="px-5 py-5">
            <p className="text-sm text-gray-700 leading-8 whitespace-pre-wrap">{ticket.adminReply}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-amber-100 rounded-2xl px-5 py-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <IconClock size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700">در انتظار پاسخ پشتیبانی</p>
            <p className="text-xs text-gray-400 mt-0.5">تیم پشتیبانی در اسرع وقت پاسخ خواهد داد</p>
          </div>
        </div>
      )}

      {/* Meta footer */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-400 flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <IconCalendar size={12} />
          تاریخ ثبت: <span dir="ltr">{toPersianDigits(ticket.creationDate)}</span>
        </span>
        {ticket.adminReplyDate && (
          <span className="flex items-center gap-1.5">
            <IconMessageCircle size={12} />
            تاریخ پاسخ: <span dir="ltr">{toPersianDigits(ticket.adminReplyDate)}</span>
          </span>
        )}
      </div>
    </div>
  );
}