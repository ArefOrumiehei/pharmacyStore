import {
    IconFlameFilled,
    IconStarFilled,
    IconTrendingUp,
    IconSparkles,
    IconClockHour3,
} from "@tabler/icons-react";

// Custom Hooks
import { useHorizontalDragScroll } from "@/hooks/useHorizontalDragScroll";

// Components
import CarouselHeader from "./_components/carouselHeader/CarouselHeader";
import CarouselEmptyState from "./_components/carouselEmptyState/CarouselEmptyState";
import CarouselArrowBtn from "./_components/carouselArrowBtn/CarouselArrowBtn";
import ProductCardSkeleton from "./_components/productCard/_components/productCardSkeleton/ProductCardSkeleton";
import ProductCard from "./_components/productCard/ProductCard";

// Types
import type { CarouselVariant, ProductsCarouselProps, VariantStyle } from "./interfaces/ProductsCarouselInterfaces";


const VARIANT_STYLES: Record<CarouselVariant, VariantStyle> = {
    latest: {
        wrapper: "bg-white border border-blue-100",
        header: "text-blue-800",
        headerBg: "bg-white",
        divider: "border-blue-100",
        viewMore: "text-blue-800 hover:text-blue-600",
        arrowBtn:
            "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200",
        icon: <IconClockHour3 className="text-blue-500" />,
        emptyText: "محصول جدیدی برای نمایش وجود ندارد",
    },
    topRated: {
        wrapper: "bg-orange-50 border border-orange-200",
        header: "text-orange-600",
        headerBg: "bg-orange-50",
        divider: "border-orange-200",
        viewMore: "text-orange-600 hover:text-orange-700",
        arrowBtn:
            "bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200",
        icon: <IconFlameFilled className="text-orange-500" />,
        emptyText: "محصول برتری برای نمایش وجود ندارد",
    },
    recommended: {
        wrapper: "bg-white border border-emerald-100",
        header: "text-emerald-700",
        headerBg: "bg-white",
        divider: "border-emerald-100",
        viewMore: "text-emerald-700 hover:text-emerald-600",
        arrowBtn:
            "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
        icon: <IconTrendingUp className="text-emerald-500" />,
        emptyText: "محصول پرفروشی برای نمایش وجود ندارد",
    },
    forYou: {
        wrapper: "bg-violet-50 border border-violet-100",
        header: "text-violet-700",
        headerBg: "bg-violet-50",
        divider: "border-violet-100",
        viewMore: "text-violet-700 hover:text-violet-600",
        arrowBtn:
            "bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-200",
        icon: <IconSparkles className="text-violet-500" />,
        emptyText: "پیشنهادی برای نمایش وجود ندارد",
    },
    flashDeal: {
        wrapper:
            "bg-gradient-to-l from-rose-50 to-orange-50 border border-rose-200",
        header: "text-rose-700",
        headerBg: "bg-transparent",
        divider: "border-rose-200",
        viewMore: "text-rose-700 hover:text-rose-600",
        arrowBtn:
            "bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200",
        icon: <IconFlameFilled className="text-rose-500" />,
        emptyText: "پیشنهاد شگفت‌انگیزی برای نمایش وجود ندارد",
    },
    default: {
        wrapper: "bg-white border border-blue-100",
        header: "text-blue-800",
        headerBg: "bg-white",
        divider: "border-blue-100",
        viewMore: "text-blue-800 hover:text-blue-600",
        arrowBtn:
            "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200",
        icon: <IconStarFilled className="text-blue-400" />,
        emptyText: "محصولی برای نمایش وجود ندارد",
    },
};

const SKELETON_COUNT = 6;

function ProductsCarousel({
    title,
    products,
    loading = false,
    viewMoreLink,
    variant = "default",
    dealEndTime,
}: ProductsCarouselProps) {
    const s = VARIANT_STYLES[variant];

    const hasProducts =
        !loading && Array.isArray(products) && products.length > 0;
    const isEmpty =
        !loading && (!Array.isArray(products) || products.length === 0);

    const { scrollRef, atStart, atEnd, scrollBy, dragHandlers } =
        useHorizontalDragScroll<HTMLDivElement>([products]);

    if (isEmpty) {
        return null;
    }
        
    return (
        <div
            className={`relative w-full rounded-lg sm:rounded-xl overflow-hidden ${s.wrapper}`}
        >
            <CarouselHeader
                title={title}
                icon={s.icon}
                headerClass={s.header}
                headerBgClass={s.headerBg}
                dividerClass={s.divider}
                viewMoreClass={s.viewMore}
                viewMoreLink={viewMoreLink}
                showViewMore={hasProducts && products.length >= 6}
                dealEndTime={dealEndTime}
            />

            <div className="relative px-2.5 sm:px-4 py-2.5 sm:py-4">
                {loading && (
                    <div className="flex gap-2.5 sm:gap-4 overflow-hidden">
                        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {isEmpty && <CarouselEmptyState text={s.emptyText} />}

                {hasProducts && (
                    <>
                        {!atEnd && (
                            <CarouselArrowBtn
                                direction="left"
                                onClick={() => scrollBy("left")}
                                className={s.arrowBtn}
                            />
                        )}

                        <div
                            ref={scrollRef}
                            dir="rtl"
                            className="flex gap-2.5 sm:gap-4 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar"
                            {...dragHandlers}
                        >
                            {products!.map((p) => (
                                <ProductCard productData={p} key={p.id} />
                            ))}
                        </div>

                        {!atStart && (
                            <CarouselArrowBtn
                                direction="right"
                                onClick={() => scrollBy("right")}
                                className={s.arrowBtn}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductsCarousel;