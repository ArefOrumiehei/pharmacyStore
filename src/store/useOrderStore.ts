import { create } from "zustand";
import { toast } from "react-toastify";
import {
  createOrder,
  verifyPayment,
  downloadInvoice,
  getCheckoutPreview,
  type CreatePaymentRequest,
  type IOrderResponse,
  type ICheckoutPreview,
} from "@/services/orderServices/orderServices";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ILoadingState {
  createOrder:     boolean;
  verifyPayment:   boolean;
  downloadInvoice: boolean;
  preview:         boolean;
}

interface IOrderStore {
  orderId:         number | null;
  redirectUrl:     string | null;
  preview:         ICheckoutPreview | null;
  loading:         ILoadingState;

  createOrder:        (data: CreatePaymentRequest)     => Promise<IOrderResponse>;
  verifyPayment:      (orderId: number, trackId: string)   => Promise<void>;
  downloadInvoice:    (orderId: number)                => Promise<void>;
  fetchPreview:       (coupon?: string)                => Promise<void>;
  reset:              ()                               => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_LOADING: ILoadingState = {
  createOrder:     false,
  verifyPayment:   false,
  downloadInvoice: false,
  preview:         false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response;
    return r?.data?.message ?? fallback;
  }
  return fallback;
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a   = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useOrderStore = create<IOrderStore>((set) => ({
  orderId:     null,
  redirectUrl: null,
  preview:     null,
  loading:     DEFAULT_LOADING,

  // ── Create order ───────────────────────────────────────────────────────────

  createOrder: async (data) => {
    set((s) => ({ loading: { ...s.loading, createOrder: true } }));
    try {
      const res = await createOrder(data);
      set((s) => ({
        orderId:     res.data.orderId,
        redirectUrl: res.data.redirectUrl ?? null,
        loading:     { ...s.loading, createOrder: false },
      }));
      return res;
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, createOrder: false } }));
      toast.error(extractMessage(err, "خطا در ثبت سفارش"));
      throw err;
    }
  },

  // ── Verify payment ─────────────────────────────────────────────────────────

  verifyPayment: async (orderId, trackId) => {
    set((s) => ({ loading: { ...s.loading, verifyPayment: true } }));
    try {
      await verifyPayment(orderId, trackId);
      set((s) => ({ loading: { ...s.loading, verifyPayment: false } }));
      toast.success("پرداخت با موفقیت تأیید شد");
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, verifyPayment: false } }));
      toast.error(extractMessage(err, "خطا در تأیید پرداخت"));
      throw err;
    }
  },

  // ── Download invoice ───────────────────────────────────────────────────────

  downloadInvoice: async (orderId) => {
    set((s) => ({ loading: { ...s.loading, downloadInvoice: true } }));
    try {
      const blob = await downloadInvoice(orderId);
      triggerDownload(blob, `invoice-${orderId}.pdf`);
      set((s) => ({ loading: { ...s.loading, downloadInvoice: false } }));
      toast.success("فاکتور با موفقیت دانلود شد");
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, downloadInvoice: false } }));
      toast.error(extractMessage(err, "خطا در دانلود فاکتور"));
    }
  },

  // ── Checkout preview ───────────────────────────────────────────────────────

  fetchPreview: async (coupon) => {
    set((s) => ({ loading: { ...s.loading, preview: true } }));
    try {
      const data = await getCheckoutPreview(coupon);
      set((s) => ({ preview: data, loading: { ...s.loading, preview: false } }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, preview: false } }));
      toast.error(extractMessage(err, "خطا در دریافت اطلاعات سبد خرید"));
    }
  },

  // ── Reset ──────────────────────────────────────────────────────────────────

  reset: () => set({ orderId: null, redirectUrl: null, preview: null, loading: DEFAULT_LOADING }),
}));