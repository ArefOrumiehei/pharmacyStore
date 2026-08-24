import apiInstance from "@/apis/apiInstance";
import type { IUserComments } from "@/types/account/account";
import type { IApiResponse } from "@/types/api";

export const getUserComments = async (): Promise<IApiResponse<IUserComments[]>> => {
    const res = await apiInstance.get<IApiResponse<IUserComments[]>>("/api/Account/comments");
    return res.data;
}