export interface CartItem {
  productId: number;
  productName: string;
  picture: string;
  unitPrice: number;
  qty: number;
  invQty?: number;
  priceWithDiscount?: number;
  discountRate?: number;
  discountedQty?: number;
  hasDiscount?: boolean;
  productFullSlug?: string;
}