import apiInstance from "@/apis/apiInstance";
import type { IChangePasswordParams, ISetPasswordParams } from "@/types/account/requests";
import type { IApiResponse } from "@/types/api";
import { toFormData } from "../helpers/formHelpers";

export const changePassword = async (
    data: IChangePasswordParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>(
        "/api/Account/change-password",
        toFormData({
            CurrentPassword: data.currentPassword,
            password:        data.password,
            rePassword:      data.rePassword,
        }),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const setPassword = async (
    data: ISetPasswordParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>(
        "/api/Account/set-password",
        toFormData({ password: data.password, rePassword: data.rePassword }),
        { isFormDataRequest: true }
    );
    return res.data;
};