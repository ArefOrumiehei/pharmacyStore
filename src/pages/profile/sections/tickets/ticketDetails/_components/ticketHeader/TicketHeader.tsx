import type { ITicket } from "@/types/account/account";
import { IconArrowRight, IconHash } from "@tabler/icons-react";
import type { ComponentType } from "react";

interface TicketStatus {
    label: string;
    className: string;
    Icon: ComponentType<{ size?: number }>;
}

interface TicketHeaderProps {
    ticket: ITicket;
    status: TicketStatus;
    onBack: () => void;
}

export function TicketHeader({ ticket, status, onBack }: TicketHeaderProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                onClick={onBack}
                className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0"
            >
                <IconArrowRight size={17} className="text-blue-800" />
            </button>

            <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-bold text-blue-800 truncate">
                    {ticket.subject}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                    <IconHash
                        size={12}
                        className="text-gray-400 flex-shrink-0"
                    />
                    <span className="text-xs font-mono text-gray-400 truncate">
                        {ticket.trackingCode}
                    </span>
                </div>
            </div>

            <span
                className={`order-3 sm:order-none basis-full sm:basis-auto justify-center sm:justify-start flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 sm:mr-auto ${status.className}`}
            >
                <status.Icon size={12} />
                {status.label}
            </span>
        </div>
    );
}
