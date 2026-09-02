import { useCallback, useMemo, useState } from "react";
import { IconShoppingCartPlus, IconMinus, IconPlus, IconLoader2, IconTrash } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { MiniAddToCartControlProps } from "../interfaces/ProductCardInterfaces";

export default function MiniAddToCartControl({ product }: MiniAddToCartControlProps) {
  const { accessToken } = useAuthStore();
  const {
    cart, guestCart,
    addToCart, addToGuestCart,
    increaseQty, decreaseQty,
    increaseGuestQty, decreaseGuestQty,
  } = useCartStore();

  const [isPending, setIsPending] = useState(false);

  const inStockQty = product.invQty ?? 0;
  const isGuest = !accessToken;

  const qty = useMemo(() => {
    if (isGuest) return guestCart.find((i) => i.productId === product.id)?.qty ?? 0;
    return cart?.items.find((i) => i.productId === product.id)?.qty ?? 0;
  }, [isGuest, guestCart, cart, product.id]);

  const handleAdd = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGuest) {
      addToGuestCart({
        productId:         product.id,
        productName:       product.name,
        picture:           product.picture,
        unitPrice:         product.price,
        priceWithDiscount: product.priceWithDiscount,
        qty:               1,
        hasDiscount:       product.hasDiscount,
        invQty:            product.invQty,
        discountRate:      product.discountRate,
        discountedQty:     product.discountedQty
      });

      return;
    } 
    setIsPending(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setIsPending(false);
    }
  }, [isGuest, product, addToCart, addToGuestCart]);

  const handleIncrement = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty >= inStockQty) return;
    if (isGuest) {
      increaseGuestQty(product.id);
      return;
    }
    setIsPending(true);
    try {
      await increaseQty(product.id);
    } finally {
      setIsPending(false);
    }
  }, [qty, inStockQty, isGuest, product.id, increaseQty, increaseGuestQty]);

  const handleDecrement = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGuest) {
      decreaseGuestQty(product.id);
      return;
    }
    setIsPending(true);
    try {
      await decreaseQty(product.id);
    } finally {
      setIsPending(false);
    }
  }, [isGuest, product.id, decreaseQty, decreaseGuestQty]);

  if (qty === 0) {
    return (
      <button
        onClick={handleAdd}
        disabled={isPending}
        className="w-full h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center flex-shrink-0 transition-colors duration-150 active:scale-90 shadow-sm shadow-blue-200"
      >
        {isPending ? 
          <IconLoader2 size={10} className="text-blue-400 animate-spin sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          :
          <div className="flex items-center gap-1">
            <IconShoppingCartPlus size={12} className="text-white sm:w-[15px] sm:h-[15px]" />
            <span className="sm:hidden text-[8px] text-white">افزودن به سبد خرید</span>
          </div>
        }
      </button>
    );
  }

  const isLast = qty === 1;

  return (
    <div className="flex items-center gap-0 sm:gap-1.5 w-full md:w-fit bg-blue-50 border border-blue-100 rounded-md sm:rounded-xl p-0.5 flex-shrink-0">
      <button
        onClick={handleDecrement}
        disabled={isPending}
        className="flex-1 md:flex-none h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded sm:rounded-lg md:rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex-shrink-0"
      >
        {isLast ? (
          <IconTrash size={10} className="text-rose-500 sm:w-3.5 sm:h-3.5" />
        ) : (
          <IconMinus size={10} className="text-blue-800 sm:w-3.5 sm:h-3.5" />
        )}
      </button>

      {isPending ? (
        <IconLoader2 size={10} className="text-blue-400 animate-spin sm:w-3.5 sm:h-3.5 flex-shrink-0" />
      ) : (
        <span className="min-w-[13px] flex-1 md:flex-none sm:min-w-[20px] text-center text-[10px] sm:text-xs font-bold text-blue-800 tabular-nums flex-shrink-0">
          {toPersianDigits(qty)}
        </span>
      )}

      <button
        onClick={handleIncrement}
        disabled={isPending || qty >= inStockQty}
        className="flex-1 md:flex-none h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded sm:rounded-lg md:rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex-shrink-0"
      >
        <IconPlus size={10} className="text-blue-800 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
}