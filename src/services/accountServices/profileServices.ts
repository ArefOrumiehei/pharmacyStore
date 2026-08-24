import apiInstance from "@/apis/apiInstance";
import type { ICompleteProfileParams, IUpdateProfileParams } from "@/types/account/requests";
import { toFormData } from "../helpers/formHelpers";
import type { IUserProfile } from "@/types/account/account";
import type { IApiResponse } from "@/types/api";

const buildProfileForm = (
    data: IUpdateProfileParams | ICompleteProfileParams
): FormData =>
    toFormData({
        fullname:     data.fullname,
        username:     data.username,
        email:        data.email,
        profilePhoto: data.profilePhoto,
        ...("password"   in data ? { password:   data.password   } : {}),
        ...("repassword" in data ? { repassword: data.repassword } : {}),
    });

export const getUser = async (): Promise<IApiResponse<IUserProfile>> => {
    const res = await apiInstance.get<IApiResponse<IUserProfile>>("/api/Account/me");
    return res.data;
};

export const updateProfile = async (
    data: IUpdateProfileParams
): Promise<IApiResponse<IUserProfile>> => {
    const res = await apiInstance.post<IApiResponse<IUserProfile>>(
        "/api/Account/update-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data;
};

export const completeProfile = async (
    data: ICompleteProfileParams
): Promise<IApiResponse<IUserProfile>> => {
    const res = await apiInstance.post<IApiResponse<IUserProfile>>(
        "/api/Account/complete-profile",
        buildProfileForm(data),
        { isFormDataRequest: true }
    );
    return res.data;
};
