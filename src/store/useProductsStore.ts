/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface Product {
  id: number;
  picture: string;
  pictureAlt: string;
  pictureTitle: string;
  name: string;
  doublePrice: number;
  price: number | null;
  priceWithDiscount: number | null;
  discountRate: number;
  category: string;
  categoryName: string;
  categoryFullSlug: string;
  hasDiscount: boolean;
  discountExpireDate: string | null;
  code: string | null;
  shortDescription: string | null;
  slug: string;
  description: string | null;
  specifications: string | null;
  keywords: string | null;
  metaDescription: string;
  isInStock: boolean;
  comments: any | null;
  pictures: any | null;
  categorySlug: string | null;
  avgRate: number;
  rateCount: number;
  currentUserFaved: boolean;
}

interface ProductStore {
  product: Product | any;
  latestArrivals: Product[] | any;
  searchResults: Product[] | any;
  randomRecommendation: Product[] | any;
  topRated: Product[] | any;
  mostViewed: Product[] | any;

  loading: boolean;
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
  latestArrivals: null,
  searchResults: null,
  randomRecommendation: null,
  topRated: null,
  mostViewed: null,

  loading: false,
  error: null,

  fetchProductByName: async (productName: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getProductByName(productName);
      set({ product: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchLatestArrivals: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLatestArrivalsProduct();
      set({ latestArrivals: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProductsBySearch: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getProductsBySearch(query);
      set({ searchResults: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchRandomRecommendation: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRandomRecommendation();
      set({ randomRecommendation: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTopRated: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTopRatedProducts();
      set({ topRated: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMostViewed: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getMostViewedProducts();
      set({ mostViewed: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addToFavorites: async (productId: number) => {
    set({ error: null });
    try {
      const res = await addProductToFavorites(productId);
      console.log(res);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  removeFromFavorites: async (productId: number) => {
    set({ error: null });
    try {
      await removeProductFromFavorites(productId);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  clearSearchResults: () => set({ searchResults: null }),
}));
