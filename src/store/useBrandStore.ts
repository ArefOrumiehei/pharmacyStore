import { getBrandByName } from "@/services/brandServices/brandServices";
import { create } from "zustand";
import type { Product } from "@/store/useProductsStore";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export interface BrandProductList {
  items: Product[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string | null;
  picture: string | null;
  pictureAlt: string | null;
  description: string | null;
  productsCount: number;
  products: BrandProductList;
  categories: string[];
}

interface BrandStore {
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
  fetchBrandByName: (brandName: string, page?: number, pageSize?: number) => Promise<void>;
  clearBrand: () => void;
}

/* ─────────────────────────────────────────
   STORE
───────────────────────────────────────── */
export const useBrandStore = create<BrandStore>((set) => ({
  selectedBrand: null,
  loading: false,
  error: null,

  fetchBrandByName: async (brandName: string, page = 1, pageSize = 12) => {
    set({ loading: true, error: null });
    try {
      const selectedBrand = await getBrandByName(brandName, page, pageSize);
      set({ selectedBrand, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  clearBrand: () => set({ selectedBrand: null }),
}));