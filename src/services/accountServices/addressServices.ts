import apiInstance from "@/apis/apiInstance";
import type { IAddress } from "@/types/account/account";
import type { IAddressFormParams, IEditAddressFormParams } from "@/types/account/requests";
import type { IApiResponse } from "@/types/api";

export const getAllUserAddresses = async (): Promise<IApiResponse<IAddress[]>> => {
    const res = await apiInstance.get<IApiResponse<IAddress[]>>("/api/Account/ShippingInfos");
    return res.data;
};

export const getUserAddress = async (addressId: number): Promise<IApiResponse<IAddress>> => {
    const res = await apiInstance.get<IApiResponse<IAddress>>(`/api/Account/ShippingInfos/${addressId}`);
    return res.data;
};

export const createUserAddress = async (
    data: IAddressFormParams
): Promise<IApiResponse> => {
    const res = await apiInstance.post<IApiResponse>("/api/Account/ShippingInfos", data);
    return res.data;
};

export const editUserAddress = async (
    data: IEditAddressFormParams
): Promise<IApiResponse> => {
    const res = await apiInstance.put<IApiResponse>("/api/Account/ShippingInfos", data);
    return res.data;
};

export const deleteUserAddress = async (addressId: number): Promise<IApiResponse> => {
    const res = await apiInstance.delete<IApiResponse>(`/api/Account/ShippingInfos/${addressId}`);
    return res.data;
};