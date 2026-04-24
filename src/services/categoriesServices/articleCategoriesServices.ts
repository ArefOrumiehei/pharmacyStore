import apiInstance from "@/apis/apiInstance"

export const getAllArticleCategories = async () => {
  const res = await apiInstance.get("/api/ArticleCategory")
  return res.data.data
}

export const getArticleCategoriesByName = async (catgName: string) => {
  const res = await apiInstance.get(`/api/ArticleCategory/${catgName}`)
  return res.data.data
}