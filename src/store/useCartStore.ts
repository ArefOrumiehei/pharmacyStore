import { create } from "zustand";
import { toast } from "react-toastify";
import {
    addProductToCart,
    decreaseCartItemQty,
    deleteCart,
    deleteCartItem,
    getCart,
    increaseCartItemQty,
    type Cart,
    type CartItem,
} from "@/services/cartServices/cartServices";

/* ---------------- TYPES ---------------- */
export type { Cart, CartItem };

type CartState = {
    cart: Cart | null;
    loading: boolean;

    fetchCart: (force?: boolean) => Promise<void>;
    addToCart: (productId: number, qty: number) => Promise<void>;
    increaseQty: (productId: number) => Promise<void>;
    decreaseQty: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

/* ---------------- HELPERS ---------------- */

const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const r = (err as { response?: { data?: { message?: string } } })
            .response;
        return r?.data?.message ?? fallback;
    }
    return fallback;
};

const updateItems = (
    cart: Cart,
    productId: number,
    updater: (item: CartItem) => CartItem
): Cart => ({
    ...cart,
    items: cart.items.map((item) =>
        item.productId === productId ? updater(item) : item
    ),
});

/* ---------------- STORE ---------------- */

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    loading: false,

    // ── Fetch ────────────────────────────────────────────────────────────────

    fetchCart: async (force = false) => {
        if (get().cart && !force) return;

        set({ loading: true });
        try {
            const res = await getCart();
            set({ cart: res.data, loading: false });
        } catch (err) {
            set({ loading: false });
            toast.error(extractMessage(err, "خطا در دریافت سبد خرید"));
        }
    },

    // ── Add ──────────────────────────────────────────────────────────────────

    addToCart: async (productId, qty) => {
        set({ loading: true });
        try {
            const res = await addProductToCart(productId, qty);
            await get().fetchCart(true);
            toast.success(res.message || "محصول به سبد خرید اضافه شد");
        } catch (err) {
            toast.error(extractMessage(err, "خطا در افزودن محصول"));
        } finally {
            set({ loading: false });
        }
    },

    // ── Increase ─────────────────────────────────────────────────────────────

    increaseQty: async (productId) => {
        const { cart } = get();
        if (!cart) return;

        // Optimistic update
        set({
            cart: updateItems(cart, productId, (i) => ({
                ...i,
                qty: i.qty + 1,
            })),
        });

        try {
            const res = await increaseCartItemQty(productId);
            await get().fetchCart(true);
            if (res.message) toast.success(res.message);
        } catch (err) {
            await get().fetchCart(true);
            toast.error(extractMessage(err, "خطا در افزایش تعداد"));
        }
    },

    // ── Decrease ─────────────────────────────────────────────────────────────

    decreaseQty: async (productId) => {
        const { cart } = get();
        if (!cart) return;

        const item = cart.items.find((i) => i.productId === productId);
        if (!item) return;

        if (item.qty === 1) {
            await get().removeItem(productId);
            return;
        }

        // Optimistic update
        set({
            cart: updateItems(cart, productId, (i) => ({
                ...i,
                qty: i.qty - 1,
            })),
        });

        try {
            const res = await decreaseCartItemQty(productId);
            await get().fetchCart(true);
            if (res.message) toast.success(res.message);
        } catch (err) {
            await get().fetchCart(true);
            toast.error(extractMessage(err, "خطا در کاهش تعداد"));
        }
    },

    // ── Remove item ───────────────────────────────────────────────────────────

    removeItem: async (productId) => {
        const { cart } = get();
        if (!cart) return;

        const prevItems = cart.items;

        // Optimistic update
        set({
            cart: {
                ...cart,
                items: prevItems.filter((i) => i.productId !== productId),
            },
        });

        try {
            const res = await deleteCartItem(productId);
            toast.success(res.message || "محصول از سبد خرید حذف شد");
        } catch (err) {
            set({ cart: { ...cart, items: prevItems } });
            toast.error(extractMessage(err, "خطا در حذف محصول"));
        }
    },

    // ── Clear ─────────────────────────────────────────────────────────────────

    clearCart: async () => {
        set({ loading: true });
        try {
            const res = await deleteCart();
            set({ cart: null, loading: false });
            toast.success(res.message || "سبد خرید پاک شد");
        } catch (err) {
            set({ loading: false });
            toast.error(extractMessage(err, "خطا در حذف سبد خرید"));
        }
    },
}));
