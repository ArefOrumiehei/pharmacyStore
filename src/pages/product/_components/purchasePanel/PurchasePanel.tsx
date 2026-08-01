import { memo } from "react";

// Components
import PriceDisplay from "./_components/priceDisplay/PriceDisplay";
import StockBadge from "./_components/stockBadge/StockBadge";
import AddToCartControl from "./_components/addToCartControl/AddToCartControl";
import ShippingPerks from "./_components/shippingPerks/ShippingPerks";

// Types
import type { PurchasePanelProps } from "../../types/productPageTypes";

function PurchasePanel({ isLoaded, product, displayPrice }: PurchasePanelProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-3.5 sm:p-5">
      {product?.isInStock && <PriceDisplay isLoaded={isLoaded} product={product} displayPrice={displayPrice} />}

      <div className="flex items-center justify-between flex-col gap-3 sm:gap-4 w-full h-full">
        <div className="flex flex-col items-center w-full gap-1.5 sm:gap-2">
          <StockBadge isLoaded={isLoaded} product={product} />
          {isLoaded && product?.isInStock && <ShippingPerks />}
        </div>

        {isLoaded && product ? (
          <AddToCartControl product={product} />
        ) : (
          <div className="h-11 sm:h-12 w-full bg-blue-50 animate-pulse rounded-xl" />
        )}
      </div>
    </div>
  );
}

export default memo(PurchasePanel);