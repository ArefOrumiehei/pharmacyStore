import apiInstance from "@/apis/apiInstance"

export const trackTicket = async (ticketCode: string) => {
  const res = await apiInstance.get(`/api/Ticket/track/${ticketCode}`)
  return res.data;
}