import { useEffect } from "react";
import { useUserStore } from "@/store/account/useAccountStore";

// Types
import type { ITicket } from "@/types/account/account";

// Components
import TicketsHeader from "./_components/ticketsHeader/TicketsHeader";
import TicketsListSkeleton from "./_components/ticketsListSkeleton/TicketsListSkeleton";
import TicketsEmptyState from "./_components/ticketsEmptyState/TicketsEmptyState";
import TicketCard from "./_components/ticketCard/TicketCard";

export default function Tickets() {
    const { userTickets, loading, fetchUserTickets } = useUserStore();

    useEffect(() => {
        fetchUserTickets();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const tickets: ITicket[] = userTickets ?? [];

    return (
        <div className="flex flex-col gap-3.5 sm:gap-5" dir="rtl">
            <TicketsHeader
                count={tickets.length}
                showCount={!loading.tickets && tickets.length > 0}
            />

            {loading.tickets ? (
                <TicketsListSkeleton />
            ) : tickets.length === 0 ? (
                <TicketsEmptyState />
            ) : (
                <div className="flex flex-col gap-2.5 sm:gap-3">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
}
