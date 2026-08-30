import { Trash2, Minus, Plus } from "lucide-react";
import { IconLoader2 } from "@tabler/icons-react";
import { formatCurrency, toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { CartItem } from "../../../../types/cart";
import { calculateLineTotal, getDiscountedQty, getRegularQty, itemHasActiveDiscount } from "../../../../utils/cart";
import { ControlBtn } from "../controlBtn/ControlBtn";
import { Link } from "react-router";

interface CartItemRowProps {
  item: CartItem;
  loading: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemRow({ item, loading, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  const hasDiscount = itemHasActiveDiscount(item);
  const discountedQty = getDiscountedQty(item);
  const regularQty = getRegularQty(item);

  const unitPriceNum = item.unitPrice;
  const discountedPriceNum = item.priceWithDiscount ?? item.unitPrice;
  const lineTotal = calculateLineTotal(item);

  const catgSlug = item.productFullSlug?.split("/").slice(0,3).join("/") ?? ""
  const productSlug = item.productFullSlug?.split("/").pop() ?? ""

  return (
    <li
      className={`flex items-center flex-col sm:flex-row gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-white border transition-all duration-200 ${
        hasDiscount ? "border-rose-100 hover:border-rose-200 hover:shadow-sm" : "border-blue-50 hover:border-blue-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <div className="relative flex-shrink-0">
          <img
            src={`${IMAGE_BASE}/${item.picture}`}
            alt={item.productName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-blue-50/50 border border-blue-50 p-1"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              {toPersianDigits(item.discountRate ?? 0)}٪
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link to={`/product/${encodeURIComponent(catgSlug)}/${encodeURIComponent(productSlug)}`}>
            <h4 className="font-semibold text-gray-800 text-sm">{item.productName}</h4>
          </Link>

          {hasDiscount ? (
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-400">قیمت واحد:</p>
              <div className="flex items-center flex-col min-[360px]:flex-row gap-2">
                <span className="text-xs text-gray-400 line-through">{formatCurrency(unitPriceNum, "toman", false)}</span>
                <span className="text-xs font-bold text-rose-600">{formatCurrency(discountedPriceNum)}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-0.5">قیمت واحد: {formatCurrency(unitPriceNum)}</p>
          )}

          {hasDiscount && regularQty > 0 && (
            <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-1.5 py-0.5 mt-1 inline-block">
              {toPersianDigits(discountedQty)} عدد با تخفیف، {toPersianDigits(regularQty)} عدد با قیمت اصلی
            </p>
          )}

          <p className={`text-xs font-semibold mt-1 ${hasDiscount ? "text-rose-600" : "text-blue-800"}`}>
            جمع: {formatCurrency(lineTotal)}
          </p>
        </div>
      </div>

      <div className="flex items-center self-end sm:self-center gap-1 bg-blue-50 border border-blue-100 rounded-xl p-1 flex-shrink-0">
        {item.qty === 1 ? (
          <ControlBtn onClick={onRemove} danger disabled={loading}>
            <Trash2 size={13} />
          </ControlBtn>
        ) : (
          <ControlBtn onClick={onDecrease} disabled={loading}>
            <Minus size={13} />
          </ControlBtn>
        )}
        {loading ? (
          <IconLoader2 size={18} className="text-blue-400 animate-spin" />
        ) : (
          <span className="min-w-[24px] sm:min-w-[28px] text-center text-sm font-bold text-blue-800">
            {toPersianDigits(item.qty)}
          </span>
        )}
        <ControlBtn onClick={onIncrease} disabled={loading} isInStock={item.qty === item.invQty}>
          <Plus size={13} />
        </ControlBtn>
      </div>
    </li>
  );
}