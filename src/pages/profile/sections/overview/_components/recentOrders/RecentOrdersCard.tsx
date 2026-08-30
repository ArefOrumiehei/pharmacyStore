import { Link } from "react-router";
import { IconShoppingBag, IconChevronLeft } from "@tabler/icons-react";
import type { ILatestOrder } from "@/types/account/account";

// Components
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import OrderRow from "./_components/orderRow/OrderRow";
import OrdersSkeleton from "./_components/ordersSkeleton/OrdersSkeleton";

interface RecentOrdersCardProps {
    orders?: ILatestOrder[];
    loading: boolean;
}

export default function RecentOrdersCard({
    orders,
    loading,
}: RecentOrdersCardProps) {
    const hasOrders = !!orders?.length;

    return (
        <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
            {hasOrders && (
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <SectionTitle>سفارش‌های اخیر</SectionTitle>
                    <Link
                        to="/profile/orders"
                        className="flex items-center gap-1 text-[10px] max-[280px]:hidden sm:text-xs font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                    >
                        مشاهده همه
                        <IconChevronLeft
                            size={12}
                            className="sm:w-[13px] sm:h-[13px]"
                        />
                    </Link>
                </div>
            )}

            {loading ? (
                <OrdersSkeleton />
            ) : !hasOrders ? (
                <div className="flex flex-col items-center gap-2 py-6 sm:py-8 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center">
                        <IconShoppingBag
                            size={18}
                            className="text-blue-300 sm:w-[22px] sm:h-[22px]"
                        />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                        هنوز سفارشی ثبت نشده است
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5 sm:gap-3">
                    {orders!.map((order) => (
                        <OrderRow key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
