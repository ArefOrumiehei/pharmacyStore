import apiInstance from "@/apis/apiInstance";
import type { IArticle } from "../articleServices/articleServices";

export interface ArticleSearchParams {
  value?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchArticle {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImageUrl?: string;
  categoryName?: string;
  publishedAt?: string;
  // add any other fields your /api/Article/search actually returns
}

export interface ArticleSearchMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ArticleSearchResult extends ArticleSearchMeta {
  items: IArticle[];
}

export async function searchArticles(params: ArticleSearchParams): Promise<ArticleSearchResult> {
  const res = await apiInstance.get("/api/Article/search", { params });
  const data = res.data.data;

  return {
    items: data.items,
    currentPage: data.currentPage,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    totalPages: data.totalPages,
    hasNext: data.hasNext,
    hasPrevious: data.hasPrevious,
  };
}