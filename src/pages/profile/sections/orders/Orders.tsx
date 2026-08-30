import { useEffect, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { useUserStore } from "@/store/account/useAccountStore";

// Types
import type { IOrder } from "@/types/account/account";

// Components
import OrderStatusFilter from "./_components/orderStatusFilter/OrderStatusFilter";
import OrderCard from "./_components/orderCard/OrderCard";
import OrderSkeleton from "./_components/orderSkeleton/OrderSkeleton";
import OrdersEmptyState from "./_components/ordersEmptyState/OrdersEmptyState";

export default function Orders() {
    const [filterStatus, setFilterStatus] = useState<string>("همه");
    const { userOrders, fetchUserOrders, loading } = useUserStore();

    useEffect(() => {
        fetchUserOrders();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const orders: IOrder[] = userOrders ?? [];

    const statuses = [
        "همه",
        ...Array.from(new Set(orders.map((o) => o.statusTitle))),
    ];
    const filtered =
        filterStatus === "همه"
            ? orders
            : orders.filter((o) => o.statusTitle === filterStatus);

    return (
        <div className="flex flex-col gap-3.5 sm:gap-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                    <h1 className="text-base sm:text-xl font-bold text-blue-800">
                        سفارش‌های من
                    </h1>
                    {!loading.orders && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                            {toPersianDigits(orders?.length)} سفارش ثبت شده
                        </p>
                    )}
                </div>
                {loading.orders && (
                    <IconLoader2
                        size={16}
                        className="text-blue-400 animate-spin sm:w-[18px] sm:h-[18px] flex-shrink-0"
                    />
                )}
            </div>

            {/* Filter tabs — only shown once loaded */}
            {!loading.orders && orders?.length > 0 && (
                <OrderStatusFilter
                    statuses={statuses}
                    activeStatus={filterStatus}
                    onChange={setFilterStatus}
                />
            )}

            {/* Content */}
            {loading.orders ? (
                <OrderSkeleton />
            ) : filtered?.length === 0 ? (
                <OrdersEmptyState filterStatus={filterStatus} />
            ) : (
                <div className="flex flex-col gap-2.5 sm:gap-3">
                    {filtered.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
