/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllArticleCategories, getArticleCategoriesByName } from "@/services/categoriesServices/articleCategoriesServices";
import { create } from "zustand";

export interface ArticleCategory {
  name: string;
  picture: string | null;
  pictureAlt: string | null;
  pictureTitle: string | null;
  description: string | null;
  showOrder: number;
  slug: string;
  keywords: string | null;
  keywordList: string[] | null;
  metaDescription: string | null;
  canonicalAddress: string | null;
  articlesCount: number;
  articles: Article[] | null;
}

export interface Article {
  id: number;
  title: string;
  shortDescription: string;
  body: string | null;
  picture: string;
  pictureAlt: string;
  pictureTitle: string;
  publishDate: string;
  slug: string;
  keywords: string | null;
  keywordList: string[] | null;
  metaDescription: string | null;
  canonicalAddress: string | null;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  comments: any | null;
  avgRate: number;
}



interface ArticleCategoryStore {
  categories: ArticleCategory[];
  selectedCategory: ArticleCategory | null;
  loading: boolean;
  error: string | null;

  fetchAllCategories: () => Promise<void>;
  fetchCategoryByName: (catgName: string) => Promise<void>;
  clearSelectedCategory: () => void;
}

export const useArticleCategoryStore = create<ArticleCategoryStore>((set) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  fetchAllCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllArticleCategories();
      set({ categories: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchCategoryByName: async (catgName: string) => {
    set({ loading: true, error: null });
    try {
      const data = await getArticleCategoriesByName(catgName);
      set({ selectedCategory: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearSelectedCategory: () => set({ selectedCategory: null }),
}));
