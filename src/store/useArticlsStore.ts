/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { Article } from "./useArticleCategoriesStore";
import { getArticleBySearch, getArticleBySlugAndCatgSlug, getLatesArrivalsArticle, getMostViewedArticles, getTopRatedArticles } from "@/services/articleServices/articleServices";

interface ArticleStore {
  articles: Article[];
  selectedArticle: Article | null;
  latestArticles: Article[];
  searchResults: Article[];
  topRatedArticles: Article[];
  mostViewedArticles: Article[];
  loading: boolean;
  error: string | null;

  fetchArticleBySlugAndCatgSlug: (articleSlug: string, catgSlug: string) => Promise<void>;
  fetchLatestArrivals: () => Promise<void>;
  fetchArticlesBySearch: (query: string) => Promise<void>;
  fetchTopRated: () => Promise<void>;
  fetchMostViewed: () => Promise<void>;
  clearSearchResults: () => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  selectedArticle: null,
  latestArticles: [],
  searchResults: [],
  topRatedArticles: [],
  mostViewedArticles: [],
  loading: false,
  error: null,

  fetchArticleBySlugAndCatgSlug: async (articleSlug: string, catgSlug: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getArticleBySlugAndCatgSlug(articleSlug, catgSlug);
      set({ selectedArticle: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchLatestArrivals: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLatesArrivalsArticle();
      set({ latestArticles: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchArticlesBySearch: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getArticleBySearch(query);
      set({ searchResults: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTopRated: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTopRatedArticles();
      set({ topRatedArticles: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMostViewed: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getMostViewedArticles();
      set({ mostViewedArticles: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),
}));
