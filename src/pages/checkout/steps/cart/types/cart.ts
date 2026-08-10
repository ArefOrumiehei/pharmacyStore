export interface CartItem {
  cartKey?: string;
  productId: number;
  productName: string;
  picture: string;
  unitPrice: string | number;
  qty: number;
  invQty?: number;
  priceWithDiscount?: string;
  discountRate?: number;
  discountedQty?: number;
  hasDiscount?: boolean;
}