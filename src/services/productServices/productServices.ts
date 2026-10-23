import apiInstance from "@/apis/apiInstance";
import type { Product } from "@/store/useProductsStore";
import { getDeviceId } from "@/utils/deviceId";

export const getProductByName = async (productName: string): Promise<Product> => {
  const res = await apiInstance.get(`/api/Product/${productName}`, {
    headers: { "x-device-id": getDeviceId() },
  });
  return res.data.data;
};

export const getLatestArrivalsProduct = async (): Promise<Product[]> => {
  const res = await apiInstance.get("/api/Product/latest-arrivals");
  return res.data.data;
};

export const getProductsBySearch = async (query: string): Promise<Product[]> => {
  const res = await apiInstance.get(`/api/Product/search?value=${encodeURIComponent(query)}`);
  return res.data.data;
};

export const addProductToFavorites = async (productId: number): Promise<void> => {
  await apiInstance.post(`/api/Product/favorite/${productId}`);
};

export const removeProductFromFavorites = async (productId: number): Promise<void> => {
  await apiInstance.delete(`/api/Product/favorite/${productId}`);
};

export const getRandomRecommendation = async (): Promise<Product[]> => {
  const res = await apiInstance.get("/api/Product/random-recommendations");
  return res.data.data;
};

export const getTopRatedProducts = async (): Promise<Product[]> => {
  const res = await apiInstance.get("/api/Product/top-rated");
  return res.data.data;
};

export const getMostViewedProducts = async (): Promise<Product[]> => {
  const res = await apiInstance.get("/api/Product/most-viewed");
  return res.data.data;
};