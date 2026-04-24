/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../productCard/ProductCard";
import { Link } from "react-router";
import { useProductStore } from "@/store/useProductsStore";
import { IconArrowLeft, IconFlameFilled } from "@tabler/icons-react";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

const products = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  image: `https://picsum.photos/seed/product${i}/200/200`,
  price: `${(Math.random() * 100 + 10).toFixed(2)}$`,
}));

function ProductsCarousel() {
  const {fetchLatestArrivals, latestArrivals, loading} = useProductStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    fetchLatestArrivals()
  }, [])

  const checkScrollPosition = () => {
    const slider = scrollRef.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;
    const maxScroll = scrollWidth - clientWidth;

    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft >= maxScroll - 2);
  };


  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;

    slider.dataset.isDown = "true";
    slider.dataset.startX = String(e.pageX - slider.offsetLeft);
    slider.dataset.scrollLeftStart = String(slider.scrollLeft);
  };

  const handleMouseLeave = () => {
    const slider = scrollRef.current;
    if (slider) slider.dataset.isDown = "false";
  };
  const handleMouseUp = () => {
    const slider = scrollRef.current;
    if (slider) slider.dataset.isDown = "false";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider || slider.dataset.isDown !== "true") return;

    const startX = Number(slider.dataset.startX || 0);
    const scrollLeftStart = Number(slider.dataset.scrollLeftStart || 0);
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeftStart - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 350;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition()

    return () => slider.removeEventListener("scroll", checkScrollPosition);
  }, []);

  return (
    <div className="relative w-full h-100 flex flex-col justify-center gap-4 select-none bg-blue-400/70 rounded-xl overflow-hidden">
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">محصولات پیشنهادی</h3>
        <button className="text-foreground hover:underline">مشاهده همه</button>
      </div> */}

      <div className="flex items-stretch justify-between gap-4 p-4 h-fit">
        <div className="w-min h-full flex flex-col items-center justify-between self-start flex-shrink-0">
          <div className="bg-white flex flex-col items-center gap-2 w-full h-max rounded-lg py-8">
            <IconFlameFilled size={124} className="text-primary" />
            <span className="w-min text-center text-2xl font-bold text-primary">پیشنهاد شگفت انگیز</span>
          </div>
          <div className="bg-white flex flex-col items-center w-full rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg">
            {products.length > 10 && (
              <div className="min-w-[180px] flex items-center justify-center cursor-pointer">
                <span className="flex items-center justify-center gap-2 p-2 text-foreground">
                  مشاهده بیشتر
                </span>
                <IconArrowLeft size={20} className="text-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="relative flex-2 h-[360px] pr-4 border-r-2">
          {/* Scroll Buttons */}
          {!atStart && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronRight />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex h-full gap-4 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : latestArrivals?.slice(0, 10).map((p: any) => (
                  <Link
                    key={p.id}
                    to={`/product/${encodeURIComponent(p.categoryFullSlug)}/${encodeURIComponent(p.slug)}`}
                  >
                    <ProductCard
                      productData={p}
                      onAddToCart={(id) => console.log(`Added product ${id} to cart`)}
                    />
                  </Link>
                ))}
          </div>


          {!atEnd && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronLeft />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsCarousel;
