import {
  getTicketTitles,
  getSiteGlobalSetting,
  getAboutUsData,
  getFAQData,
  getTermsData,
  getReturnPolicyData,
  getPaymentMethods,
  type ITicketSubjects,
  type ISiteGlobalSetting,
  type IAboutUsData,
  type IFAQData,
  type ITermsData,
  type IReturnPolicyData,
  type IPaymentMethods,
} from "@/services/siteServices/siteServices";
import { toast } from "react-toastify";
import { create } from "zustand";

// ----- Types ----------
interface SiteStore {
  titles: ITicketSubjects[];
  titlesLoading: boolean;

  globalSetting: ISiteGlobalSetting | null;
  globalSettingLoading: boolean;

  aboutUs: IAboutUsData | null;
  aboutUsLoading: boolean;

  faq: IFAQData | null;
  faqLoading: boolean;

  terms: ITermsData | null;
  termsLoading: boolean;

  returnPolicy: IReturnPolicyData | null;
  returnPolicyLoading: boolean;

  paymentMethods: IPaymentMethods | null;
  paymentMethodsLoading: boolean;

  error: string | null;

  fetchTitles: () => Promise<void>;
  fetchGlobalSetting: () => Promise<void>;
  fetchAboutUs: () => Promise<void>;
  fetchFAQ: () => Promise<void>;
  fetchTerms: () => Promise<void>;
  fetchReturnPolicy: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const extractMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response;
    return r?.data?.message ?? fallback;
  }
  return fallback;
};

export const useSiteStore = create<SiteStore>((set) => ({
  titles: [],
  titlesLoading: false,

  globalSetting: null,
  globalSettingLoading: false,

  aboutUs: null,
  aboutUsLoading: false,

  faq: null,
  faqLoading: false,

  terms: null,
  termsLoading: false,

  returnPolicy: null,
  returnPolicyLoading: false,

  paymentMethods: null,
  paymentMethodsLoading: false,

  error: null,

  // ── Fetch dynamic subject titles from API ─────────────────────────────────
  fetchTitles: async () => {
    set({ titlesLoading: true, error: null });
    try {
      const res = await getTicketTitles();
      set({ titles: res.titles, titlesLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت موضوعات");
      set({ titlesLoading: false, error: message });
      toast.error(message);
    }
  },

  // ── Fetch global site setting (logo, favicon, socials, contact, general) ──
  fetchGlobalSetting: async () => {
    set({ globalSettingLoading: true, error: null });
    try {
      const res = await getSiteGlobalSetting();
      set({ globalSetting: res, globalSettingLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت تنظیمات سایت");
      set({ globalSettingLoading: false, error: message });
      toast.error(message);
    }
  },

  // ── Fetch "about us" page content ──────────────────────────────────────────
  fetchAboutUs: async () => {
    set({ aboutUsLoading: true, error: null });
    try {
      const res = await getAboutUsData();
      set({ aboutUs: res, aboutUsLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت درباره ما");
      set({ aboutUsLoading: false, error: message });
      toast.error(message);
    }
  },

  // ── Fetch FAQ items ─────────────────────────────────────────────────────────
  fetchFAQ: async () => {
    set({ faqLoading: true, error: null });
    try {
      const res = await getFAQData();
      set({ faq: res, faqLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت سوالات متداول");
      set({ faqLoading: false, error: message });
      toast.error(message);
    }
  },

  // ── Fetch terms & conditions text ──────────────────────────────────────────
  fetchTerms: async () => {
    set({ termsLoading: true, error: null });
    try {
      const res = await getTermsData();
      set({ terms: res, termsLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت قوانین و مقررات");
      set({ termsLoading: false, error: message });
      toast.error(message);
    }
  },

  // ── Fetch return policy text ───────────────────────────────────────────────
  fetchReturnPolicy: async () => {
    set({ returnPolicyLoading: true, error: null });
    try {
      const res = await getReturnPolicyData();
      set({ returnPolicy: res, returnPolicyLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت قوانین بازگشت کالا");
      set({ returnPolicyLoading: false, error: message });
      toast.error(message);
    }
  },

  // ── Fetch payment methods (bank cards) ─────────────────────────────────────
  fetchPaymentMethods: async () => {
    set({ paymentMethodsLoading: true, error: null });
    try {
      const res = await getPaymentMethods();
      set({ paymentMethods: res, paymentMethodsLoading: false });
    } catch (err) {
      const message = extractMessage(err, "خطا در دریافت روش‌های پرداخت");
      set({ paymentMethodsLoading: false, error: message });
      toast.error(message);
    }
  },
}));