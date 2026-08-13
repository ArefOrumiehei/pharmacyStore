import { create } from "zustand";
import { toast } from "react-toastify";
import {
  createTicket,
  type ICreateTicketParams,
} from "@/services/ticketServices/ticketServices";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TicketStore {
  submitLoading: boolean;
  error: string | null;
  ticketCode: string;

  submitTicket: (params: ICreateTicketParams) => Promise<void>;
  clearTicketStates: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const extractMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response;
    return r?.data?.message ?? fallback;
  }
  return fallback;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTicketStore = create<TicketStore>((set) => ({
  submitLoading: false,
  error: null,
  ticketCode: "",

  // ── Submit new ticket — returns tracking code or null ─────────────────────
  submitTicket: async (params) => {
    set({ submitLoading: true, error: null, ticketCode: "" });
    try {
      const res = await createTicket(params);
      set({ submitLoading: false, ticketCode: res.data });
      if (res.success) {
        // toast.success(res.message || "تیکت شما ثبت شد");
      } else {
        toast.warn(res.message || "تیکت شما ثبت شد");
      }
    } catch (err) {
      const message = extractMessage(err, "خطا در ارسال تیکت");
      set({ submitLoading: false, error: message });
      toast.error(message);
    }
  },

  clearTicketStates: () => {
    set({submitLoading: false, ticketCode: "", error: null});
  },
}));