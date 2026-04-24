import apiInstance from "@/apis/apiInstance"


export const getArticleBySlugAndCatgSlug = async (articleSlug: string, catgSlug: string) => {
  const res = await apiInstance.get(`/api/Article/${catgSlug}/${articleSlug}`)
  return res.data.data;
}

export const getLatesArrivalsArticle = async () => {
  const res = await apiInstance.get("/api/Article/latest-arrivals")
  return res.data.data;
}

export const getArticleBySearch = async (query: string) => {
  const res = await apiInstance.get(`/api/Article/search?value=${query}`)
  return res.data.data;
}

export const getTopRatedArticles = async () => {
  const res = await apiInstance.get("/api/Article/top-rated")
  return res.data.data;
}

export const getMostViewedArticles = async () => {
  const res = await apiInstance.get("/api/Article/most-viewed")
  return res.data.data;
}