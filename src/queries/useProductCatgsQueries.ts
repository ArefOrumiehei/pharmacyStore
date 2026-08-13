import { getAllProductCategories, getProductCategoriesByName } from "@/services/categoriesServices/productCategoriesServices";
import { useQuery } from "@tanstack/react-query";


export const productCategoryKeys = {
  all: ["productCategories"] as const,
  byName: (name: string) => [...productCategoryKeys.all, name] as const,
};

export function useProductCatgsQueries() {
  return useQuery({
    queryKey: ["productCategories"],
    queryFn: getAllProductCategories,
    staleTime: 60 * 60 * 1000,
  });
}

export const useProductCategoryByName = (name: string, enabled = true) => {
  return useQuery({
    queryKey: productCategoryKeys.byName(name),
    queryFn: () => getProductCategoriesByName(name),
    enabled: enabled && !!name,
    staleTime: 30 * 60 * 1000,
  });
};