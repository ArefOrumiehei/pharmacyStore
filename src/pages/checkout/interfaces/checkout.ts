export type CheckoutStep = 1 | 2 | 3;

export interface AddressData {
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
  shippingId?: number;
}