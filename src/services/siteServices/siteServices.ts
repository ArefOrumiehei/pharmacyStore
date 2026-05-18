import apiInstance from "@/apis/apiInstance"

// ─── Types ───────────────────
export interface ITicketTitle {
  titleName: string;
  numberOfRow: number;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getTicketTitles = async (): Promise<ITicketTitle[]> => {
  const res = await apiInstance.get<IApiResponse<ITicketTitle[]>>("/api/site-settings/ticket-titles");
  return res.data.data;
};