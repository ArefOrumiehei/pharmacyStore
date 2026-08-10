import { Link } from "react-router";
import { IconShoppingBag } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { FALLBACK_STATUS, STATUS_CONFIG } from "@/pages/profile/constants/Constants";
import type { ILatestOrder } from "@/services/accountServices/accountServices";

export default function OrderRow({ order }: { order: ILatestOrder }) {
  const s = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
  const StatusIcon = s.icon;

  return (
    <Link
      to={`/profile/orders/${order.id}`}
      className="flex items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border border-blue-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <IconShoppingBag size={13} className="text-blue-800 sm:w-4 sm:h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
            سفارش {toPersianDigits(order.id)}#
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
            {toPersianDigits(order.creationDateDisplay)} • {toPersianDigits(order.itemsCount)} محصول
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <p className="text-xs sm:text-sm font-semibold text-blue-800 hidden sm:block">
          {toPersianDigits(order.payAmountDisplay)} ت
        </p>
        <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border whitespace-nowrap ${s.class}`}>
          <StatusIcon size={10} className="sm:w-3 sm:h-3" />
          <span className="hidden min-[480px]:inline sm:text-xs md:text-md">{s.label}</span>
        </span>
      </div>
    </Link>
  );
}