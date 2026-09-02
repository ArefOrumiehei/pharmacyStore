import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { IconShoppingCartPlus, IconCheck } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";

// Components
import QuantityStepper from "../quantityStepper/QuantityStepper";

// Stores
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

// Types
import type { AddToCartControlProps } from "@/pages/product/types/productPageTypes";

export default function AddToCartControl({ product }: AddToCartControlProps) {
    const { accessToken } = useAuthStore();
    const {
        cart, guestCart,
        addToCart, addToGuestCart,
        increaseQty, decreaseQty,
        increaseGuestQty, decreaseGuestQty,
        loading,
    } = useCartStore();

    const [justAdded, setJustAdded] = useState(false);

    const inStockQty = product.invQty ?? 0;
    const isGuest = !accessToken;

    const qty = useMemo(() => {
        if (isGuest) {
            return guestCart.find((i) => i.productId === product.id)?.qty ?? 0;
        }
        return cart?.items.find((i) => i.productId === product.id)?.qty ?? 0;
    }, [isGuest, guestCart, cart, product.id]);

    const handleAdd = useCallback(async () => {
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
        } else {
            await addToCart(product.id, 1);
        }
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1200);
    }, [isGuest, product, addToCart, addToGuestCart]);

    const handleIncrement = useCallback(async () => {
        if (qty >= inStockQty) return;
        if (isGuest) increaseGuestQty(product.id);
        else await increaseQty(product.id);
    }, [qty, inStockQty, isGuest, product.id, increaseQty, increaseGuestQty]);

    const handleDecrement = useCallback(async () => {
        if (isGuest) decreaseGuestQty(product.id);
        else await decreaseQty(product.id);
    }, [isGuest, product.id, decreaseQty, decreaseGuestQty]);

    const showLowStockNote = inStockQty > 0 && inStockQty < 10 && qty === 0;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {qty === 0 ? (
                <button
                    onClick={handleAdd}
                    disabled={loading || inStockQty <= 0}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
                >
                    {justAdded ? (
                        <IconCheck size={15} className="sm:w-[17px] sm:h-[17px]" />
                    ) : (
                        <IconShoppingCartPlus size={15} className="sm:w-[17px] sm:h-[17px]" />
                    )}
                    <span className="truncate">{inStockQty <= 0 ? "ناموجود" : "افزودن به سبد خرید"}</span>
                </button>
            ) : (
                <>
                    <QuantityStepper
                        qty={qty}
                        max={inStockQty}
                        loading={loading}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                    />
                    <Link
                        to="/checkout/cart"
                        className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[12px] sm:text-xs font-semibold text-blue-800 bg-blue-50/60 hover:bg-blue-100 border border-blue-100 rounded-lg sm:rounded-xl py-2 sm:py-2.5 transition-all duration-200 active:scale-95"
                    >
                        مشاهده سبد خرید
                    </Link>
                </>
            )}

            {showLowStockNote && (
                <p className="text-[10px] sm:text-[12px] text-amber-600 text-center">
                    تنها {toPersianDigits(inStockQty)} عدد در انبار باقی مانده
                </p>
            )}
        </div>
    );
}