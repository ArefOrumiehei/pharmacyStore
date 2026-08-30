import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { IconUser, IconMessageCheck } from "@tabler/icons-react";
import { useUserStore } from "@/store/account/useAccountStore";
import { getTicketStatus } from "@/pages/profile/constants/Constants";

// Components
import { TicketDetailSkeleton } from "./_components/ticketDetailsSkeleton/TicketDetailsSkeleton";
import { TicketNotFound } from "./_components/ticketNotFound/TicketNotFound";
import { TicketHeader } from "./_components/ticketHeader/TicketHeader";
import { TicketMessageCard } from "./_components/ticketMessageCard/TicketMessageCard";
import { TicketPendingReply } from "./_components/ticketPendingReply/TicketPendingReply";
import { TicketFooter } from "./_components/ticketFooter/TicketFooter";

export default function TicketDetails() {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const { selectedTicket, loading, fetchTicketDetails, clearSelectedTicket } =
        useUserStore();

    useEffect(() => {
        if (ticketId) fetchTicketDetails(ticketId);
        return () => clearSelectedTicket();
    }, [ticketId]); // eslint-disable-line react-hooks/exhaustive-deps

    const onBack = () => navigate("/profile/tickets");

    if (loading.ticket) {
        return (
            <div className="flex flex-col gap-5" dir="rtl">
                <TicketDetailSkeleton />
            </div>
        );
    }

    if (!selectedTicket) {
        return <TicketNotFound onBack={onBack} />;
    }

    const ticket = selectedTicket;
    const status = getTicketStatus(ticket);

    return (
        <div className="flex flex-col gap-4" dir="rtl">
            <TicketHeader ticket={ticket} status={status} onBack={onBack} />

            <TicketMessageCard
                variant="user"
                icon={IconUser}
                label="پیام شما"
                date={ticket.creationDate}
                message={ticket.message}
            />

            {ticket.isAnswered && ticket.adminReply ? (
                <TicketMessageCard
                    variant="admin"
                    icon={IconMessageCheck}
                    label="پاسخ پشتیبانی"
                    date={ticket.adminReplyDate ?? ticket.creationDate}
                    message={ticket.adminReply}
                />
            ) : (
                <TicketPendingReply />
            )}

            <TicketFooter
                creationDate={ticket.creationDate}
                adminReplyDate={ticket.adminReplyDate}
            />
        </div>
    );
}
