import apiInstance from "@/apis/apiInstance";

// ─── Types ──────

export interface ICreateTicketParams {
  subject: string;
  message: string;
  email?: string;
}

export interface ICreateTicketResponse {
  trackingCode: string;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Services ─────────────────────────────────────────────────────────────────
export const createTicket = async (
  params: ICreateTicketParams
): Promise<ICreateTicketResponse> => {
  const res = await apiInstance.post<IApiResponse<ICreateTicketResponse>>(
    "/api/Ticket",
    params,
    { isFormDataRequest: true }
  );
  return res.data.data;
};