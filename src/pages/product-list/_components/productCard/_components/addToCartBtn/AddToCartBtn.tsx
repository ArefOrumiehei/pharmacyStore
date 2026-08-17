import { useCallback, useMemo, useState } from "react";
import { IconLoader2, IconMinus, IconPlus, IconShoppingCartPlus, IconTrash } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import type { MiniAddToCartControlProps } from "@/pages/home/_components/products-carousel/_components/productCard/_components/interfaces/ProductCardInterfaces";

export default function AddToCartBtn({ product }: MiniAddToCartControlProps) {
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
            });
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

    if (!product.isInStock) {
        return (
            <span className="flex items-center justify-center text-[10px] sm:text-xs font-semibold px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-gray-100 text-gray-400 flex-shrink-0 whitespace-nowrap">
                ناموجود
            </span>
        );
    }

    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={handleAdd}
                disabled={isPending}
                className="flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white shadow-sm shadow-blue-100 transition-all duration-200 active:scale-95 flex-shrink-0 whitespace-nowrap"
            >
                {isPending ? (
                    <IconLoader2 size={12} className="animate-spin sm:w-[14px] sm:h-[14px]" />
                ) : (
                    <>
                        <IconShoppingCartPlus size={12} className="sm:w-[14px] sm:h-[14px]" />
                        <span className="hidden sm:inline">سبد خرید</span>
                    </>
                )}
            </button>
        );
    }

    const isLast = qty === 1;

    return (
        <div className="flex items-center gap-0.5 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-0.5 flex-shrink-0">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={isPending}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded sm:rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex-shrink-0"
            >
                {isLast ? (
                    <IconTrash size={12} className="text-rose-500 sm:w-3.5 sm:h-3.5" />
                ) : (
                    <IconMinus size={12} className="text-blue-800 sm:w-3.5 sm:h-3.5" />
                )}
            </button>

            {isPending ? (
                <IconLoader2 size={12} className="text-blue-400 animate-spin sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            ) : (
                <span className="min-w-[18px] sm:min-w-[20px] text-center text-[10px] sm:text-xs font-bold text-blue-800 tabular-nums flex-shrink-0">
                    {toPersianDigits(qty)}
                </span>
            )}

            <button
                type="button"
                onClick={handleIncrement}
                disabled={isPending || qty >= inStockQty}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded sm:rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white flex-shrink-0"
            >
                <IconPlus size={12} className="text-blue-800 sm:w-3.5 sm:h-3.5" />
            </button>
        </div>
    );
}