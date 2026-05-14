import apiInstance from "@/apis/apiInstance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GatewayPayment {
  ShippingInfoId: number | string;
  payMethod:      1;
}

export interface CardToCardPayment {
  ShippingInfoId:    number | string;
  payMethod:         2;
  cardOwnerName:     string;
  nationalCode:      string;
  paymentReceiptPic: File;
}

export type CreatePaymentRequest = GatewayPayment | CardToCardPayment;

export interface IOrderResponse {
  success:  boolean;
  message:  string;
  data: {
    orderId:        number;
    redirectUrl?:   string;
    shouldRedirect?: boolean;
  };
}

export interface ICheckoutPreview {
  totalAmount:         number;
  totalAmountDisplay:  string;
  discountAmount:      number;
  discountAmountDisplay: string;
  payAmount:           number;
  payAmountDisplay:    string;
  couponCode:          string | null;
  isValidCoupon:       boolean;
  itemsCount:          number;
}

export interface IVerifyPaymentParams {
  orderId: number;
  trackId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildOrderFormData = (data: CreatePaymentRequest): FormData => {
  const form = new FormData();
  form.append("ShippingInfoId", String(data.ShippingInfoId));
  form.append("payMethod",      String(data.payMethod));
  if (data.payMethod === 2) {
    form.append("cardOwnerName",      data.cardOwnerName);
    form.append("nationalCode",       data.nationalCode);
    form.append("paymentReceiptPic",  data.paymentReceiptPic);
  }
  return form;
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const createOrder = async (
  data: CreatePaymentRequest,
): Promise<IOrderResponse> => {
  const res = await apiInstance.post<IOrderResponse>(
    "/api/Orders/place",
    buildOrderFormData(data),
    { isFormDataRequest: true },
  );
  return res.data;
};

export const verifyPayment = async (
  params: IVerifyPaymentParams,
): Promise<void> => {
  await apiInstance.post("/api/Orders/verify-payment", params);
};

export const downloadInvoice = async (orderId: number): Promise<Blob> => {
  const res = await apiInstance.get<Blob>(
    `/api/Orders/download-invoice/${orderId}`,
    { responseType: "blob" },
  );
  return res.data;
};

export const getCheckoutPreview = async (
  coupon?: string,
): Promise<ICheckoutPreview> => {
  const url = coupon
    ? `/api/Orders/checkout-preview?coupon=${encodeURIComponent(coupon)}`
    : "/api/Orders/checkout-preview";
  const res = await apiInstance.get<{ data: ICheckoutPreview }>(url);
  return res.data.data;
};