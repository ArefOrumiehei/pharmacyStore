import { memo } from "react";

// Components
import ProductHeader from "./_components/productHeader/ProductHeader";
import ProductInfoBadges from "./_components/productInfoBadges/ProductInfoBadges";
import ProductMeta from "./_components/productMeta/ProductMeta";
import SpecsLink from "./_components/specsLink/SpecsLink";

// Types
import type { ProductInfoProps } from "../../types/productPageTypes";

function ProductInfo({ isLoaded, product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl border border-blue-100 p-6">
      {isLoaded && product &&
        <ProductHeader
          isLoaded={isLoaded}
          product={product}
          isFavorite={product?.isCurrentUserFaved}
        />
      }

      <ProductInfoBadges isLoaded={isLoaded} product={product} />

      <div className="h-px bg-blue-50" />

      <ProductMeta isLoaded={isLoaded} product={product} />

      {isLoaded && product?.shortDescription && (
        <>
          <div className="h-px bg-blue-50" />
          <p className="text-xs sm:text-sm text-gray-500 leading-7">{product.shortDescription}</p>
        </>
      )}

      {isLoaded && <SpecsLink />}
    </div>
  );
}

export default memo(ProductInfo);