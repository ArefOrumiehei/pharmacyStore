import apiInstance from "@/apis/apiInstance";
import type { IOverview } from "@/types/account/account";
import type { IApiResponse } from "@/types/api";

export const getUserOverview = async (): Promise<IApiResponse<IOverview>> => {
    const res = await apiInstance.get<IApiResponse<IOverview>>("/api/Account/overview");
    return res.data;
}