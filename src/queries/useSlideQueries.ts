import { useQuery } from "@tanstack/react-query";
import { getSlides } from "@/services/slide_services/slideServices";

export const slideKeys = {
    all: ["slides"] as const,
};

export const useSlidesQuery = () => {
    return useQuery({
        queryKey: slideKeys.all,
        queryFn: getSlides,
        staleTime: 1000 * 60 * 10,
    });
};