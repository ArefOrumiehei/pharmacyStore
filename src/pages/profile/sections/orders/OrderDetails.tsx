import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
    IconArrowRight,
    IconPackage,
    IconTruck,
    IconCircleCheck,
    IconClockHour4,
    IconX,
    IconDownload,
    IconMapPin,
    IconUser,
    IconPhone,
    IconCalendar,
    IconReceipt,
    IconPill,
} from "@tabler/icons-react";
import { formatNumberToFa } from "@/helpers/formaters";
import { useUserStore } from "@/store/useAccountStore";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IOrder, IOrderItem } from "@/services/accountServices/accountServices";

/* ─────────────────────────────────────────
   STATUS CONFIG
   Maps order status codes → display config
───────────────────────────────────────── */
const STATUS_CONFIG: Record<number, {
    label: string;
    cardClass: string;
    badgeClass: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}> = {
    1: {
        label:      "در حال پردازش",
        cardClass:  "bg-amber-50 border-amber-200",
        badgeClass: "bg-amber-50 border-amber-200 text-amber-700",
        icon:       IconClockHour4,
    },
    2: {
        label:      "در حال ارسال",
        cardClass:  "bg-blue-50 border-blue-200",
        badgeClass: "bg-blue-50 border-blue-200 text-blue-800",
        icon:       IconTruck,
    },
    3: {
        label:      "تحویل شده",
        cardClass:  "bg-green-50 border-green-200",
        badgeClass: "bg-green-50 border-green-200 text-green-700",
        icon:       IconCircleCheck,
    },
    4: {
        label:      "لغو شده",
        cardClass:  "bg-rose-50 border-rose-200",
        badgeClass: "bg-rose-50 border-rose-200 text-rose-600",
        icon:       IconX,
    },
};

