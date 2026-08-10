export interface PaymentFormValues {
  cardOwnerName?: string;
  nationalCode?: string;
  paymentReceiptPic?: File;
}

export type PayMethod = 1 | 2;

/**
 * Shape of the fields from useOrderStore's `preview` that these components read.
 * Kept local (rather than importing a type from useOrderStore) since the real
 * exported type name there is unknown — swap this for the actual store type if it differs.
 */
export interface OrderPreviewSummary {
  isCouponHasValue?: boolean;
  isCouponApplied?: boolean;
  discountMessage?: string;
  totalAmount: number;
  totalDiscountAmount: number;
  shippingCost: number;
  finalPayAmount: number;
}