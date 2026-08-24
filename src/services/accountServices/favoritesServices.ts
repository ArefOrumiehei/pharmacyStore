import apiInstance from "@/apis/apiInstance";
import type { IApiResponse } from "@/types/api";

export const getUserFavorites = async (): Promise<IApiResponse<unknown[]>> => {
    const res = await apiInstance.get<IApiResponse<unknown[]>>("/api/Account/favorites");
    return res.data;
};