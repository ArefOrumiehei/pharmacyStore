import { create } from "zustand";
import { toast } from "react-toastify";
import {
    addProductToCart,
    decreaseCartItemQty,
    deleteCart,
    deleteCartItem,
    getCart,
    increaseCartItemQty,
    syncCart,
    type Cart,
    type CartItem,
    type SyncCartItem,
} from "@/services/cartServices/cartServices";

/* ──────────TYPES──────────────────── */
export type { Cart, CartItem };

export interface GuestCartItem {
    productId: number;
    productName: string;
    picture: string;
    unitPrice: number;
    qty: number;
}

type CartState = {
    cart: Cart | null;
    loading: boolean;
    syncing: boolean;
    errorMsg: string | null;
    guestCart: GuestCartItem[];

    fetchCart: (force?: boolean) => Promise<void>;
    addToCart: (productId: number, qty: number) => Promise<void>;
    increaseQty: (productId: number) => Promise<void>;
    decreaseQty: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    syncGuestCart: () => Promise<void>;

    addToGuestCart: (item: GuestCartItem) => void;
    increaseGuestQty: (productId: number) => void;
    decreaseGuestQty: (productId: number) => void;
    removeGuestItem: (productId: number) => void;
    clearGuestCart: () => void;
    loadGuestCart: () => void;
};

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const GUEST_CART_KEY  = "guest_cart";
const SERVER_CART_KEY = "server_cart";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const r = (err as { response?: { data?: { message?: string } } }).response;
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

// ── Guest cart localStorage ───────────────────────────────────────────────────

const saveGuestCart = (items: GuestCartItem[]) => {
    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch { /* localStorage unavailable */ }
};

const readGuestCart = (): GuestCartItem[] => {
    try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
    } catch {
        return [];
    }
};

// ── Server cart localStorage cache ───────────────────────────────────────────
// Written after every successful fetch — server is always source of truth.
// Used only for instant reads (e.g. cart badge count in header on first paint).

const saveServerCart = (cart: Cart) => {
    try {
        localStorage.setItem(SERVER_CART_KEY, JSON.stringify(cart));
    } catch { /* localStorage unavailable */ }
};

const clearServerCart = () => {
    try {
        localStorage.removeItem(SERVER_CART_KEY);
    } catch { /* localStorage unavailable */ }
};

export const readServerCart = (): Cart | null => {
    try {
        const raw = localStorage.getItem(SERVER_CART_KEY);
        return raw ? (JSON.parse(raw) as Cart) : null;
    } catch {
        return null;
    }
};

