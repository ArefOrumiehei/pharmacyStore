/* eslint-disable react-hooks/exhaustive-deps */
import BannerSlider from "@/pages/home/_components/banner-slider/BannerSlider";
import Categories from "./_components/categories/Categories";
import ProductsCarousel from "./_components/products-carousel/ProductsCarousel";
import Banner from "./_components/banner/Banner";
import { useUserStore } from "@/store/useAccountStore";
import { useProductStore } from "@/store/useProductsStore";
import { useEffect } from "react";
import Blogs from "./_components/latest-articles/LatestArticles";
import { useAuthStore } from "@/store/useAuthStore";

function Home() {
    const { fetchUser } = useUserStore();
    const { accessToken } = useAuthStore();
    const {
        fetchLatestArrivals,
        fetchTopRated,
        fetchMostViewed,
        fetchRandomRecommendation,
        latestArrivals,
        topRated,
        mostViewed,
        randomRecommendation,
        loading,
    } = useProductStore();

    useEffect(() => {
        const fetchAll = async () => {
            const productFetches = [
                fetchLatestArrivals(),
                fetchTopRated(),
                fetchMostViewed(),
                fetchRandomRecommendation(),
            ];
            if (accessToken) {
                await Promise.all([fetchUser(), ...productFetches]);
            } else {
                await Promise.all(productFetches);
            }
        };
        fetchAll();
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full px-4 py-4">
            {/* Hero banner */}
            <BannerSlider />

            {/* Categories row */}
            <Categories />

            {/* Promotional banner */}
            <Banner
                items={[
                    {
                        src: "https://picsum.photos/seed/product5/800/400",
                        alt: "تخفیف ویژه مکمل‌ها",
                        href: "/plp?discount=1",
                        badge: "تخفیف ویژه",
                    },
                    {
                        src: "https://picsum.photos/seed/product8/800/400",
                        alt: "محصولات مراقبت پوست",
                        href: "/plp/skincare",
                        badge: "جدید",
                    },
                ]}
            />

            {/* Top rated — wonderful style */}
            <ProductsCarousel
                title="پیشنهاد شگفت‌انگیز"
                products={topRated}
                loading={loading}
                viewMoreLink="/plp?sort=rating"
                variant="topRated"
            />

            {/* Latest arrivals */}
            <ProductsCarousel
                title="جدیدترین محصولات"
                products={latestArrivals}
                loading={loading}
                viewMoreLink="/plp?sort=newest"
                variant="latest"
            />

            {/* Second promotional banner */}
            <Banner
                items={[
                    {
                        src: "https://picsum.photos/seed/product2/800/400",
                        alt: "داروهای بدون نسخه",
                        href: "/plp/medications",
                    },
                    {
                        src: "https://picsum.photos/seed/product7/800/400",
                        alt: "تجهیزات پزشکی",
                        href: "/plp/medical-equipment",
                        badge: "پرفروش",
                    },
                ]}
            />

            {/* Most viewed — recommended */}
            <ProductsCarousel
                title="پرفروش‌ترین‌ها"
                products={mostViewed}
                loading={loading}
                viewMoreLink="/plp?sort=popular"
                variant="recommended"
            />

            {/* Random recommendation — for you */}
            <ProductsCarousel
                title="پیشنهاد ویژه برای شما"
                products={randomRecommendation}
                loading={loading}
                variant="forYou"
            />

            {/* Blogs section */}
            <Blogs />
        </div>
    );
}

export default Home;
