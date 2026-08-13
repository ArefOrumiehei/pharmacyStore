import type { IArticle } from "@/services/articleServices/articleServices";
import { searchArticles, type ArticleSearchParams } from "@/services/searchServices/articleSeachServices";
import { create } from "zustand";


/* ────── STORE STATE ─────────────────────────── */
interface ArticleSearchState {
  items: IArticle[];

  value: string;

  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;

  loading: boolean;
  error: string | null;
}

/* ────── STORE ACTIONS ────────────────────────── */
interface ArticleSearchActions {
  /**
   * Main fetch — merges any provided params on top of current state.
   */
  fetchResults: (overrides?: Partial<ArticleSearchParams>) => Promise<void>;

  /**
   * Set the search term and re-fetch from page 1.
   */
  setValue: (value: string) => Promise<void>;

  /**
   * Jump to a specific page without changing the search term.
   */
  goToPage: (page: number) => Promise<void>;

  /**
   * Hard reset — useful when navigating away from the search page.
   */
  reset: () => void;
}

/* ────── INITIAL STATE ───────────────────────── */
const DEFAULT_PAGE_SIZE = 12;

const initialState: ArticleSearchState = {
  items: [],
  value: "",
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  loading: false,
  error: null,
};

export const useArticleSearchStore = create<ArticleSearchState & ArticleSearchActions>((set, get) => ({
  ...initialState,

  fetchResults: async (overrides = {}) => {
    const state = get();

    const params: ArticleSearchParams = {
      value: state.value,
      page: state.currentPage,
      pageSize: state.pageSize,
      ...overrides,
    };

    set({ loading: true, error: null });

    try {
      const result = await searchArticles(params);
      set({
        items: result.items,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
        loading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      set({ error: message, loading: false });
    }
  },

  setValue: async (value) => {
    set({ value, currentPage: 1 });
    await get().fetchResults({ value, page: 1 });
  },

  goToPage: async (page) => {
    set({ currentPage: page });
    await get().fetchResults({ page });
  },

  reset: () => set(initialState),
}));