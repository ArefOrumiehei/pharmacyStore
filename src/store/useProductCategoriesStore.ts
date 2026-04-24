import { getAllProductCategories, getProductCategoriesByName } from "@/services/categoriesServices/productCategoriesServices";
import { create } from "zustand";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductCategory {
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
  products: any[] | null;
  parentId: number | null;
  children: ProductCategory[];
  productsCount: number;
}

interface ProductCategoriesStore {
  categories: ProductCategory | null | any;
  loading: boolean;
  error: string | null;
  fetchAllProductCategories: () => Promise<void>;
  clearSlides: () => void;
}

export const useProductCategoriesStore = create<ProductCategoriesStore>((set) => ({
  categories: null,
  loading: false,
  error: null,

  fetchAllProductCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getAllProductCategories();
      set({ categories, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProductCategoriesByName: async (catgName: string) => {
    set({ loading: true, error: null });
    try {
      const categories = await getProductCategoriesByName(catgName);
      set({ categories, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearSlides: () => set({ categories: null }),
}))