/* ─────────────────────────────────────────
   STORE
───────────────────────────────────────── */
export const useCartStore = create<CartState>((set, get) => ({
    // Initialize cart from localStorage cache for instant first-paint reads
    cart: readServerCart(),
    loading: false,
    syncing: false,
    errorMsg: null,
    guestCart: [],

    // ── Load guest cart from localStorage ─────────────────────────────────────
    loadGuestCart: () => {
        set({ guestCart: readGuestCart() });
    },

    // ── Fetch server cart ─────────────────────────────────────────────────────
    // Always fetches fresh data. Caches result to localStorage on success.
    fetchCart: async (force = false) => {
        if (get().cart && !force) return;
        set({ loading: true });
        try {
            const res = await getCart();
            saveServerCart(res.data);
            set({ cart: res.data, loading: false });
        } catch (err) {
            set({ loading: false, errorMsg: extractMessage(err, "خطا در دریافت سبد خرید") });
        }
    },

    // ── Sync guest cart → server then clear guest cart ────────────────────────
    syncGuestCart: async () => {
        const { guestCart, clearGuestCart, fetchCart } = get();

        if (guestCart.length === 0) {
            await fetchCart(true);
            return;
        }

        set({ syncing: true });
        try {
            const items: SyncCartItem[] = guestCart.map((i) => ({
                productId: i.productId,
                qty:       i.qty,
            }));
            await syncCart(items);
            clearGuestCart();
            await fetchCart(true);
            toast.success("سبد خرید مهمان با حساب شما ادغام شد");
        } catch (err) {
            await fetchCart(true);
            toast.error(extractMessage(err, "خطا در همگام‌سازی سبد خرید"));
        } finally {
            set({ syncing: false });
        }
    },

    // ── Server cart: add ──────────────────────────────────────────────────────
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

    // ── Server cart: increase ─────────────────────────────────────────────────
    increaseQty: async (productId) => {
        const { cart } = get();
        if (!cart) return;
        set({ cart: updateItems(cart, productId, (i) => ({ ...i, qty: i.qty + 1 })) });
        try {
            const res = await increaseCartItemQty(productId);
            await get().fetchCart(true);
            if (res.message) toast.success(res.message);
        } catch (err) {
            await get().fetchCart(true);
            toast.error(extractMessage(err, "خطا در افزایش تعداد"));
        }
    },

    // ── Server cart: decrease ─────────────────────────────────────────────────
    decreaseQty: async (productId) => {
        const { cart } = get();
        if (!cart) return;
        const item = cart.items.find((i) => i.productId === productId);
        if (!item) return;
        if (item.qty === 1) { await get().removeItem(productId); return; }
        set({ cart: updateItems(cart, productId, (i) => ({ ...i, qty: i.qty - 1 })) });
        try {
            const res = await decreaseCartItemQty(productId);
            await get().fetchCart(true);
            if (res.message) toast.success(res.message);
        } catch (err) {
            await get().fetchCart(true);
            toast.error(extractMessage(err, "خطا در کاهش تعداد"));
        }
    },

    // ── Server cart: remove ───────────────────────────────────────────────────
    removeItem: async (productId) => {
        const { cart } = get();
        if (!cart) return;
        const prevItems = cart.items;
        set({ cart: { ...cart, items: prevItems.filter((i) => i.productId !== productId) } });
        try {
            const res = await deleteCartItem(productId);
            toast.success(res.message || "محصول از سبد خرید حذف شد");
            saveServerCart({ ...cart, items: cart.items.filter((i) => i.productId !== productId) });
        } catch (err) {
            set({ cart: { ...cart, items: prevItems } });
            saveServerCart(cart);
            toast.error(extractMessage(err, "خطا در حذف محصول"));
        }
    },

    // ── Server cart: clear ────────────────────────────────────────────────────
    clearCart: async () => {
        set({ loading: true });
        try {
            const res = await deleteCart();
            clearServerCart();
            set({ cart: null, loading: false });
            toast.success(res.message || "سبد خرید پاک شد");
        } catch (err) {
            set({ loading: false });
            toast.error(extractMessage(err, "خطا در حذف سبد خرید"));
        }
    },

    // ── Guest cart: add ───────────────────────────────────────────────────────
    addToGuestCart: (newItem) => {
        const { guestCart } = get();
        const existing = guestCart.find((i) => i.productId === newItem.productId);
        const updated = existing
            ? guestCart.map((i) =>
                  i.productId === newItem.productId
                      ? { ...i, qty: i.qty + newItem.qty }
                      : i
              )
            : [...guestCart, newItem];
        saveGuestCart(updated);
        set({ guestCart: updated });
        toast.success("محصول به سبد خرید اضافه شد");
    },

    // ── Guest cart: increase ──────────────────────────────────────────────────
    increaseGuestQty: (productId) => {
        const updated = get().guestCart.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + 1 } : i
        );
        saveGuestCart(updated);
        set({ guestCart: updated });
    },

    // ── Guest cart: decrease ──────────────────────────────────────────────────
    decreaseGuestQty: (productId) => {
        const { guestCart, removeGuestItem } = get();
        const item = guestCart.find((i) => i.productId === productId);
        if (!item) return;
        if (item.qty === 1) { removeGuestItem(productId); return; }
        const updated = guestCart.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty - 1 } : i
        );
        saveGuestCart(updated);
        set({ guestCart: updated });
    },

    // ── Guest cart: remove ────────────────────────────────────────────────────
    removeGuestItem: (productId) => {
        const updated = get().guestCart.filter((i) => i.productId !== productId);
        saveGuestCart(updated);
        set({ guestCart: updated });
        toast.success("محصول از سبد خرید حذف شد");
    },

    // ── Guest cart: clear ─────────────────────────────────────────────────────
    clearGuestCart: () => {
        localStorage.removeItem(GUEST_CART_KEY);
        set({ guestCart: [] });
    },
}));