import apiInstance from "@/apis/apiInstance";
import type { IRequestReturnParams } from "@/types/account/requests";
import type { IApiResponse } from "@/types/api";

export const requestReturn = async (data: IRequestReturnParams): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("api/Account/request-return", data);
    return res.data;
}