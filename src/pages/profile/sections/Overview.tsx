import { useEffect } from "react";
import {
    IconPackage,
    IconHeart,
    IconMapPin,
    IconShoppingBag,
    IconSparkles,
    IconChevronLeft,
    IconTruck,
    IconCircleCheck,
    IconX,
    IconRotateClockwise,
    IconReceipt,
    IconCreditCard,
    IconClockDollar,
    IconHomeCheck,
    IconArrowBackUp,
    IconArrowBack,
    IconArrowLeft,
    IconAlertCircle,
} from "@tabler/icons-react";
import { Link } from "react-router";
import { useUserStore } from "@/store/useAccountStore";
import { toPersianDigits } from "smart-persian-tools";

// ─── Status map (keyed by status from API) ───────────────────────────────

const STATUS_CONFIG: Record<
    number,
    {
        label: string;
        class: string;
        icon: React.ComponentType<{ className?: string; size?: number }>;
    }
    > = {
    1: {
        label: "ثبت شده، پرداخت نشده",
        class: "bg-gray-50 border-gray-100 text-gray-700",
        icon: IconReceipt,
    },

    2: {
        label: "در انتظار پرداخت درگاه",
        class: "bg-yellow-50 border-yellow-100 text-yellow-700",
        icon: IconCreditCard,
    },

    3: {
        label: "در انتظار تایید کارت به کارت",
        class: "bg-amber-50 border-amber-100 text-amber-700",
        icon: IconClockDollar,
    },

    4: {
        label: "پرداخت موفق",
        class: "bg-emerald-50 border-emerald-100 text-emerald-700",
        icon: IconCircleCheck,
    },

    5: {
        label: "در حال آماده سازی",
        class: "bg-orange-50 border-orange-100 text-orange-700",
        icon: IconPackage,
    },

    6: {
        label: "ارسال شده",
        class: "bg-blue-50 border-blue-100 text-blue-800",
        icon: IconTruck,
    },

    7: {
        label: "تحویل داده شده",
        class: "bg-green-50 border-green-100 text-green-700",
        icon: IconHomeCheck,
    },

    8: {
        label: "نیازمند بازگشت وجه",
        class: "bg-purple-50 border-purple-100 text-purple-700",
        icon: IconRotateClockwise,
    },

    9: {
        label: "لغو شده",
        class: "bg-rose-50 border-rose-100 text-rose-600",
        icon: IconX,
    },

    10: {
        label: "مرجوع شده",
        class: "bg-red-50 border-red-100 text-red-700",
        icon: IconArrowBackUp,
    },

    11: {
        label: "درخواست مرجوعی",
        class: "bg-indigo-50 border-indigo-100 text-indigo-700",
        icon: IconArrowBack,
    },
};

const FALLBACK_STATUS = STATUS_CONFIG[5];

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
            {children}
        </h2>
    );
}

// ─── Incomplete profile banner ────────────────────────────────────────────────
function IncompleteProfileBanner() {
    return (
        <Link
            to="/profile/account"
            className="group flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200"
        >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                <IconAlertCircle size={20} className="text-amber-600" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800">پروفایل شما ناقص است</p>
                <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                    برای استفاده کامل از امکانات، نام، نام کاربری و رمز عبور خود را تکمیل کنید.
                </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-200 group-hover:bg-amber-300 px-3 py-1.5 rounded-xl flex-shrink-0 transition-colors whitespace-nowrap">
                تکمیل پروفایل
                <IconArrowLeft size={13} />
            </div>
        </Link>
    );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-blue-50 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 animate-pulse" />
                    <div className="flex flex-col gap-1.5">
                        <div className="h-6 w-12 bg-blue-50 animate-pulse rounded" />
                        <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function OrdersSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
                        <div className="flex flex-col gap-1.5">
                            <div className="h-3.5 w-24 bg-blue-50 animate-pulse rounded" />
                            <div className="h-3 w-32 bg-blue-50 animate-pulse rounded" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="h-3.5 w-20 bg-blue-50 animate-pulse rounded hidden sm:block" />
                        <div className="h-6 w-24 bg-blue-50 animate-pulse rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Overview() {
    const { user, overview, loading, fetchOverview } = useUserStore();

    useEffect(() => {
        fetchOverview();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const stats = [
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
        <div className="flex flex-col gap-5" dir="rtl">
            {user && !user.isCompleted && <IncompleteProfileBanner />}

            {/* Welcome */}
            <div className="bg-white border-2 border-blue-800 rounded-2xl p-6 text-blue-800">
                <h2 className="text-xl font-bold mb-1">
                    خوش آمدید، {user?.fullname ?? user?.username ?? "کاربر"} 👋
                </h2>
                <p className="text-gray-600 text-sm leading-6">
                    از پنل کاربری خود می‌توانید سفارش‌ها، آدرس‌ها و اطلاعات حساب
                    خود را مدیریت کنید.
                </p>
            </div>

            {/* Stats */}
            {loading.overview ? (
                <StatsSkeleton />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {stats.map((stat) => (
                        <Link key={stat.label} to={stat.link}>
                            <div className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200 cursor-pointer h-full ${stat.color.split(" ")[1]}`}>
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={20} className={stat.iconColor} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {stat.value !== undefined
                                            ? toPersianDigits(stat.value)
                                            : "—"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Recent orders */}
            <div className="bg-white border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <SectionTitle>سفارش‌های اخیر</SectionTitle>
                    <Link
                        to="/profile/orders"
                        className="flex items-center gap-1 text-xs font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                    >
                        مشاهده همه
                        <IconChevronLeft size={13} />
                    </Link>
                </div>

                {loading.overview ? (
                    <OrdersSkeleton />
                ) : !overview?.latestOrders?.length ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <IconShoppingBag size={22} className="text-blue-300" />
                        </div>
                        <p className="text-sm text-gray-400">سفارشی ثبت نشده است</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {overview.latestOrders.map((order) => {
                            const s = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
                            const StatusIcon = s.icon;
                            return (
                                <Link
                                    key={order.id}
                                    to={`/profile/orders/${order.id}`}
                                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-blue-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                            <IconShoppingBag size={16} className="text-blue-800" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">
                                                سفارش {toPersianDigits(order.id)}#
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {toPersianDigits(order.creationDateDisplay)} • {toPersianDigits(order.itemsCount)} محصول
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <p className="text-sm font-semibold text-blue-800 hidden sm:block">
                                            {toPersianDigits(order.payAmountDisplay)}
                                        </p>
                                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${s.class}`}>
                                            <StatusIcon size={12} />
                                            {s.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Promo banner */}
            <div className="bg-white border border-blue-100 rounded-2xl p-6">
                <SectionTitle>پیشنهاد ویژه برای شما</SectionTitle>
                <div className="mt-4 bg-gradient-to-l from-blue-800 to-blue-600 rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <IconSparkles size={16} className="text-amber-300" />
                            <span className="text-xs font-medium text-blue-200">پیشنهاد محدود</span>
                        </div>
                        <h3 className="font-bold text-white text-base mb-1">
                            تخفیف ویژه محصولات سلامت
                        </h3>
                        <p className="text-blue-200 text-sm">
                            تا ۳۰٪ تخفیف روی محصولات منتخب بهداشت و سلامت
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="flex-shrink-0 bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
                    >
                        مشاهده محصولات
                    </Link>
                </div>
            </div>
        </div>
    );
}