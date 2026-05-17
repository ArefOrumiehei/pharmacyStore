import apiInstance from "@/apis/apiInstance";
import type { Brand } from "@/store/useBrandStore";

export const getBrandByName = async (
  brandName: string,
  page = 1,
  pageSize = 12
): Promise<Brand> => {
  const res = await apiInstance.get(`/api/Brand/${brandName}`, {
    params: { page, pageSize },
  });
  return res.data.data;
};