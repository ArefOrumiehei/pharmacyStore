import { getTicketTitles, type ITicketSubjects } from "@/services/siteServices/siteServices";
import { toast } from "react-toastify";
import { create } from "zustand";

// ----- Types ----------
interface SiteStore {
  titles: ITicketSubjects[];
  titlesLoading: boolean;
  error: string | null;

  fetchTitles: () => Promise<void>;
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

}))