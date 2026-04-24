import apiInstance from "@/apis/apiInstance"

export const getAllProductCategories = async() => {
  const res = await apiInstance.get("/api/ProductCategory");
  return res.data.data;
}

export const getProductCategoriesByName = async(catgName: string) => {
  const res = await apiInstance.get(`/api/ProductCategory/${catgName}`)
  return res.data.data;
}