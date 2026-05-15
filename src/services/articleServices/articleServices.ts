import apiInstance from "@/apis/apiInstance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IArticleComment {
  id:                 number;
  username:           string;
  userId:             number;
  message:            string;
  creationDate:       string;
  recordId:           number;
  type:               number;
  rate:               number;
  likeCount:          number;
  dislikeCount:       number;
  isBuyer:            boolean;
  hasEdited:          boolean;
  reply:              string | null;
  replyDate:          string | null;
  lastModifedDate:    string;
  likedByUserIds:     number[];
  dislikedByUserIds:  number[];
}

export interface IArticle {
  id:                number;
  title:             string;
  shortDescription:  string;
  body:              string;
  picture:           string;
  pictureAlt:        string;
  pictureTitle:      string;
  publishDate:       string;
  slug:              string;
  keywords:          string;
  keywordList:       string[];
  metaDescription:   string;
  canonicalAddress:  string;
  categoryId:        number;
  categoryName:      string;
  categorySlug:      string;
  comments:          IArticleComment[];
  avgRate:           number;
  avgRateStr:        string;
  commentCount:      number;
  commentCountStr:   string;
  rateCount:         number;
  rateCountStr:      string;
  viewCount:         number;
  viewsLabel:        string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const getArticleBySlugAndCatgSlug = async (
  articleSlug: string,
  catgSlug:    string,
): Promise<IArticle> => {
  const res = await apiInstance.get<IApiResponse<IArticle>>(
    `/api/Article/${catgSlug}/${articleSlug}`,
  );
  return res.data.data;
};

export const getLatestArticles = async (): Promise<IArticle[]> => {
  const res = await apiInstance.get<IApiResponse<IArticle[]>>(
    "/api/Article/latest-arrivals",
  );
  return res.data.data;
};

export const getArticleBySearch = async (query: string): Promise<IArticle[]> => {
  const res = await apiInstance.get<IApiResponse<IArticle[]>>(
    `/api/Article/search?value=${encodeURIComponent(query)}`,
  );
  return res.data.data;
};

export const getTopRatedArticles = async (): Promise<IArticle[]> => {
  const res = await apiInstance.get<IApiResponse<IArticle[]>>(
    "/api/Article/top-rated",
  );
  return res.data.data;
};

export const getMostViewedArticles = async (): Promise<IArticle[]> => {
  const res = await apiInstance.get<IApiResponse<IArticle[]>>(
    "/api/Article/most-viewed",
  );
  return res.data.data;
};