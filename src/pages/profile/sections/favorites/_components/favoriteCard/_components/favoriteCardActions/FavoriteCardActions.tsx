import { Link } from "react-router";
import { IconHeartOff } from "@tabler/icons-react";
import FavoriteCartControl from "../favoriteCartControl/FavoriteCartControl";

interface FavoriteCardActionsProps {
  productId: number;
  inStock: boolean;
  inStockQty: number;
  similarHref: string;
  onRemoveClick: () => void;
}

export default function FavoriteCardActions({
  productId, inStock, inStockQty, similarHref, onRemoveClick,
}: FavoriteCardActionsProps) {
  return (
    <div className="flex max-[280px]:flex-col flex-row-reverse gap-1.5 sm:gap-2 mt-auto sm:mt-0">
      {inStock ? (
        <FavoriteCartControl productId={productId} inStockQty={inStockQty} />
      ) : (
        <Link
          to={similarHref}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 active:scale-95 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-150 whitespace-nowrap"
        >
          کالاهای مشابه
        </Link>
      )}
      <button
        onClick={(e) => { e.preventDefault(); onRemoveClick(); }}
        className="flex items-center justify-center max-[280px]:w-full w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all duration-150 flex-shrink-0"
        title="حذف از علاقه‌مندی‌ها"
      >
        <IconHeartOff size={13} className="sm:w-[15px] sm:h-[15px]" />
      </button>
    </div>
  );
}