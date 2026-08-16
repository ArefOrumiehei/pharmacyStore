import { Link } from "react-router";
import { toPersianNums } from "@/helpers/formaters";
import type { Product } from "@/store/useProductsStore";

// Components
import ProductCardImage from "./_components/productCardImage/ProductCardImage";
import ProductRating from "./_components/productRating/ProductRating";
import LowStockIndicator from "./_components/lowStockIndicator/LowStockIndicator";
import ProductPriceBlock from "./_components/productPriceBlock/ProductPriceBlock";
import MiniAddToCartControl from "./_components/miniAddToCartControl/MiniAddToCartControl";
import NotifyMeBtn from "./_components/notifyMeBtn/NotifyMeBtn";

type ProductCardProps = {
  productData: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  const inStock = productData.isInStock ?? true;
  const stockCount = productData.invQty ?? null;
  const isLowStock = inStock && stockCount !== null && stockCount > 0 && stockCount <= 10;

  return (
    <Link 
      to={`/product/${encodeURIComponent(productData.categoryFullSlug)}/${encodeURIComponent(productData.slug)}`} 
      className="w-[130px] xs:w-[150px] sm:w-[200px] md:w-[220px] min-h-full xs:h-[290px] sm:h-[400px] flex-shrink-0"
    >
      <div
        dir="rtl"
        className={`group relative w-full h-full flex-shrink-0 bg-white rounded-xl sm:rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 cursor-pointer
          ${inStock ? "border-blue-100 hover:shadow-lg hover:shadow-blue-100/60" : "border-gray-100 opacity-80"}`}
      >
        <ProductCardImage
          picture={productData.picture}
          pictureAlt={productData.pictureAlt}
          inStock={inStock}
          hasDiscount={productData.hasDiscount}
          discountPercent={productData.discountRate}
        />

        <div className="flex flex-col flex-1 px-2 sm:px-4 pb-2 sm:pb-4 gap-1.5 sm:gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className={`text-[10px] sm:text-sm font-bold line-clamp-2 leading-snug ${inStock ? "text-gray-800" : "text-gray-400"}`}>
              {toPersianNums(productData.name)}
            </h3>
            <span className={`text-[8px] sm:text-xs font-medium truncate ${inStock ? "text-blue-600" : "text-gray-400"}`}>
              {productData.categoryName}
            </span>
          </div>

          <ProductRating avgRate={productData.avgRate} rateCount={productData.rateCount} inStock={inStock} />

          {isLowStock && <LowStockIndicator stockCount={stockCount!} />}

          <div className="flex-1" />

          <div className="flex items-end justify-between flex-col-reverse gap-1.5">
            <div className="flex items-center justify-start self-center sm:self-start w-full">
              {inStock ? <MiniAddToCartControl product={productData} /> : <NotifyMeBtn />}
            </div>
            <div>
              <ProductPriceBlock
                inStock={inStock}
                price={productData.price}
                priceWithDiscount={productData.priceWithDiscount}
                hasDiscount={productData.hasDiscount}
              />
            </div>
          </div>
        </div>

        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
        )}
      </div>
    </Link>
  );
};

export default ProductCard;