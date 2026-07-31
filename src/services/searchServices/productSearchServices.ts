import apiInstance from "@/apis/apiInstance";

/* ──────── TYPES ──────────────────── */

export interface SearchParams {
  searchTerm?: string;
  brand?: string;
  categoryFullSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyInStock?: boolean;
  hasDiscount?: boolean;
  attributes?: Record<string, string[]>;
  sortBy?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  categoryFullSlug: string;
  price: string;
  priceWithDiscount: string;
  discountedPrice: number | null;
  picture: string | null;
  pictureAlt: string | null;
  brand: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  inStock: boolean;
  hasDiscount: boolean;
  rating: number | null;
  reviewCount: number;
}

export interface SearchMeta {
  brandName: string | null;
  brandPicture: string | null;
  brandDescription: string | null;
  categoryName: string | null;
  categoryDescription: string | null;
  categoryPicture: string | null;
  availablePriceRange: { min: number; max: number } | null;
  availableAttributes: Record<string, string[]>;
}

export interface SearchResult {
  items: SearchProduct[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  meta: SearchMeta;
}

export const search = async (params: SearchParams): Promise<SearchResult> => {
  // Flatten attributes into repeated query params: attributes[color]=red&attributes[color]=blue
  const { attributes, ...rest } = params;

  const flatAttributes: Record<string, string[]> = {};
  if (attributes) {
    for (const [key, values] of Object.entries(attributes)) {
      flatAttributes[`attributes[${key}]`] = values;
    }
  }

  const res = await apiInstance.get("/api/Product/search", {
    params: {
      ...rest,
      ...flatAttributes,
    },
  });

  return res.data.data;
};