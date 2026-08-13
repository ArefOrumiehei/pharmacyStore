import { Link } from "react-router";
import type { Product } from "@/store/useProductsStore";
import ProductImage from "./_components/productImage/ProductImage";
import ProductBadges from "./_components/productBadges/ProductBadges";
import ProductRating from "./_components/productRating/ProductRating";
import ProductPrice from "./_components/productPrice/ProductPrice";
import AddToCartBtn from "./_components/addToCartBtn/AddToCartBtn";

export default function ProductCard({ product }: { product: Product }) {
    const displayPrice = product.hasDiscount ? product.priceWithDiscount : product.price;
    const inStock = product.isInStock;

    return (
        <Link
            to={`/product/${encodeURIComponent(product.categoryFullSlug)}/${encodeURIComponent(product.slug)}`}
            className={`group bg-white overflow-hidden transition-all duration-300 flex flex-row sm:flex-col rounded-xl sm:rounded-2xl ${
                inStock
                    ? "border border-blue-100 hover:shadow-md hover:border-blue-200"
                    : "border border-gray-100"
            }`}
        >
            <ProductImage
                picture={product.picture}
                alt={product.pictureAlt ?? product.name}
                inStock={inStock}
                hasDiscount={product.hasDiscount}
                discountRate={product.discountRate}
            />

            {/* Content */}
            <div className="flex flex-col gap-1.5 sm:gap-2.5 p-2.5 sm:p-4 flex-1 min-w-0 justify-between">
                <div className="flex flex-col gap-1.5 sm:gap-2.5">
                    <ProductBadges category={product.categoryName} brand={product.brand} inStock={inStock} />

                    <h3
                        className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-5 sm:leading-6 transition-colors duration-200 ${
                            inStock ? "text-gray-800 group-hover:text-blue-800" : "text-gray-400"
                        }`}
                    >
                        {product.name}
                    </h3>

                    <ProductRating rating={product.avgRate} rateCount={product.rateCount} inStock={inStock} />
                </div>

                <div
                    className={`flex items-end justify-between flex-row-reverse gap-1.5 sm:gap-2 mt-auto pt-1.5 sm:pt-2 border-t ${
                        inStock ? "border-blue-50" : "border-gray-100"
                    }`}
                >
                    {inStock && (
                        <ProductPrice price={product.price} displayPrice={displayPrice} hasDiscount={product.hasDiscount} />
                    )}

                    <AddToCartBtn product={product} />
                </div>
            </div>
        </Link>
    );
}