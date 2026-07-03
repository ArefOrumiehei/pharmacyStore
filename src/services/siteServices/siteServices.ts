import apiInstance from "@/apis/apiInstance"

// ─── Types ───────────────────
export interface ITicketTitles {
  titles: ITicketSubjects[];
}

export interface ITicketSubjects {
  titleName: string;
  numberOfRow: number;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getTicketTitles = async (): Promise<ITicketTitles> => {
  const res = await apiInstance.get<IApiResponse<ITicketTitles>>("/api/site-settings/ticket-titles");
  return res.data.data;
};