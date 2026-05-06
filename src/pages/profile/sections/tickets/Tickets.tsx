import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  IconHeadset,
  IconPlus,
  IconCircleDot,
  IconCircleCheck,
  IconX,
  IconUser,
  IconRobot,
  IconLoader2,
  IconHash,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import type { ITicket } from "@/services/accountServices/accountServices";

// ─── Status derived from isAnswered ──────────────────────────────────────────

const getStatus = (ticket: ITicket) =>
  ticket.isAnswered
    ? { label: "پاسخ داده شده", className: "text-green-700 bg-green-50 border-green-200", Icon: IconCircleCheck }
    : { label: "در انتظار پاسخ", className: "text-blue-700 bg-blue-50 border-blue-200",   Icon: IconCircleDot   };

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TicketSkeleton() {
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
          <div className="h-3 w-full bg-blue-50 animate-pulse rounded border-t border-blue-50 pt-3" />
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function TicketModal({ ticket, onClose }: { ticket: ITicket; onClose: () => void }) {
  const status = getStatus(ticket);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-blue-50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <IconHash size={12} className="text-gray-400" />
              <span className="text-xs font-mono text-gray-400">{ticket.trackingCode}</span>
            </div>
            <h2 className="text-base font-bold text-blue-800">{ticket.subject}</h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${status.className}`}>
              <status.Icon size={12} />
              {status.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-150"
            >
              <IconX size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

          {/* User message */}
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0">
              <IconUser size={15} className="text-white" />
            </div>
            <div className="flex flex-col gap-1 max-w-[75%] items-end">
              <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-blue-800 text-white">
                {ticket.message}
              </div>
              <span className="text-xs text-gray-400 px-1">{ticket.creationDate}</span>
            </div>
          </div>

          {/* Admin reply — only if answered */}
          {ticket.isAnswered && ticket.adminReply ? (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <IconRobot size={15} className="text-gray-500" />
              </div>
              <div className="flex flex-col gap-1 max-w-[75%] items-start">
                <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-blue-50 text-gray-700 border border-blue-100">
                  {ticket.adminReply}
                </div>
                <span className="text-xs text-gray-400 px-1">{ticket.adminReplyDate}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
              <IconLoader2 size={15} className="animate-spin" />
              <span className="text-xs">در انتظار پاسخ پشتیبانی...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-50 bg-blue-50/40 text-xs text-gray-400">
          <span>ثبت: {ticket.creationDate}</span>
          {ticket.adminReplyDate && <span>پاسخ: {ticket.adminReplyDate}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Ticket card ──────────────────────────────────────────────────────────────

function TicketCard({ ticket, onClick }: { ticket: ITicket; onClick: () => void }) {
  const status = getStatus(ticket);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-right bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
    >
      {/* Top row */}
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
        {ticket.isAnswered && ticket.adminReply
          ? `پاسخ: ${ticket.adminReply}`
          : ticket.message}
      </p>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>ثبت: {ticket.creationDate}</span>
        {ticket.adminReplyDate && <span>پاسخ: {ticket.adminReplyDate}</span>}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Tickets() {
  const { userTickets, fetchUserTickets, loading } = useUserStore();
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

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
              {tickets.length} تیکت
            </span>
          )}
        </div>
        <Link
          to="/profile/tickets/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-150 active:scale-95"
        >
          <IconPlus size={15} />
          تیکت جدید
        </Link>
      </div>

      {/* Content */}
      {loading.tickets ? (
        <TicketSkeleton />
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <IconHeadset size={28} className="text-blue-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">تیکتی ثبت نشده است</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.trackingCode}
              ticket={ticket}
              onClick={() => setSelectedTicket(ticket)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}