import apiInstance from "@/apis/apiInstance"

export const getProductByName = async (productName: string) => {
  const res = await apiInstance.get(`/api/Product/${productName}`)
  return res.data.data;
}

export const getLatestArrivalsProduct = async () => {
  const res = await apiInstance.get("/api/Product/latest-arrivals")
  return res.data.data;
}

export const getProductsBySearch = async (query: string) => {
  const res = await apiInstance.get(`/api/Product/search?value=${query}`)
  return res.data.data;
}

export const addProductToFavorites = async (productId: number) => {
  const res = await apiInstance.post(`/api/Product/favorite/${productId}`)
  return res.data;
}

export const removeProductFromFavorites = async (productId: number) => {
  const res = await apiInstance.delete(`/api/Product/favorite/${productId}`)
  return res.data.data;
}

export const getRandomRecommendation = async () => {
  const res = await apiInstance.get("/api/Product/random-recommendations")
  return res.data.data;
}

export const getTopRatedProducts = async () => {
  const res = await apiInstance.get("/api/Product/top-rated")
  return res.data.data;
}

export const getMostViewedProducts = async () => {
  const res = await apiInstance.get("/api/Product/most-viewed")
  return res.data.data;
}