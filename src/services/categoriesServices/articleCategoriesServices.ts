import apiInstance from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IArticleCategory {
  name:             string;
  picture:          string | null;
  pictureAlt:       string | null;
  pictureTitle:     string | null;
  description:      string | null;
  showOrder:        number;
  slug:             string;
  keywords:         string | null;
  keywordList:      string[] | null;
  metaDescription:  string | null;
  canonicalAddress: string | null;
  articlesCount:    number;
  articles:         IArticle[] | null;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const getAllArticleCategories = async (): Promise<IArticleCategory[]> => {
  const res = await apiInstance.get<IApiResponse<IArticleCategory[]>>("/api/ArticleCategory");
  return res.data.data;
};

export const getArticleCategoryBySlug = async (
  slug: string,
): Promise<IArticleCategory> => {
  const res = await apiInstance.get<IApiResponse<IArticleCategory>>(
    `/api/ArticleCategory/${slug}`,
  );
  return res.data.data;
};