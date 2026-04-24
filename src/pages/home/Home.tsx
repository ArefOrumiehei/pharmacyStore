import BannerSlider from "@/pages/home/_components/banner-slider/BannerSlider";
import Categories from "./_components/categories/Categories";
import ProductsCarousel from "./_components/products-carousel/ProductsCarousel";
import Banner from "./_components/banner/Banner";
import { useUserStore } from "@/store/useAccountStore";
import { useEffect } from "react";

function Home() {
    const { fetchUser } = useUserStore();

    useEffect(() => {
        const fetchAPI = async () => {
            await fetchUser();
        };
        fetchAPI();
    }, []);

    return (
        <div className="flex flex-col justify-center w-full">
            <BannerSlider />
            <Categories />
            <Banner
                images={[
                    "https://picsum.photos/seed/product5/200/200",
                    "https://picsum.photos/seed/product8/200/200",
                ]}
            />
            <ProductsCarousel />
            <Banner
                images={[
                    "https://picsum.photos/seed/product2/200/200",
                    "https://picsum.photos/seed/product7/200/200",
                ]}
            />
        </div>
    );
}

export default Home;
