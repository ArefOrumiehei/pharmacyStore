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

export interface ICartApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/* ---------------- SERVICES ---------------- */

export const getCart = async (): Promise<ICartApiResponse<Cart>> => {
    const res = await apiInstance.get<ICartApiResponse<Cart>>("/api/Cart");
    return res.data;
};

export const addProductToCart = async (
    productId: number,
    qty: number
): Promise<ICartApiResponse<CartItem>> => {
    const res = await apiInstance.post<ICartApiResponse<CartItem>>(
        "/api/Cart/items",
        { ProductId: productId, qty }
    );
    return res.data;
};

export const deleteCart = async (): Promise<ICartApiResponse<null>> => {
    const res = await apiInstance.delete<ICartApiResponse<null>>(
        "/api/Cart/items"
    );
    return res.data;
};

export const increaseCartItemQty = async (
    productId: number
): Promise<ICartApiResponse<CartItem>> => {
    const res = await apiInstance.post<ICartApiResponse<CartItem>>(
        `/api/Cart/items/increase/${productId}`
    );
    return res.data;
};

export const decreaseCartItemQty = async (
    productId: number
): Promise<ICartApiResponse<CartItem>> => {
    const res = await apiInstance.post<ICartApiResponse<CartItem>>(
        `/api/Cart/items/decrease/${productId}`
    );
    return res.data;
};

export const updateCartItemQty = async (
    productId: number,
    qty: number
): Promise<ICartApiResponse<CartItem>> => {
    const res = await apiInstance.put<ICartApiResponse<CartItem>>(
        `/api/Cart/items/${productId}`,
        { qty }
    );
    return res.data;
};

export const deleteCartItem = async (
    productId: number
): Promise<ICartApiResponse<null>> => {
    const res = await apiInstance.delete<ICartApiResponse<null>>(
        `/api/Cart/items/${productId}`
    );
    return res.data;
};

export const syncCart = async (): Promise<ICartApiResponse<Cart>> => {
    const res = await apiInstance.post<ICartApiResponse<Cart>>(
        "/api/Cart/sync"
    );
    return res.data;
};
