import type { CartItem } from "../types/cart";

export function itemHasActiveDiscount(item: CartItem): boolean {
  return !!item.hasDiscount && !!item.priceWithDiscount && (item.discountedQty ?? 0) > 0;
}

export function getDiscountedQty(item: CartItem): number {
  return Math.min(item.discountedQty ?? 0, item.qty);
}

export function getRegularQty(item: CartItem): number {
  return item.qty - getDiscountedQty(item);
}

/**
 * Line total: discounted units at the discounted price, the rest at full price.
 * Falls back to a plain unitPrice * qty when the item has no active discount.
 */
export function calculateLineTotal(item: CartItem): number {
  const unitPriceNum = Number(item.unitPrice);
  const discountedPriceNum = Number(item.priceWithDiscount ?? item.unitPrice);

  if (!itemHasActiveDiscount(item)) return unitPriceNum * item.qty;

  const discountedQty = getDiscountedQty(item);
  const regularQty = getRegularQty(item);
  return discountedQty * discountedPriceNum + regularQty * unitPriceNum;
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
}