// Fallback for unknown status codes
const DEFAULT_STATUS = STATUS_CONFIG[1];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-blue-50">
                <span className="w-1 h-5 bg-blue-800 rounded-full flex-shrink-0" />
                <h2 className="text-sm font-bold text-blue-800">{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function InfoRow({
    icon: Icon, label, value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={15} className="text-blue-800" />
            </div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function OrderItemRow({ item }: { item: IOrderItem }) {
    return (
        <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            {/* Product image or fallback icon */}
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.productPicture ? (
                    <img
                        src={`${IMAGE_BASE}${item.productPicture}`}
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                    />
                ) : (
                    <IconPill size={20} className="text-blue-300" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
                {item.discountRate > 0 && (
                    <span className="text-xs text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                        {item.discountRateDisplay} تخفیف
                    </span>
                )}
            </div>

            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <p className="text-sm font-bold text-blue-800">
                    {item.totalPriceWithDiscountDisplay}
                </p>
                <p className="text-xs text-gray-400">
                    {formatNumberToFa(item.qty)} × {item.unitPriceDisplay}
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function OrderDetailSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 animate-pulse" />
                <div className="flex flex-col gap-1.5">
                    <div className="h-5 w-36 bg-blue-50 animate-pulse rounded" />
                    <div className="h-3 w-24 bg-blue-50 animate-pulse rounded" />
                </div>
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <div className="bg-white border border-blue-100 rounded-2xl p-5 space-y-3">
                        <div className="h-4 w-24 bg-blue-50 animate-pulse rounded" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 py-2">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-2/3 bg-blue-50 animate-pulse rounded" />
                                    <div className="h-3 w-1/3 bg-blue-50 animate-pulse rounded" />
                                </div>
                                <div className="h-4 w-20 bg-blue-50 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white border border-blue-100 rounded-2xl p-5 space-y-4">
                        <div className="h-4 w-28 bg-blue-50 animate-pulse rounded" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
                                    <div className="flex flex-col gap-1">
                                        <div className="h-2.5 w-16 bg-blue-50 animate-pulse rounded" />
                                        <div className="h-3.5 w-24 bg-blue-50 animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-blue-100 rounded-2xl p-5 space-y-3 h-fit">
                    <div className="h-4 w-24 bg-blue-50 animate-pulse rounded" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-3.5 w-20 bg-blue-50 animate-pulse rounded" />
                            <div className="h-3.5 w-24 bg-blue-50 animate-pulse rounded" />
                        </div>
                    ))}
                    <div className="h-px bg-blue-50" />
                    <div className="flex justify-between">
                        <div className="h-4 w-28 bg-blue-50 animate-pulse rounded" />
                        <div className="h-4 w-20 bg-blue-50 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function OrderDetail() {
    const { orderId }   = useParams<{ orderId: string }>();
    const navigate      = useNavigate();
    const { selectedOrder, loading, fetchUserOrder, clearSelectedOrder } = useUserStore();

    useEffect(() => {
        if (!orderId) return;
        fetchUserOrder(Number(orderId));
        return () => clearSelectedOrder();
    }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── Loading ── */
    if (loading.order) return <OrderDetailSkeleton />;

    /* ── Not found ── */
    if (!loading.order && !selectedOrder) {
        return (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-blue-100 py-24 gap-4 text-center" dir="rtl">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <IconPackage size={28} className="text-blue-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">سفارش مورد نظر یافت نشد</p>
                <button
                    onClick={() => navigate("/profile/orders")}
                    className="text-sm font-semibold text-blue-800 underline underline-offset-2"
                >
                    بازگشت به سفارش‌ها
                </button>
            </div>
        );
    }

    const order = selectedOrder as IOrder;
    const s     = STATUS_CONFIG[order.status] ?? DEFAULT_STATUS;
    const StatusIcon = s.icon;
    const isShipping = order.status === 2;

    return (
        <div className="flex flex-col gap-5" dir="rtl">

            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/profile/orders")}
                        className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors"
                    >
                        <IconArrowRight size={17} className="text-blue-800" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-blue-800">
                            سفارش #{formatNumberToFa(order.id)}
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <IconCalendar size={12} />
                            {order.creationDateDisplay}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${s.badgeClass}`}>
                        <StatusIcon size={13} />
                        {s.label}
                    </span>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-blue-800 bg-white hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all">
                        <IconDownload size={13} />
                        فاکتور
                    </button>
                </div>
            </div>

            {/* ── Shipping banner ── */}
            {isShipping && order.postTrackingNumber && (
                <div className={`flex items-center justify-between gap-3 border rounded-2xl px-5 py-4 flex-wrap ${s.cardClass}`}>
                    <div className="flex items-center gap-3">
                        <IconTruck size={20} className="text-blue-800 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-blue-800">مرسوله در راه است</p>
                            <p className="text-xs text-blue-600 mt-0.5">
                                کد رهگیری: {order.postTrackingNumber}
                            </p>
                        </div>
                    </div>
                    <button className="text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                        پیگیری مرسوله
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Left column ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Items */}
                    <SectionCard title={`اقلام سفارش (${formatNumberToFa(order.items.length)})`}>
                        <div className="flex flex-col divide-y divide-blue-50">
                            {order.items.map((item) => (
                                <OrderItemRow key={item.id} item={item} />
                            ))}
                        </div>
                    </SectionCard>

                    {/* Receiver */}
                    <SectionCard title="اطلاعات گیرنده و پرداخت">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow icon={IconUser}    label="نام گیرنده"   value={order.items[0]?.productName ? "—" : "—"} />
                            <InfoRow icon={IconPhone}   label="موبایل"       value="—" />
                            <InfoRow icon={IconMapPin}  label="کد پستی"      value="—" />
                            <InfoRow icon={IconReceipt} label="روش پرداخت"   value={order.paymentMethod || "—"} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-50">
                            <InfoRow icon={IconMapPin} label="آدرس تحویل" value="—" />
                        </div>
                    </SectionCard>
                </div>

                {/* ── Right column ── */}
                <div className="flex flex-col gap-5">
                    <SectionCard title="خلاصه مالی">
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>جمع اقلام</span>
                                <span className="font-medium text-gray-800">
                                    {order.totalAmountDisplay}
                                </span>
                            </div>

                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>تخفیف</span>
                                    <span className="font-medium">− {order.discountAmountDisplay}</span>
                                </div>
                            )}

                            {order.orderCouponAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>تخفیف کوپن</span>
                                    <span className="font-medium">− {order.orderCouponAmountDisplay}</span>
                                </div>
                            )}

                            <div className="h-px bg-blue-50 my-1" />

                            <div className="flex justify-between text-blue-800 font-bold text-base">
                                <span>مبلغ پرداخت شده</span>
                                <span>{order.payAmountDisplay}</span>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Coupon code if used */}
                    {order.couponCode && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                            <IconReceipt size={14} className="text-green-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">کد تخفیف اعمال شده</p>
                                <p className="text-sm font-bold text-green-700 mt-0.5">{order.couponCode}</p>
                            </div>
                        </div>
                    )}

                    {/* Quick actions */}
                    <Link
                        to="/profile/tickets/new"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 text-sm font-semibold transition-all"
                    >
                        مشکلی دارید؟ تیکت بزنید
                    </Link>
                </div>
            </div>
        </div>
    );
}