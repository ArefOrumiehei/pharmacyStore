import { useEffect } from "react";
import {
    IconPackage,
    IconHeart,
    IconMapPin,
    IconCircleCheck,
    IconRotateClockwise,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/account/useAccountStore";
import type { StatItem } from "./_components/statsGrid/_components/statCard/StatCard";

// Components
import IncompleteProfileBanner from "./_components/incompleteProfileBanner/IncompleteProfileBanner";
import StatsGrid from "./_components/statsGrid/StatsGrid";
import StatsSkeleton from "./_components/statsGrid/_components/statsSkeleton/StatsSkeleton";
import RecentOrdersCard from "./_components/recentOrders/RecentOrdersCard";

export default function Overview() {
    const { user, overview, loading, fetchOverview } = useUserStore();

    useEffect(() => {
        fetchOverview();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const stats: StatItem[] = [
        {
            label: "کل سفارش ها",
            value: overview?.totalOrders,
            icon: IconPackage,
            link: "/profile/orders",
            color: "bg-blue-50 border-blue-100",
            iconColor: "text-blue-800",
        },
        {
            label: "تحویل داده شده",
            value: overview?.totalDeliveredOrders,
            icon: IconCircleCheck,
            link: "/profile/orders",
            color: "bg-green-50 border-green-100",
            iconColor: "text-green-600",
        },
        {
            label: "مرجوع شده",
            value: overview?.totalRefundedOrders,
            icon: IconRotateClockwise,
            link: "/profile/orders",
            color: "bg-purple-50 border-purple-100",
            iconColor: "text-purple-600",
        },
        {
            label: "علاقه مندی ها",
            value: overview?.totalFaves,
            icon: IconHeart,
            link: "/profile/favorites",
            color: "bg-rose-50 border-rose-100",
            iconColor: "text-rose-500",
        },
        {
            label: "آدرس های ذخیره شده",
            value: overview?.totalAddresses,
            icon: IconMapPin,
            link: "/profile/addresses",
            color: "bg-green-50 border-green-100",
            iconColor: "text-green-600",
        },
    ];

    return (
        <div className="flex flex-col gap-3.5 sm:gap-5" dir="rtl">
            {user && !user.isCompleted && <IncompleteProfileBanner />}

            {loading.overview ? <StatsSkeleton /> : <StatsGrid stats={stats} />}

            <RecentOrdersCard
                orders={overview?.latestOrders}
                loading={loading.overview}
            />

            {/* <PromoBanner /> */}
        </div>
    );
}
