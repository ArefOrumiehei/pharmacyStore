import type { Product } from "@/store/useProductsStore";

export interface MiniAddToCartControlProps {
  product: Product;
}

export interface ProductCardImageProps {
  picture: string;
  pictureAlt?: string;
  inStock: boolean;
  hasDiscount?: boolean;
  discountPercent?: number;
}

export interface ProductPriceBlockProps {
  inStock: boolean;
  price: number;
  priceWithDiscount?: number;
  hasDiscount?: boolean;
}

export interface ProductRatingProps {
  avgRate: number;
  rateCount: number;
  inStock: boolean;
}