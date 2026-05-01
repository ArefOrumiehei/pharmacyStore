import apiInstance from "@/apis/apiInstance"

export const getBrandProducts = async (brandName: string) => {
  const res = await apiInstance.get(`/api/Brand/${brandName}`)
  return res.data;
}