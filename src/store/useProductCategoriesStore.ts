import {
  getAllProductCategories,
  getProductCategoriesByName,
} from "@/services/categoriesServices/productCategoriesServices";
import { create } from "zustand";

export interface ProductCategory {
  icon: string;
  id: number;
  name: string;
  picture: string | null;
  pictureAlt: string | null;
  pictureTitle: string | null;
  slug: string | null;
  fullSlug: string | null;
  keywords: string | null;
  metaDescription: string | null;
  description: string | null;
  products: unknown[] | null;
  parentId: number | null;
  children: ProductCategory[];
  productsCount: number;
}

interface ProductCategoriesStore {
  categories: ProductCategory[] | null;
  selectedCategory: ProductCategory | null;
  loading: boolean;
  error: string | null;
  fetchAllProductCategories: () => Promise<void>;
  fetchProductCategoriesByName: (catgName: string) => Promise<void>;
  clearCategories: () => void;
}

export const useProductCategoriesStore = create<ProductCategoriesStore>(
  (set) => ({
    categories: null,
    selectedCategory: null,
    loading: false,
    error: null,

    fetchAllProductCategories: async () => {
      set({ loading: true, error: null });
      try {
        const categories = await getAllProductCategories();
        set({ categories, loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        set({ error: message, loading: false });
      }
    },

    fetchProductCategoriesByName: async (catgName: string) => {
      set({ loading: true, error: null });
      try {
        const selectedCategory = await getProductCategoriesByName(catgName);
        set({ selectedCategory, loading: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        set({ error: message, loading: false });
      }
    },

    clearCategories: () => set({ categories: null, selectedCategory: null }),
  })
);