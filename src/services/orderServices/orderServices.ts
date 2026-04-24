import apiInstance from "@/apis/apiInstance";
import type { AxiosRequestConfig } from "axios";

/* ---------------- EXTENDED AXIOS CONFIG ---------------- */
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isFormDataRequest?: boolean;
}

/* ---------------- TYPES ---------------- */
interface ReceiverInfo {
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
}

export interface GatewayPayment extends ReceiverInfo {
  payMethod: 1;
}

export interface CardToCardPayment extends ReceiverInfo {
  payMethod: 2;
  cardOwnerName: string;
  nationalCode: string;
  paymentReceiptPic: File;
}

export type CreatePaymentRequest = GatewayPayment | CardToCardPayment;

interface VerifyPaymentRequest {
  orderId: number;
  trackId: string;
}

/* ---------------- HELPERS ---------------- */
const buildOrderFormData = (data: CreatePaymentRequest): FormData => {
  const form = new FormData();

  form.append("receiverFullName", data.receiverFullName);
  form.append("receiverMobile", data.receiverMobile);
  form.append("receiverAddress", data.receiverAddress);
  form.append("receiverZipCode", data.receiverZipCode);
  form.append("payMethod", String(data.payMethod));

  if (data.payMethod === 2) {
    form.append("cardOwnerName", data.cardOwnerName);
    form.append("nationalCode", data.nationalCode);
    form.append("paymentReceiptPic", data.paymentReceiptPic);
  }

  return form;
};

/* ---------------- SERVICES ---------------- */
export const createOrder = async (data: CreatePaymentRequest) => {
  const form = buildOrderFormData(data);

  const config: CustomAxiosRequestConfig = {
    isFormDataRequest: true,
  };

  const res = await apiInstance.post("/api/Orders/place", form, config);
  return res.data;
};

export const verifyPayment = async (data: VerifyPaymentRequest) => {
  const res = await apiInstance.post("/api/Orders/verify-payment", data);
  return res.data;
};

export const downloadInvoice = async (orderId: number): Promise<Blob> => {
  const res = await apiInstance.get(`/api/Orders/download-invoice/${orderId}`, {
    responseType: "blob",
  });
  return res.data;
};