import { create } from "zustand";
import {
  getAllArticleCategories,
  getArticleCategoryBySlug,
  type IArticleCategory,
} from "@/services/categoriesServices/articleCategoriesServices";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ILoadingState {
  all:      boolean;
  selected: boolean;
}

interface IErrorState {
  all:      string | null;
  selected: string | null;
}

interface IArticleCategoriesStore {
  categories:       IArticleCategory[];
  selectedCategory: IArticleCategory | null;
  loading:          ILoadingState;
  error:            IErrorState;

  fetchAllCategories:    ()             => Promise<void>;
  fetchCategoryBySlug:   (slug: string) => Promise<void>;
  clearSelectedCategory: ()             => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_LOADING: ILoadingState = {
  all:      false,
  selected: false,
};

const DEFAULT_ERROR: IErrorState = {
  all:      null,
  selected: null,
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

export const useArticleCategoriesStore = create<IArticleCategoriesStore>((set) => ({
  categories:       [],
  selectedCategory: null,
  loading:          DEFAULT_LOADING,
  error:            DEFAULT_ERROR,

  fetchAllCategories: async () => {
    set((s) => ({
      loading: { ...s.loading, all: true  },
      error:   { ...s.error,   all: null  },
    }));
    try {
      const data = await getAllArticleCategories();
      set((s) => ({
        categories: data,
        loading:    { ...s.loading, all: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, all: false },
        error:   { ...s.error,   all: extractMessage(err, "خطا در دریافت دسته‌بندی مقالات") },
      }));
    }
  },

  fetchCategoryBySlug: async (slug) => {
    set((s) => ({
      loading: { ...s.loading, selected: true  },
      error:   { ...s.error,   selected: null  },
    }));
    try {
      const data = await getArticleCategoryBySlug(slug);
      set((s) => ({
        selectedCategory: data,
        loading:          { ...s.loading, selected: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, selected: false },
        error:   { ...s.error,   selected: extractMessage(err, "خطا در دریافت دسته‌بندی") },
      }));
    }
  },

  clearSelectedCategory: () => set({ selectedCategory: null, error: DEFAULT_ERROR }),
}));