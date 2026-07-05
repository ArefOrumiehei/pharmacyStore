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

export interface IApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]>;
}

// ─── Services ─────────────────────────────────────────────────────────────────
export const createTicket = async (
  params: ICreateTicketParams
): Promise<IApiResponse<ICreateTicketResponse>> => {
  const res = await apiInstance.post<IApiResponse<ICreateTicketResponse>>(
    "/api/Ticket",
    params,
    { isFormDataRequest: true }
  );
  return res.data;
};