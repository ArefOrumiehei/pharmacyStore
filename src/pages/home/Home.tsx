/* eslint-disable react-hooks/exhaustive-deps */
import BannerSlider from "@/pages/home/_components/banner-slider/BannerSlider";
import Categories from "./_components/categories/Categories";
import ProductsCarousel from "./_components/products-carousel/ProductsCarousel";
import Banner from "./_components/banner/Banner";
import { useUserStore } from "@/store/useAccountStore";
import { useProductStore } from "@/store/useProductsStore";
import { useEffect } from "react";
import Blogs from "./_components/blogs/Blogs";

function Home() {
    const { fetchUser } = useUserStore();
    const { fetchLatestArrivals, latestArrivals, loading } = useProductStore();

    useEffect(() => {
        const fetchAll = async () => {
            await fetchUser();
            await Promise.all([fetchLatestArrivals()]);
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
                        href: "/products/supplements",
                        badge: "تخفیف ویژه",
                    },
                    {
                        src: "https://picsum.photos/seed/product8/800/400",
                        alt: "محصولات مراقبت پوست",
                        href: "/products/skincare",
                        badge: "جدید",
                    },
                ]}
            />

            {/* Wonderful products */}
            <ProductsCarousel
                title="پیشنهاد شگفت‌انگیز"
                products={latestArrivals}
                loading={loading}
                viewMoreLink="/products/wonderful"
                wonderful
            />

            {/* Latest arrivals */}
            <ProductsCarousel
                title="جدیدترین محصولات"
                products={latestArrivals}
                loading={loading}
                viewMoreLink="/products/latest"
            />

            {/* Second promotional banner */}
            <Banner
                items={[
                    {
                        src: "https://picsum.photos/seed/product2/800/400",
                        alt: "داروهای بدون نسخه",
                        href: "/products/medications",
                    },
                    {
                        src: "https://picsum.photos/seed/product7/800/400",
                        alt: "تجهیزات پزشکی",
                        href: "/products/medical-equipment",
                        badge: "پرفروش",
                    },
                ]}
            />

            {/* Best sellers */}
            <ProductsCarousel
                title="پرفروش‌ترین‌ها"
                products={latestArrivals}
                loading={loading}
                viewMoreLink="/products/bestsellers"
            />

            {/* Blogs Section */}
            <Blogs />
        </div>
    );
}

export default Home;
