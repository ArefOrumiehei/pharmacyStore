import { Link } from "react-router";
import FavoriteCardImage from "./_components/favoriteCardImage/FavoriteCardImage";
import FavoritePriceBlock from "./_components/favoritePriceBlock/FavoritePriceBlock";
import FavoriteCardActions from "./_components/favoriteCardActions/FavoriteCardActions";

interface FavoriteItem {
  id: number;
  name: string;
  slug: string;
  categoryFullSlug: string;
  picture: string;
  price: number | string;
  priceWithDiscount?: number | string;
  hasDiscount?: boolean;
  discountRate?: number;
  isInStock?: boolean;
  inStockQty?: number;
}

interface FavoriteCardProps {
  item: FavoriteItem;
  onRemoveClick: (item: FavoriteItem) => void;
}

export default function FavoriteCard({ item, onRemoveClick }: FavoriteCardProps) {
  const inStock = item.isInStock ?? true;
  const inStockQty = item.inStockQty ?? Infinity;
  const productHref = `/product/${encodeURIComponent(item.categoryFullSlug)}/${encodeURIComponent(item.slug)}`;
  const similarHref = `/plp/${item.categoryFullSlug}`;

  return (
    <div
      className={`bg-white border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-200 flex flex-row sm:flex-col ${
        inStock ? "border-blue-100 hover:border-blue-200" : "border-gray-100"
      }`}
    >
      <FavoriteCardImage
        productHref={productHref}
        picture={item.picture}
        name={item.name}
        inStock={inStock}
        hasDiscount={item.hasDiscount}
        discountRate={item.discountRate}
      />

      <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-3 flex-1 min-w-0">
        <Link to={productHref}>
          <h3 className={`text-[12px] sm:text-sm font-semibold line-clamp-2 transition-colors ${
            inStock ? "text-gray-700 hover:text-blue-800" : "text-gray-400"
          }`}>
            {item.name}
          </h3>
        </Link>

        <FavoritePriceBlock
          inStock={inStock}
          price={item.price}
          priceWithDiscount={item.priceWithDiscount}
          hasDiscount={item.hasDiscount}
        />

        <FavoriteCardActions
          productId={item.id}
          inStock={inStock}
          inStockQty={inStockQty}
          similarHref={similarHref}
          onRemoveClick={() => onRemoveClick(item)}
        />
      </div>
    </div>
  );
}