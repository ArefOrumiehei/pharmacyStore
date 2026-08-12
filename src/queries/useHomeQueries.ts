import { getLatestArrivalsProduct, getMostViewedProducts, getRandomRecommendation, getTopRatedProducts } from "@/services/productServices/productServices";
import { useQuery } from "@tanstack/react-query";

const FIVE_MINUTES = 5 * 60 * 1000;
const THREE_MINUTES = 3 * 60 * 1000;

export function useLatestArrivals() {
  return useQuery({
    queryKey: ["home", "latestArrivals"],
    queryFn: getLatestArrivalsProduct,
    staleTime: FIVE_MINUTES,
  });
}

export function useTopRated() {
  return useQuery({
    queryKey: ["home", "topRated"],
    queryFn: getTopRatedProducts,
    staleTime: FIVE_MINUTES,
    refetchInterval: THREE_MINUTES,
  });
}

export function useMostViewed() {
  return useQuery({
    queryKey: ["home", "mostViewed"],
    queryFn: getMostViewedProducts,
    staleTime: FIVE_MINUTES,
  });
}

export function useRandomRecommendation() {
  return useQuery({
    queryKey: ["home", "randomRecommendation"],
    queryFn: getRandomRecommendation,
    staleTime: FIVE_MINUTES,
  });
}