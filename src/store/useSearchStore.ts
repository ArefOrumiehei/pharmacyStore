import { create } from "zustand";
import { search } from "@/services/searchServices/searchServices";
import type {
  SearchParams,
  SearchProduct,
  SearchMeta,
  SortOption,
} from "@/services/searchServices/searchServices";

/* ─────────────────────────────────────────
   RE-EXPORT TYPES consumers may need
───────────────────────────────────────── */
export type { SearchParams, SearchProduct, SearchMeta, SortOption };

/* ─────────────────────────────────────────
   FILTER STATE
   Mirrors SearchParams minus pagination/sort
   so the UI can build filters incrementally.
───────────────────────────────────────── */
export interface ActiveFilters {
  query?: string;
  brandSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  attributes: Record<string, string[]>;
}

/* ─────────────────────────────────────────
   STORE STATE
───────────────────────────────────────── */
interface SearchState {
  // Results
  items: SearchProduct[];
  meta: SearchMeta | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;

  // Sorting
  sort: SortOption;

  // Active filters (what the user has selected)
  filters: ActiveFilters;

  // Async state
  loading: boolean;
  error: string | null;
}

/* ─────────────────────────────────────────
   STORE ACTIONS
───────────────────────────────────────── */
interface SearchActions {
  /**
   * Main fetch — merges any provided params on top of current state.
   * Call this after setting filters/sort/page, or pass overrides directly.
   */
  fetchResults: (overrides?: Partial<SearchParams>) => Promise<void>;

  /**
   * Convenience: jump to a specific page without changing other params.
   */
  goToPage: (page: number) => Promise<void>;

  /**
   * Convenience: change sort without changing other params.
   */
  setSort: (sort: SortOption) => Promise<void>;

  /**
   * Update one or more filters and re-fetch from page 1.
   */
  applyFilters: (filters: Partial<ActiveFilters>) => Promise<void>;

  /**
   * Clear all filters (but keep brandSlug/categorySlug scope if desired).
   */
  clearFilters: () => Promise<void>;

  /**
   * Hard reset — useful when navigating away from a search page.
   */
  reset: () => void;
}

/* ─────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────── */
const DEFAULT_PAGE_SIZE = 12;

const initialState: SearchState = {
  items: [],
  meta: null,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  sort: "newest",
  filters: {
    attributes: {},
  },
  loading: false,
  error: null,
};

/* ─────────────────────────────────────────
   STORE
───────────────────────────────────────── */
export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
  ...initialState,

  /* ── Core fetch ─────────────────────────── */
  fetchResults: async (overrides = {}) => {
    const state = get();

    const params: SearchParams = {
      // Active filters
      query: state.filters.query,
      brandSlug: state.filters.brandSlug,
      categorySlug: state.filters.categorySlug,
      minPrice: state.filters.minPrice,
      maxPrice: state.filters.maxPrice,
      inStock: state.filters.inStock,
      attributes:
        Object.keys(state.filters.attributes).length > 0
          ? state.filters.attributes
          : undefined,

      // Pagination & sort
      page: state.currentPage,
      pageSize: state.pageSize,
      sort: state.sort,

      // Caller can override anything above
      ...overrides,
    };

    set({ loading: true, error: null });

    try {
      const result = await search(params);
      set({
        items: result.items,
        meta: result.meta,
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

  /* ── Page navigation ────────────────────── */
  goToPage: async (page) => {
    set({ currentPage: page });
    await get().fetchResults({ page });
  },

  /* ── Sort ───────────────────────────────── */
  setSort: async (sort) => {
    set({ sort, currentPage: 1 });
    await get().fetchResults({ sort, page: 1 });
  },

  /* ── Filters ────────────────────────────── */
  applyFilters: async (incoming) => {
    const merged: ActiveFilters = {
      ...get().filters,
      ...incoming,
      // Deep-merge attributes instead of replacing
      attributes: {
        ...get().filters.attributes,
        ...(incoming.attributes ?? {}),
      },
    };
    set({ filters: merged, currentPage: 1 });
    await get().fetchResults({ page: 1 });
  },

  clearFilters: async () => {
    // Preserve scope (brand/category) but wipe attribute/price filters
    const { brandSlug, categorySlug } = get().filters;
    const cleared: ActiveFilters = {
      brandSlug,
      categorySlug,
      attributes: {},
    };
    set({ filters: cleared, currentPage: 1 });
    await get().fetchResults({ page: 1 });
  },

  /* ── Full reset ─────────────────────────── */
  reset: () => set(initialState),
}));