import { useState } from "react";
import { Link } from "react-router";
import {
  IconHeadset,
  IconPlus,
  IconCircleDot,
  IconCircleCheck,
  IconClock,
  IconChevronLeft,
  IconX,
  IconUser,
  IconRobot,
} from "@tabler/icons-react";

type TicketStatus = "open" | "answered" | "closed" | "pending";

interface TicketMessage {
  id: string;
  sender: "user" | "support";
  body: string;
  sentAt: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  subjectLabel: string;
  priority: "low" | "medium" | "high";
  status: TicketStatus;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    ticketNumber: "TK-482910",
    subject: "order",
    subjectLabel: "سفارش و پیگیری",
    priority: "high",
    status: "answered",
    lastMessage: "سفارش شما ارسال شده و تا ۲ روز آینده تحویل داده می‌شود.",
    createdAt: "۱۴۰۳/۰۴/۱۰",
    updatedAt: "۱۴۰۳/۰۴/۱۱",
    messages: [
      { id: "m1", sender: "user",    body: "سلام، سفارشم کجاست؟ چند روزه خبری نیست.",               sentAt: "۱۴۰۳/۰۴/۱۰ — ۱۰:۲۳" },
      { id: "m2", sender: "support", body: "سلام، سفارش شما ارسال شده و تا ۲ روز آینده تحویل داده می‌شود.", sentAt: "۱۴۰۳/۰۴/۱۱ — ۰۹:۰۵" },
    ],
  },
  {
    id: "2",
    ticketNumber: "TK-391045",
    subject: "prescription",
    subjectLabel: "نسخه و داروها",
    priority: "medium",
    status: "open",
    lastMessage: "آیا این دارو نیاز به نسخه دارد؟",
    createdAt: "۱۴۰۳/۰۴/۰۸",
    updatedAt: "۱۴۰۳/۰۴/۰۸",
    messages: [
      { id: "m1", sender: "user", body: "آیا این دارو نیاز به نسخه دارد؟", sentAt: "۱۴۰۳/۰۴/۰۸ — ۱۴:۱۱" },
    ],
  },
  {
    id: "3",
    ticketNumber: "TK-210388",
    subject: "delivery",
    subjectLabel: "ارسال و تحویل",
    priority: "low",
    status: "closed",
    lastMessage: "مشکل حل شد. ممنون از پشتیبانی شما.",
    createdAt: "۱۴۰۳/۰۳/۲۵",
    updatedAt: "۱۴۰۳/۰۳/۲۷",
    messages: [
      { id: "m1", sender: "user",    body: "بسته‌ام آسیب دیده رسید.",                         sentAt: "۱۴۰۳/۰۳/۲۵ — ۱۶:۴۰" },
      { id: "m2", sender: "support", body: "با عرض پوزش، مرسوله جدید ارسال می‌شود.",          sentAt: "۱۴۰۳/۰۳/۲۶ — ۱۱:۰۰" },
      { id: "m3", sender: "user",    body: "مشکل حل شد. ممنون از پشتیبانی شما.",              sentAt: "۱۴۰۳/۰۳/۲۷ — ۰۸:۳۰" },
    ],
  },
];

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; className: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  open:     { label: "باز",             className: "text-blue-700 bg-blue-50 border-blue-200",     icon: IconCircleDot   },
  answered: { label: "پاسخ داده شده",   className: "text-green-700 bg-green-50 border-green-200",  icon: IconCircleCheck },
  pending:  { label: "در انتظار",       className: "text-amber-600 bg-amber-50 border-amber-200",  icon: IconClock       },
  closed:   { label: "بسته شده",        className: "text-gray-500 bg-gray-50 border-gray-200",     icon: IconCircleCheck },
};

const PRIORITY_CONFIG = {
  low:    { label: "عادی",  className: "text-gray-500"  },
  medium: { label: "متوسط", className: "text-amber-600" },
  high:   { label: "فوری",  className: "text-rose-600"  },
};

// ── Modal ────────────────────────────────────────────────────────────────────

function TicketModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const status   = STATUS_CONFIG[ticket.status];
  const priority = PRIORITY_CONFIG[ticket.priority];
  const StatusIcon = status.icon;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel — stop propagation so clicks inside don't close */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-blue-50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-gray-400">{ticket.ticketNumber}</span>
              <span className={`text-xs font-semibold ${priority.className}`}>
                • {priority.label}
              </span>
            </div>
            <h2 className="text-base font-bold text-blue-800">{ticket.subjectLabel}</h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${status.className}`}>
              <StatusIcon size={12} />
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
          {(ticket.messages ?? []).map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUser ? "bg-blue-800" : "bg-gray-100"
                }`}>
                  {isUser
                    ? <IconUser size={15} className="text-white" />
                    : <IconRobot size={15} className="text-gray-500" />
                  }
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-800 text-white rounded-tr-sm"
                      : "bg-blue-50 text-gray-700 border border-blue-100 rounded-tl-sm"
                  }`}>
                    {msg.body}
                  </div>
                  <span className="text-xs text-gray-400 px-1">{msg.sentAt}</span>
                </div>
              </div>
            );
          })}

          {/* Empty thread */}
          {!ticket.messages?.length && (
            <p className="text-center text-sm text-gray-400 py-8">پیامی موجود نیست</p>
          )}
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-50 bg-blue-50/40 text-xs text-gray-400">
          <span>ثبت: {ticket.createdAt}</span>
          <span>آخرین بروزرسانی: {ticket.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Tickets() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconHeadset size={20} className="text-blue-800" />
          <h1 className="text-lg font-bold text-blue-800">تیکت‌های پشتیبانی</h1>
        </div>
        <Link
          to="/profile/tickets/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-150 active:scale-95"
        >
          <IconPlus size={15} />
          تیکت جدید
        </Link>
      </div>

      {/* Empty state */}
      {tickets.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <IconHeadset size={28} className="text-blue-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">تیکتی ثبت نشده است</p>
          <Link to="/tickets/new" className="text-sm text-blue-800 font-semibold underline underline-offset-2">
            اولین تیکت خود را ارسال کنید
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => {
            const status   = STATUS_CONFIG[ticket.status];
            const priority = PRIORITY_CONFIG[ticket.priority];
            const StatusIcon = status.icon;

            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicket(ticket)}
                className="group w-full text-right bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">{ticket.ticketNumber}</span>
                      <span className={`text-xs font-semibold ${priority.className}`}>
                        • {priority.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{ticket.subjectLabel}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${status.className}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                    <IconChevronLeft size={16} className="text-gray-300 group-hover:text-blue-800 transition-colors" />
                  </div>
                </div>

                {/* Last message preview */}
                <p className="text-xs text-gray-400 line-clamp-1 border-t border-blue-50 pt-3">
                  {ticket.lastMessage}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>ثبت: {ticket.createdAt}</span>
                  <span>آخرین بروزرسانی: {ticket.updatedAt}</span>
                </div>
              </button>
            );
          })}
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