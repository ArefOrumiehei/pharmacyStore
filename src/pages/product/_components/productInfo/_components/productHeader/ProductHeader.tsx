import ShareButton from "../shareBtn/ShareBtn";
import FavoriteBtn from "../favoriteBtn/FavoriteBtn";
import type { ProductHeaderProps } from "@/pages/product/types/productPageTypes";



export default function ProductHeader({ isLoaded, product, isFavorite }: ProductHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2 sm:gap-3">
      {isLoaded ? (
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug sm:leading-relaxed flex-1 min-w-0">
          {product?.name}
        </h1>
      ) : (
        <div className="h-5 sm:h-6 md:h-7 w-40 sm:w-52 md:w-64 bg-blue-50 animate-pulse rounded flex-1" />
      )}

      {isLoaded && product && (
        <div className="flex items-center gap-1.5 flex-col sm:flex-row sm:gap-2 flex-shrink-0">
          <ShareButton
            data={{
              title: product.name,
              text: `${product.name} را در فارماپلاس ببینید`,
              url: window.location.href,
            }}
            btnStyle="icon"
          />
          <FavoriteBtn
            productId={product.id}
            initialIsFavorite={isFavorite}
          />
        </div>
      )}
    </div>
  );
}