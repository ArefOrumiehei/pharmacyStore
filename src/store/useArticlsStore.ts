import { create } from "zustand";
import {
  getArticleBySlugAndCatgSlug,
  getLatestArticles,
  getArticleBySearch,
  getTopRatedArticles,
  getMostViewedArticles,
  type IArticle,
} from "@/services/articleServices/articleServices";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ILoadingState {
  article:    boolean;
  latest:     boolean;
  search:     boolean;
  topRated:   boolean;
  mostViewed: boolean;
}

interface IErrorState {
  article:    string | null;
  latest:     string | null;
  search:     string | null;
  topRated:   string | null;
  mostViewed: string | null;
}

interface IArticleStore {
  selectedArticle:    IArticle | null;
  latestArticles:     IArticle[];
  searchResults:      IArticle[];
  topRatedArticles:   IArticle[];
  mostViewedArticles: IArticle[];
  loading:            ILoadingState;
  error:              IErrorState;

  fetchArticle:          (articleSlug: string, catgSlug: string) => Promise<void>;
  fetchLatestArticles:   ()                                       => Promise<void>;
  fetchArticlesBySearch: (query: string)                          => Promise<void>;
  fetchTopRated:         ()                                       => Promise<void>;
  fetchMostViewed:       ()                                       => Promise<void>;
  clearSearchResults:    ()                                       => void;
  clearSelectedArticle:  ()                                       => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_LOADING: ILoadingState = {
  article:    false,
  latest:     false,
  search:     false,
  topRated:   false,
  mostViewed: false,
};

const DEFAULT_ERROR: IErrorState = {
  article:    null,
  latest:     null,
  search:     null,
  topRated:   null,
  mostViewed: null,
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const extractMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response;
    return r?.data?.message ?? fallback;
  }
  return fallback;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useArticleStore = create<IArticleStore>((set) => ({
  selectedArticle:    null,
  latestArticles:     [],
  searchResults:      [],
  topRatedArticles:   [],
  mostViewedArticles: [],
  loading:            DEFAULT_LOADING,
  error:              DEFAULT_ERROR,

  // ── Single article ─────────────────────────────────────────────────────────

  fetchArticle: async (articleSlug, catgSlug) => {
    set((s) => ({
      loading: { ...s.loading, article: true  },
      error:   { ...s.error,   article: null  },
    }));
    try {
      const data = await getArticleBySlugAndCatgSlug(articleSlug, catgSlug);
      set((s) => ({
        selectedArticle: data,
        loading: { ...s.loading, article: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, article: false },
        error:   { ...s.error,   article: extractMessage(err, "خطا در دریافت مقاله") },
      }));
    }
  },

  // ── Latest ────────────────────────────────────────────────────────────────

  fetchLatestArticles: async () => {
    set((s) => ({
      loading: { ...s.loading, latest: true },
      error:   { ...s.error,   latest: null },
    }));
    try {
      const data = await getLatestArticles();
      set((s) => ({
        latestArticles: data,
        loading: { ...s.loading, latest: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, latest: false },
        error:   { ...s.error,   latest: extractMessage(err, "خطا در دریافت جدیدترین مقالات") },
      }));
    }
  },

  // ── Search ────────────────────────────────────────────────────────────────

  fetchArticlesBySearch: async (query) => {
    set((s) => ({
      loading: { ...s.loading, search: true },
      error:   { ...s.error,   search: null },
    }));
    try {
      const data = await getArticleBySearch(query);
      set((s) => ({
        searchResults: data,
        loading: { ...s.loading, search: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, search: false },
        error:   { ...s.error,   search: extractMessage(err, "خطا در جستجوی مقالات") },
      }));
    }
  },

  // ── Top rated ─────────────────────────────────────────────────────────────

  fetchTopRated: async () => {
    set((s) => ({
      loading: { ...s.loading, topRated: true },
      error:   { ...s.error,   topRated: null },
    }));
    try {
      const data = await getTopRatedArticles();
      set((s) => ({
        topRatedArticles: data,
        loading: { ...s.loading, topRated: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, topRated: false },
        error:   { ...s.error,   topRated: extractMessage(err, "خطا در دریافت پربازدیدترین مقالات") },
      }));
    }
  },

  // ── Most viewed ───────────────────────────────────────────────────────────

  fetchMostViewed: async () => {
    set((s) => ({
      loading: { ...s.loading, mostViewed: true },
      error:   { ...s.error,   mostViewed: null },
    }));
    try {
      const data = await getMostViewedArticles();
      set((s) => ({
        mostViewedArticles: data,
        loading: { ...s.loading, mostViewed: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, mostViewed: false },
        error:   { ...s.error,   mostViewed: extractMessage(err, "خطا در دریافت محبوب‌ترین مقالات") },
      }));
    }
  },

  // ── Helpers ───────────────────────────────────────────────────────────────

  clearSearchResults:   () => set({ searchResults: [],  error: { ...DEFAULT_ERROR } }),
  clearSelectedArticle: () => set({ selectedArticle: null, error: { ...DEFAULT_ERROR } }),
}));