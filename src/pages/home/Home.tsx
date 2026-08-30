/* eslint-disable react-hooks/exhaustive-deps */
import {
    useLatestArrivals,
    useTopRated,
    useMostViewed,
    useRandomRecommendation,
} from "@/queries/useHomeQueries";

// Stores
import { useUserStore } from "@/store/account/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

// Components
import BannerSlider from "@/pages/home/_components/banner-slider/BannerSlider";
import Categories from "./_components/categories/Categories";
import ProductsCarousel from "./_components/products-carousel/ProductsCarousel";
import LatestArticles from "./_components/latest-articles/LatestArticles";

function Home() {
    const { fetchUser } = useUserStore();
    const { accessToken } = useAuthStore();

    const { data: latestArrivals, isLoading: loadingLatest } = useLatestArrivals();
    const { data: topRated, isLoading: loadingTopRated } = useTopRated();
    const { data: mostViewed, isLoading: loadingMostViewed } = useMostViewed();
    const { data: randomRecommendation, isLoading: loadingRandom } = useRandomRecommendation();

    useEffect(() => {
        if (accessToken) fetchUser();
    }, [accessToken]);

    return (
        <div className="flex flex-col gap-6 w-full px-3 sm:px-4 py-4">
            <BannerSlider />
            <Categories />

            {/* <Banner
                items={[
                { src: "https://picsum.photos/seed/product5/800/400", alt: "تخفیف ویژه مکمل‌ها", href: "/plp?discount=1", badge: "تخفیف ویژه" },
                { src: "https://picsum.photos/seed/product8/800/400", alt: "محصولات مراقبت پوست", href: "/plp/skincare", badge: "جدید" },
                ]}
            /> */}

            <ProductsCarousel
                title="محبوب‌ترین‌ محصولات"
                products={topRated ?? []}
                loading={loadingTopRated}
                viewMoreLink="/plp?sort=Popularuty"
                variant="topRated"
            />

            <ProductsCarousel
                title="جدیدترین محصولات"
                products={latestArrivals ?? []}
                loading={loadingLatest}
                viewMoreLink="/plp?sort=Newest"
                variant="latest"
            />

            {/* <Banner
                items={[
                { src: "https://picsum.photos/seed/product2/800/400", alt: "داروهای بدون نسخه", href: "/plp/medications" },
                { src: "https://picsum.photos/seed/product7/800/400", alt: "تجهیزات پزشکی", href: "/plp/medical-equipment", badge: "پرفروش" },
                ]}
            /> */}

            <ProductsCarousel
                title="پربازدیدترین‌ها"
                products={mostViewed ?? []}
                loading={loadingMostViewed}
                viewMoreLink="/plp?sort=MostViewed"
                variant="recommended"
            />

            <ProductsCarousel
                title="پیشنهاد ویژه برای شما"
                products={randomRecommendation ?? []}
                loading={loadingRandom}
                variant="forYou"
            />

            <LatestArticles />
        </div>
    );
}

export default Home;