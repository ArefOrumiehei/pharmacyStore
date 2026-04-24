import { create } from "zustand";
import {
  createOrder,
  downloadInvoice,
  verifyPayment,
  type CreatePaymentRequest,
} from "@/services/orderServices/orderServices";

/* ---------------- TYPES ---------------- */
interface OrderResponse {
  data: {
    orderId: number;
    redirectUrl?: string;
    shouldRedirect?: boolean;
  };
  message?: string;
}

interface PaymentState {
  loading: boolean;
  orderId: number | null;
  redirectUrl: string | null;
  error: string | null;

  createOrder: (data: CreatePaymentRequest) => Promise<OrderResponse>;
  verifyPayment: (orderId: number, trackId: string) => Promise<void>;
  downloadInvoice: (orderId: number) => Promise<void>;
  reset: () => void;
}

/* ---------------- HELPERS ---------------- */
const handleError = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback;

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
};

/* ---------------- STORE ---------------- */
export const useOrderStore = create<PaymentState>((set) => ({
  loading: false,
  orderId: null,
  redirectUrl: null,
  error: null,

  createOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const res: OrderResponse = await createOrder(data);
      set({
        orderId: res.data.orderId,
        redirectUrl: res.data.redirectUrl ?? null,
        loading: false,
      });
      return res;
    } catch (err) {
      set({ loading: false, error: handleError(err, "خطا در ثبت سفارش") });
      throw err;
    }
  },

  verifyPayment: async (orderId, trackId) => {
    set({ loading: true, error: null });
    try {
      const res  = await verifyPayment({ orderId, trackId });
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false, error: handleError(err, "خطا در تایید پرداخت") });
      throw err;
    }
  },

  downloadInvoice: async (orderId) => {
    try {
      const blob = await downloadInvoice(orderId);
      triggerDownload(blob, `invoice-${orderId}.pdf`);
    } catch (err) {
      set({ error: handleError(err, "خطا در دانلود فاکتور") });
    }
  },

  reset: () =>
    set({ loading: false, orderId: null, redirectUrl: null, error: null }),
}));