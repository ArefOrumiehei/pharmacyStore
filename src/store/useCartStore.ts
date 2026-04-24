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
  error: string | null;

  fetchCart: (force?: boolean) => Promise<void>;
  addToCart: (productId: number, qty: number) => Promise<void>;
  increaseQty: (productId: number) => Promise<void>;
  decreaseQty: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

/* ---------------- HELPERS ---------------- */
const handleError = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback;

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
  error: null,

  fetchCart: async (force = false) => {
    const { cart } = get();
    if (cart && !force) return; // already loaded — skip re-fetch

    set({ loading: true, error: null });
    try {
      const data = await getCart();
      set({ cart: data, loading: false });
    } catch (err) {
      const message = handleError(err, "خطا در دریافت سبد خرید");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  addToCart: async (productId, qty) => {
    set({ loading: true, error: null });
    try {
      await addProductToCart(productId, qty);
      await get().fetchCart(true); // force refresh after mutation
      toast.success("محصول به سبد خرید اضافه شد");
    } catch (err) {
      const message = handleError(err, "خطا در افزودن محصول");
      set({ error: message, loading: false });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  increaseQty: async (productId) => {
    const { cart } = get();
    if (!cart) return;

    // Optimistic update
    set({ cart: updateItems(cart, productId, (i) => ({ ...i, qty: i.qty + 1 })) });

    try {
      await increaseCartItemQty(productId);
      await get().fetchCart(true);
    } catch (err) {
      get().fetchCart(true);
      toast.error(handleError(err, "خطا در افزایش تعداد"));
    }
  },

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
    set({ cart: updateItems(cart, productId, (i) => ({ ...i, qty: i.qty - 1 })) });

    try {
      await decreaseCartItemQty(productId);
      await get().fetchCart(true);
    } catch (err) {
      get().fetchCart(true);
      toast.error(handleError(err, "خطا در کاهش تعداد"));
    }
  },

  removeItem: async (productId) => {
    const { cart } = get();
    if (!cart) return;

    const prevItems = cart.items;

    // Optimistic update
    set({ cart: { ...cart, items: prevItems.filter((i) => i.productId !== productId) } });

    try {
      await deleteCartItem(productId);
      toast.success("محصول از سبد خرید حذف شد");
    } catch (err) {
      set({ cart: { ...cart, items: prevItems } });
      toast.error(handleError(err, "خطا در حذف محصول"));
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await deleteCart();
      set({ cart: null, loading: false });
      toast.success("سبد خرید پاک شد");
    } catch (err) {
      const message = handleError(err, "خطا در حذف سبد خرید");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },
}));