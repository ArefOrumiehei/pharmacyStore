import apiInstance from "@/apis/apiInstance";
import type { ITicket } from "@/types/account/account";
import type { IApiResponse } from "@/types/api";

export const getUserTickets = async (): Promise<IApiResponse<ITicket[]>> => {
    const res = await apiInstance.get<IApiResponse<ITicket[]>>("/api/Account/tickets");
    return res.data;
};

export const getTicketDetails = async (
    ticketId: string
): Promise<IApiResponse<ITicket>> => {
    const res = await apiInstance.get<IApiResponse<ITicket>>(`/api/Account/tickets/${ticketId}`);
    return res.data;
};