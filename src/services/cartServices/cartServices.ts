import apiInstance from "@/apis/apiInstance";

/* ---------------- TYPES ---------------- */
export interface CartItem {
  productId: number;
  productName: string;
  picture: string;
  unitPrice: number;
  qty: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

/* ---------------- HELPERS ---------------- */
const extract = <T>(res: { data: { data: T } }): T => res.data.data;

/* ---------------- SERVICES ---------------- */
export const getCart = async (): Promise<Cart> =>
  extract(await apiInstance.get("/api/Cart"));

export const addProductToCart = async (
  productId: number,
  qty: number
): Promise<CartItem> =>
  extract(await apiInstance.post("/api/Cart/items", { ProductId: productId, qty }));

export const deleteCart = async (): Promise<void> =>
  extract(await apiInstance.delete("/api/Cart/items"));

export const increaseCartItemQty = async (productId: number): Promise<CartItem> =>
  extract(await apiInstance.post(`/api/Cart/items/increase/${productId}`));

export const decreaseCartItemQty = async (productId: number): Promise<CartItem> =>
  extract(await apiInstance.post(`/api/Cart/items/decrease/${productId}`));

export const updateCartItemQty = async (
  productId: number,
  qty: number
): Promise<CartItem> =>
  extract(await apiInstance.put(`/api/Cart/items/${productId}`, { qty }));

export const deleteCartItem = async (productId: number): Promise<void> =>
  extract(await apiInstance.delete(`/api/Cart/items/${productId}`));

export const syncCart = async (): Promise<Cart> =>
  extract(await apiInstance.post("/api/Cart/sync"));