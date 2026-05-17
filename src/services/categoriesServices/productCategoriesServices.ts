import apiInstance from "@/apis/apiInstance";
import type { ProductCategory } from "@/store/useProductCategoriesStore";

export const getAllProductCategories = async (): Promise<ProductCategory[]> => {
  const res = await apiInstance.get("/api/ProductCategory");
  return res.data.data;
};

export const getProductCategoriesByName = async (
  catgName: string
): Promise<ProductCategory> => {
  const res = await apiInstance.get(`/api/ProductCategory/${catgName}`);
  return res.data.data;
};