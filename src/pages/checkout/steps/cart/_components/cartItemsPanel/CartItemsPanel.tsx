import { IconShoppingCart } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { CartItem } from "../../types/cart";
import { CartSkeleton } from "./_components/cartSkeleton/CartSkeleton";
import { EmptyCart } from "./_components/emptyCart/EmptyCart";
import { CartItemRow } from "./_components/cartItemRow/CartItemRow";

interface CartItemsPanelProps {
  items: CartItem[];
  initialLoading: boolean;
  isEmpty: boolean;
  totalQty: number;
  pendingProductId: number | null;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItemsPanel({
  items,
  initialLoading,
  isEmpty,
  totalQty,
  pendingProductId,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemsPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-blue-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-blue-50">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <IconShoppingCart size={16} className="text-blue-800" />
        </div>
        <h3 className="text-base font-bold text-blue-800">سبد خرید</h3>
        {items.length > 0 && !initialLoading && (
          <span className="mr-auto text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg flex-shrink-0">
            {toPersianDigits(totalQty)} محصول
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {initialLoading ? (
          <CartSkeleton />
        ) : isEmpty ? (
          <EmptyCart />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                loading={pendingProductId === item.productId}
                onIncrease={() => onIncrease(item.productId)}
                onDecrease={() => onDecrease(item.productId)}
                onRemove={() => onRemove(item.productId)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}