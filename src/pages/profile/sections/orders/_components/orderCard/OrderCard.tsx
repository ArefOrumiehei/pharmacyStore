import { Link } from "react-router";
import { IconPackage } from "@tabler/icons-react";
import { formatCurrency, toPersianDigits } from "smart-persian-tools";
import type { IOrder } from "@/types/account/account";
import {
    FALLBACK_STATUS,
    STATUS_CONFIG,
} from "@/pages/profile/constants/Constants";

export default function OrderCard({ order }: { order: IOrder }) {
    const s = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
    const StatusIcon = s.icon;

    return (
        <Link
            to={`/profile/orders/${order.id}`}
            className="w-full bg-white border border-blue-100 rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200"
        >
            <div className="flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5">
                {/* Order info */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <IconPackage
                            size={16}
                            className="text-blue-800 sm:w-[18px] sm:h-[18px]"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                            سفارش {toPersianDigits(order.id)}#
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                            {toPersianDigits(order.creationDate)} •{" "}
                            {toPersianDigits(order.itemsCount)} محصول
                        </p>
                    </div>
                </div>

                {/* Price + status */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-end max-[340px]:hidden">
                        {order.discountAmount > 0 && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {formatCurrency(order.totalAmount, "toman", false)}
                            </span>
                        )}
                        <p className="text-xs sm:text-sm font-bold text-blue-800 whitespace-nowrap">
                            {formatCurrency(order.payAmount, "toman", false)} ت
                        </p>
                    </div>

                    <span
                        className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border whitespace-nowrap ${s.class}`}
                    >
                        <StatusIcon size={10} className="sm:w-3 sm:h-3" />
                        <span className="hidden min-[480px]:inline sm:text-xs md:text-md">
                            {s.label}
                        </span>
                    </span>

                    {order.postTrackingNumber && order.status === 6 && (
                        <span className="hidden sm:block text-[10px] sm:text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl whitespace-nowrap">
                            رهگیری: {toPersianDigits(order.postTrackingNumber)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
