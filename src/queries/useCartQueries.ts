import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getCart,
  addProductToCart,
  deleteCart,
  increaseCartItemQty,
  decreaseCartItemQty,
  updateCartItemQty,
  deleteCartItem,
  syncCart,
  type Cart,
  type CartItem,
  type ICartApiResponse,
  type SyncCartItem,
} from "@/services/cartServices/cartServices";

// ─── Config ─────────────────────────────────────────────────────────────────
// Cart contents change on the user's own actions (add/remove/qty), so keep
// this short — mainly to dedupe near-simultaneous mounts, not to hold stale data.
const STALE_TIME = 15 * 1000;
const GC_TIME = 5 * 60 * 1000;

const extractMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "response" in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response;
    return r?.data?.message ?? fallback;
  }
  return fallback;
};

// ─── Query keys ─────────────────────────────────────────────────────────────
export const cartKeys = {
  all: ["cart"] as const,
  cart: () => [...cartKeys.all, "detail"] as const,
};

type QueryOpts<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;
type MutationOpts<TData, TVariables> = Omit<UseMutationOptions<TData, unknown, TVariables>, "mutationFn">;

// Loosely-typed callable used only to forward whatever extra arguments
// react-query's mutation callbacks pass — see useAccountQueries.ts for why.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => unknown;

// ─── Query ──────────────────────────────────────────────────────────────────

export const useCartQuery = (options?: QueryOpts<Cart>) =>
  useQuery({
    queryKey: cartKeys.cart(),
    queryFn: async () => (await getCart()).data,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options,
  });

// ─── Mutations ──────────────────────────────────────────────────────────────
// syncCart returns the full Cart, so its result is written straight into the
// cache with setQueryData (no extra round trip). Everything else only returns
// the single changed CartItem, so those fall back to invalidating the cart
// query, which refetches the authoritative totals.
//
// None of these toast on success by default — cart qty changes are already
// reflected by the row's own loading/quantity UI (see CartItemRow), and a
// toast on every +/- click would be noisy. addProductToCart is the one
// exception, since "added to cart" is a distinct action worth confirming.

export const useAddToCartMutation = (options?: MutationOpts<ICartApiResponse<CartItem>, { productId: number; qty: number }>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ productId, qty }: { productId: number; qty: number }) => addProductToCart(productId, qty),
    onSuccess: (res, variables, ...rest) => {
      toast.success(res.message || "محصول به سبد خرید اضافه شد");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در افزودن محصول به سبد خرید"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};

export const useIncreaseCartItemMutation = (options?: MutationOpts<ICartApiResponse<CartItem>, number>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (productId: number) => increaseCartItemQty(productId),
    onSuccess: (res, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در افزایش تعداد"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};

export const useDecreaseCartItemMutation = (options?: MutationOpts<ICartApiResponse<CartItem>, number>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (productId: number) => decreaseCartItemQty(productId),
    onSuccess: (res, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در کاهش تعداد"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};

export const useUpdateCartItemQtyMutation = (
  options?: MutationOpts<ICartApiResponse<CartItem>, { productId: number; qty: number }>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ productId, qty }: { productId: number; qty: number }) => updateCartItemQty(productId, qty),
    onSuccess: (res, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در بروزرسانی تعداد"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};

export const useDeleteCartItemMutation = (options?: MutationOpts<ICartApiResponse<null>, number>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (productId: number) => deleteCartItem(productId),
    onSuccess: (res, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در حذف محصول"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};

export const useClearCartMutation = (options?: MutationOpts<ICartApiResponse<null>, void>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: () => deleteCart(),
    onSuccess: (res, variables, ...rest) => {
      toast.success(res.message || "سبد خرید خالی شد");
      queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در خالی کردن سبد خرید"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};

// Merges the guest (localStorage) cart into the server cart — called once on
// entering the address step. Writes the returned Cart straight into the
// cache since syncCart is the one endpoint that hands back the full object.
export const useSyncCartMutation = (options?: MutationOpts<ICartApiResponse<Cart>, SyncCartItem[]>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (items: SyncCartItem[]) => syncCart(items),
    onSuccess: (res, variables, ...rest) => {
      queryClient.setQueryData(cartKeys.cart(), res.data);
      (options?.onSuccess as AnyCallback | undefined)?.(res, variables, ...rest);
    },
    onError: (err, variables, ...rest) => {
      toast.error(extractMessage(err, "خطا در همگام‌سازی سبد خرید"));
      (options?.onError as AnyCallback | undefined)?.(err, variables, ...rest);
    },
  });
};