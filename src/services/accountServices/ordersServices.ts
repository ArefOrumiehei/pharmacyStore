import apiInstance from "@/apis/apiInstance";
import type { IOrder } from "@/types/account/account";
import type { IApiResponse } from "@/types/api";

export const getUserOrders = async (): Promise<IApiResponse<IOrder[]>> => {
    const res = await apiInstance.get<IApiResponse<IOrder[]>>("/api/Account/orders");
    return res.data;
};

export const getUserOrder = async (orderId: number): Promise<IApiResponse<IOrder>> => {
    const res = await apiInstance.get<IApiResponse<IOrder>>(`/api/Account/orders/${orderId}`);
    return res.data;
};