import { IconCalendar } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { ComponentType } from "react";

type MessageVariant = "user" | "admin";

interface TicketMessageCardProps {
  variant: MessageVariant;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  date: string;
  message: string;
}

const VARIANT_STYLES: Record<MessageVariant, { border: string; headerBg: string; headerBorder: string; iconBg: string; labelColor: string }> = {
  user: {
    border: "border-blue-100",
    headerBg: "bg-blue-50/40",
    headerBorder: "border-blue-50",
    iconBg: "bg-blue-800",
    labelColor: "text-blue-800",
  },
  admin: {
    border: "border-emerald-100",
    headerBg: "bg-emerald-50/40",
    headerBorder: "border-emerald-50",
    iconBg: "bg-emerald-600",
    labelColor: "text-emerald-700",
  },
};

export function TicketMessageCard({ variant, icon: Icon, label, date, message }: TicketMessageCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={`bg-white border ${styles.border} rounded-2xl overflow-hidden`}>
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-3.5 border-b ${styles.headerBorder} ${styles.headerBg}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={14} className="text-white" />
          </div>
          <span className={`text-sm font-semibold ${styles.labelColor}`}>{label}</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <IconCalendar size={12} />
          <span dir="ltr">{toPersianDigits(date)}</span>
        </span>
      </div>

      <div className="px-4 sm:px-5 py-4 sm:py-5">
        <p className="text-sm text-gray-700 leading-7 sm:leading-8 whitespace-pre-wrap break-words">{message}</p>
      </div>
    </div>
  );
}