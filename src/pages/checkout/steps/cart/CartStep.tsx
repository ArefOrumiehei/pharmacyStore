import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Stores
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

import type { CartItem } from "./types/cart";
import { calculateCartTotal } from "./utils/cart";

// Components
import { CartItemsPanel } from "./_components/cartItemsPanel/CartItemsPanel";
import { CartSummaryPanel } from "./_components/cartSummaryPanel/CartSummaryPanel";

export default function CartStep() {
    const navigate = useNavigate();
    const { accessToken } = useAuthStore();
    const isGuest = !accessToken;

    const {
        cart,
        fetchCart,
        increaseQty,
        decreaseQty,
        removeItem,
        guestCart,
        loadGuestCart,
        increaseGuestQty,
        decreaseGuestQty,
        removeGuestItem,
    } = useCartStore();

    // Only true until the very first fetch resolves — never re-triggered by
    // the internal fetchCart(true) calls that increase/decreaseQty fire.
    const [initialLoading, setInitialLoading] = useState(!isGuest);
    // Tracks exactly which row is mid-increment/decrement, so only that row shows a spinner.
    const [pendingProductId, setPendingProductId] = useState<number | null>(null);

    useEffect(() => {
        if (isGuest) {
            loadGuestCart();
            setInitialLoading(false);
        } else {
            fetchCart().finally(() => setInitialLoading(false));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Unified display items regardless of guest/auth
    const items: CartItem[] = isGuest ? guestCart : cart?.items ?? [];
    const isEmpty = !initialLoading && items.length === 0;
    const totalAmount = isGuest ? calculateCartTotal(guestCart) : cart?.totalAmount ?? 0;
    const totalQty = items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

    const handleIncrease = async (productId: number) => {
        setPendingProductId(productId);
        try {
        if (isGuest) increaseGuestQty(productId);
        else await increaseQty(productId);
        } finally {
        setPendingProductId(null);
        }
    };

    const handleDecrease = async (productId: number) => {
        setPendingProductId(productId);
        try {
        if (isGuest) decreaseGuestQty(productId);
        else await decreaseQty(productId);
        } finally {
        setPendingProductId(null);
        }
    };

    const handleRemove = async (productId: number) => {
        setPendingProductId(productId);
        try {
        if (isGuest) removeGuestItem(productId);
        else await removeItem(productId);
        } finally {
        setPendingProductId(null);
        }
    };

    const handleProceed = () => {
        if (isEmpty || initialLoading) return;
        if (isGuest) {
        navigate(`/login?redirectTo=${encodeURIComponent("/checkout/address")}`);
        } else {
        navigate("/checkout/address");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <CartItemsPanel
                items={items}
                initialLoading={initialLoading}
                isEmpty={isEmpty}
                totalQty={totalQty}
                pendingProductId={pendingProductId}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
            />

            {!isEmpty && (
                <CartSummaryPanel
                totalQty={totalQty}
                totalAmount={totalAmount}
                initialLoading={initialLoading}
                isEmpty={isEmpty}
                isGuest={isGuest}
                onProceed={handleProceed}
                />
            )}
        </div>
    );
}