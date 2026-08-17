import { Link } from "react-router";
import { IconPill } from "@tabler/icons-react";
import { formatCurrency, toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IOrderItem } from "@/services/accountServices/accountServices";

export default function OrderItemRow({ item }: { item: IOrderItem }) {
  const splitedFullSlug = item.productFullSlug.split("/");
  const catgSlug = splitedFullSlug[0] + "/" + splitedFullSlug[1] + "/" + splitedFullSlug[2];
  const productSlug = splitedFullSlug[3];

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 first:pt-0 last:pb-0">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {item.productPicture ? (
          <img
            src={`${IMAGE_BASE}/${item.productPicture}`}
            alt={item.productName}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
        ) : (
          <IconPill size={16} className="text-blue-300 sm:w-5 sm:h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
          <Link to={`/product/${encodeURIComponent(catgSlug)}/${encodeURIComponent(productSlug)}`}>
            {item.productName}
          </Link>
        </p>
        {item.discountRate !== 0 && (
          <span className="text-[10px] sm:text-xs text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
            {toPersianDigits(item.discountRate)} تخفیف
          </span>
        )}
      </div>

      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <p className="text-xs sm:text-sm font-bold text-blue-800 whitespace-nowrap">
          {formatCurrency(item.totalPriceWithDiscount, "toman", false)} ت
        </p>
        <p className="text-[10px] sm:text-xs text-gray-400 flex flex-row-reverse gap-1 whitespace-nowrap">
          <span>{toPersianDigits(item.qty)}</span>
          ×
          <span>{formatCurrency(item.unitPrice, "toman", false)}</span>
        </p>
      </div>
    </div>
  );
}