import type { StateCreator } from "zustand";
import { getUserTickets, getTicketDetails } from "@/services/accountServices";
import type { ITicketsSlice, IUserStore } from "../types";
import { toastIfNot404 } from "../helpers";

export const createTicketsSlice: StateCreator<IUserStore, [], [], ITicketsSlice> = (set) => ({
    userTickets: null,
    selectedTicket: null,

    fetchUserTickets: async () => {
        set((s) => ({ loading: { ...s.loading, tickets: true } }));
        try {
            const res = await getUserTickets();
            set((s) => ({ userTickets: res.data, loading: { ...s.loading, tickets: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, tickets: false } }));
            toastIfNot404(err, "خطا در دریافت تیکت‌ها");
        }
    },

    fetchTicketDetails: async (ticketId) => {
        set((s) => ({ loading: { ...s.loading, ticket: true }, selectedTicket: null }));
        try {
            const res = await getTicketDetails(ticketId);
            set((s) => ({ selectedTicket: res.data, loading: { ...s.loading, ticket: false } }));
        } catch (err) {
            set((s) => ({ loading: { ...s.loading, ticket: false } }));
            toastIfNot404(err, "خطا در دریافت جزئیات تیکت");
        }
    },

    clearSelectedTicket: () => set({ selectedTicket: null }),
});