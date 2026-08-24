import apiInstance from "@/apis/apiInstance";
import type { IChangeMobileRequestParams, IChangeMobileVerifyParams } from "@/types/account/requests";
import type { IApiResponse } from "@/types/api";

export const changeMobileReqOTP = async (
    data: IChangeMobileRequestParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("/api/Account/change-mobile/request", data);
    return res.data;
};

export const changeMobileVerify = async (
    data: IChangeMobileVerifyParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("/api/Account/change-mobile/verify", data);
    return res.data;
};