import apiInstance from "@/apis/apiInstance";

/* ─────────────────────────────────────────
  TYPES
───────────────────────────────────────── */
export type SortOption =
  | "newest"
  | "cheapest"
  | "mostExpensive"
  | "mostPopular"
  | "mostVisited";

export interface SearchParams {
  // Core search
  query?: string;

  // Scope filters (replacing separate brand/category endpoints)
  brandSlug?: string;
  categorySlug?: string;

  // Attribute filters
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  attributes?: Record<string, string[]>;

  // Sort & pagination
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountedPrice: number | null;
  picture: string | null;
  pictureAlt: string | null;
  brand: string | null;
  categorySlug: string | null;
  inStock: boolean;
  rating: number | null;
  reviewCount: number;
}

export interface SearchMeta {
  // Brand info (populated when brandSlug is provided)
  brandName: string | null;
  brandPicture: string | null;
  brandDescription: string | null;

  // Category info (populated when categorySlug is provided)
  categoryName: string | null;
  categoryDescription: string | null;
  categoryPicture: string | null;

  // Available filters returned by the server for this result set
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

/* ─────────────────────────────────────────
   API CALL
───────────────────────────────────────── */
export const search = async (params: SearchParams): Promise<SearchResult> => {
  // Flatten attributes into repeated query params: attributes[color]=red&attributes[color]=blue
  const { attributes, ...rest } = params;

  const flatAttributes: Record<string, string[]> = {};
  if (attributes) {
    for (const [key, values] of Object.entries(attributes)) {
      flatAttributes[`attributes[${key}]`] = values;
    }
  }

  const res = await apiInstance.get("/api/search", {
    params: {
      ...rest,
      ...flatAttributes,
    },
  });

  return res.data.data;
};