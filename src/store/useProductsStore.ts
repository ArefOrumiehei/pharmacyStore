import {
  getLatestArrivalsProduct,
  getProductByName,
  getProductsBySearch,
  getRandomRecommendation,
  getTopRatedProducts,
  getMostViewedProducts,
  addProductToFavorites,
  removeProductFromFavorites,
} from "@/services/productServices/productServices";
import { create } from "zustand";
import { useUserStore } from "./useAccountStore";

export interface Product {
  id: number;
  name: string;
  picture: string;
  pictureAlt: string;
  pictureTitle: string;
  slug: string;
  code: string | null;
  brand: string;
  shortDescription: string | null;
  description: string | null;
  specifications: string | null;
  keywords: string | null;
  metaDescription: string;
  doublePrice: number;
  price: number;
  priceWithDiscount: number;
  discountRate: number;
  hasDiscount: boolean;
  discountExpireDate: string | null;
  isInStock: boolean;
  inStockQty: number;
  category: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  categoryFullSlug: string;
  avgRate: number;
  rateCount: number;
  commentCount: number;
  viewCount: number;
  isCurrentUserFaved: boolean;
  currentUserFavedDate: string | null;
  comments: unknown | null;
  pictures: unknown | null;
}

interface ProductStore {
  product: Product | null;
  latestArrivals: Product[];
  searchResults: Product[];
  randomRecommendation: Product[];
  topRated: Product[];
  mostViewed: Product[];

  loading: boolean;
  searchLoading: boolean;
  error: string | null;

  fetchProductByName: (productName: string) => Promise<void>;
  fetchLatestArrivals: () => Promise<void>;
  fetchProductsBySearch: (query: string) => Promise<void>;
  fetchRandomRecommendation: () => Promise<void>;
  fetchTopRated: () => Promise<void>;
  fetchMostViewed: () => Promise<void>;

  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;

  clearSearchResults: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  product: null,
  latestArrivals: [],
  searchResults: [],
  randomRecommendation: [],
  topRated: [],
  mostViewed: [],

  loading: false,
  searchLoading: false,
  error: null,

  fetchProductByName: async (productName: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getProductByName(productName);
      set({ product: data, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  fetchLatestArrivals: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLatestArrivalsProduct();
      set({ latestArrivals: data, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  fetchProductsBySearch: async (query: string) => {
    set({ searchLoading: true, error: null });
    try {
      const data = await getProductsBySearch(query);
      set({ searchResults: data, searchLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, searchLoading: false });
    }
  },

  fetchRandomRecommendation: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRandomRecommendation();
      set({ randomRecommendation: data, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  fetchTopRated: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTopRatedProducts();
      set({ topRated: data, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  fetchMostViewed: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getMostViewedProducts();
      set({ mostViewed: data, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  addToFavorites: async (productId: number) => {
    set({ error: null });
    try {
      await addProductToFavorites(productId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message });
    }
  },

  removeFromFavorites: async (productId: number) => {
    set({ error: null });
    try {
      await removeProductFromFavorites(productId);
      await useUserStore.getState().fetchUserFavorites();
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message });
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),
}));