import { useCallback, useMemo, useState } from "react";
import {
  IconMinus, IconPlus, IconTrash, IconLoader2, IconShoppingCartPlus,
} from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { useCartStore } from "@/store/useCartStore";

interface FavoriteCartControlProps {
  productId: number;
  inStockQty: number;
}

export default function FavoriteCartControl({ productId, inStockQty }: FavoriteCartControlProps) {
  const { cart, addToCart, increaseQty, decreaseQty } = useCartStore();
  const [isPending, setIsPending] = useState(false);

  const qty = useMemo(() => {
    return cart?.items.find((i) => i.productId === productId)?.qty ?? 0;
  }, [cart, productId]);

  const handleAdd = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPending(true);
    try {
      await addToCart(productId, 1);
    } finally {
      setIsPending(false);
    }
  }, [productId, addToCart]);

  const handleIncrement = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty >= inStockQty) return;
    setIsPending(true);
    try {
      await increaseQty(productId);
    } finally {
      setIsPending(false);
    }
  }, [qty, inStockQty, productId, increaseQty]);

  const handleDecrement = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPending(true);
    try {
      await decreaseQty(productId);
    } finally {
      setIsPending(false);
    }
  }, [productId, decreaseQty]);

  if (qty === 0) {
    return (
      <button
        onClick={handleAdd}
        disabled={isPending}
        className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-50 active:scale-95 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-150 whitespace-nowrap"
      >
        {isPending ? (
          <IconLoader2 size={12} className="animate-spin sm:w-[14px] sm:h-[14px] flex-shrink-0" />
        ) : (
          <IconShoppingCartPlus size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
        )}
        <span className="max-[280px]:hidden">افزودن به سبد</span>
      </button>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-between gap-1 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
      <button
        onClick={handleDecrement}
        disabled={isPending}
        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded sm:rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex-shrink-0"
      >
        {qty === 1 ? (
          <IconTrash size={11} className="text-rose-500 sm:w-3.5 sm:h-3.5" />
        ) : (
          <IconMinus size={11} className="text-blue-800 sm:w-3.5 sm:h-3.5" />
        )}
      </button>

      {isPending ? (
        <IconLoader2 size={11} className="text-blue-400 animate-spin sm:w-3.5 sm:h-3.5 flex-shrink-0" />
      ) : (
        <span className="min-w-[14px] sm:min-w-[20px] text-center text-[10px] sm:text-xs font-bold text-blue-800 tabular-nums flex-shrink-0">
          {toPersianDigits(qty)}
        </span>
      )}

      <button
        onClick={handleIncrement}
        disabled={isPending || qty >= inStockQty}
        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded sm:rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex-shrink-0"
      >
        <IconPlus size={11} className="text-blue-800 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
}