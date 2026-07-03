import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
    IconArrowRight,
    IconPackage,
    IconTruck,
    IconCircleCheck,
    IconX,
    IconDownload,
    IconMapPin,
    IconUser,
    IconPhone,
    IconCalendar,
    IconReceipt,
    IconPill,
    IconRotateClockwise,
    IconLoader2,
    IconAlertTriangle,
    IconLock,
    IconCreditCard,
    IconClockDollar,
    IconHomeCheck,
    IconArrowBackUp,
    IconArrowBack,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IOrder, IOrderItem } from "@/services/accountServices/accountServices";
import { toPersianDigits } from "smart-persian-tools";
import { useOrderStore } from "@/store/useOrderStore";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    number,
    {
        label: string;
        cardClass: string;
        badgeClass: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
    }
    > = {
    1: {
        label: "ثبت شده، پرداخت نشده",
        cardClass: "bg-gray-50 border-gray-200",
        badgeClass: "bg-gray-50 border-gray-200 text-gray-700",
        icon: IconReceipt,
    },

    2: {
        label: "در انتظار پرداخت درگاه",
        cardClass: "bg-yellow-50 border-yellow-200",
        badgeClass: "bg-yellow-50 border-yellow-200 text-yellow-700",
        icon: IconCreditCard,
    },

    3: {
        label: "در انتظار تایید کارت به کارت",
        cardClass: "bg-amber-50 border-amber-200",
        badgeClass: "bg-amber-50 border-amber-200 text-amber-700",
        icon: IconClockDollar,
    },

    4: {
        label: "پرداخت موفق",
        cardClass: "bg-emerald-50 border-emerald-200",
        badgeClass: "bg-emerald-50 border-emerald-200 text-emerald-700",
        icon: IconCircleCheck,
    },

    5: {
        label: "در حال آماده سازی",
        cardClass: "bg-orange-50 border-orange-200",
        badgeClass: "bg-orange-50 border-orange-200 text-orange-700",
        icon: IconPackage,
    },

    6: {
        label: "ارسال شده",
        cardClass: "bg-blue-50 border-blue-200",
        badgeClass: "bg-blue-50 border-blue-200 text-blue-800",
        icon: IconTruck,
    },

    7: {
        label: "تحویل داده شده",
        cardClass: "bg-green-50 border-green-200",
        badgeClass: "bg-green-50 border-green-200 text-green-700",
        icon: IconHomeCheck,
    },

    8: {
        label: "نیازمند بازگشت وجه",
        cardClass: "bg-purple-50 border-purple-200",
        badgeClass: "bg-purple-50 border-purple-200 text-purple-700",
        icon: IconRotateClockwise,
    },

    9: {
        label: "لغو شده",
        cardClass: "bg-rose-50 border-rose-200",
        badgeClass: "bg-rose-50 border-rose-200 text-rose-600",
        icon: IconX,
    },

    10: {
        label: "مرجوع شده",
        cardClass: "bg-red-50 border-red-200",
        badgeClass: "bg-red-50 border-red-200 text-red-700",
        icon: IconArrowBackUp,
    },

    11: {
        label: "درخواست مرجوعی",
        cardClass: "bg-indigo-50 border-indigo-200",
        badgeClass: "bg-indigo-50 border-indigo-200 text-indigo-700",
        icon: IconArrowBack,
    },
};

const DEFAULT_STATUS = STATUS_CONFIG[5];

// ─── Helper: days since a date string ──────────────────────────────

const daysSince = (dateStr: string): number => {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return 0;
    return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
};

/* ──────────── RETURN REQUEST PANEL ────────────────────────── */
function ReturnRequestPanel({ orderId, deliveredDate }: { orderId: number; deliveredDate: string }) {
    const { requestReturn, loading } = useUserStore();
    const [open,   setOpen]   = useState(false);
    const [reason, setReason] = useState("");
    const [done,   setDone]   = useState(false);

    const days    = daysSince(deliveredDate);
    const expired = days > 7;

    const handleSubmit = async () => {
        if (!reason.trim()) return;
        try {
            await requestReturn({ orderId, reason });
            setDone(true);
            setOpen(false);
        } catch {
            // toast shown by store
        }
    };

    // ── Already submitted ──
    if (done) {
        return (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <IconCircleCheck size={15} className="text-green-600 flex-shrink-0" />
                <p className="text-xs font-medium text-green-700">درخواست مرجوعی ثبت شد</p>
            </div>
        );
    }

    // ── Expired (> 7 days) ──
    if (expired) {
        return (
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <IconLock size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-semibold text-gray-500">مهلت مرجوعی پایان یافته</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {toPersianDigits(days)} روز از تحویل گذشته — مهلت مرجوعی ۷ روز است
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {/* Main button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-semibold transition-all"
                >
                    <IconRotateClockwise size={15} />
                    درخواست مرجوعی
                    <span className="text-xs font-normal text-rose-400">
                        ({toPersianDigits(7 - days)} روز مانده)
                    </span>
                </button>
            )}

            {/* Inline reason form */}
            {open && (
                <div className="flex flex-col gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                        <IconAlertTriangle size={14} className="text-rose-500 flex-shrink-0" />
                        <p className="text-xs font-semibold text-rose-700">دلیل مرجوعی را بنویسید</p>
                    </div>

                    <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="لطفاً دلیل مرجوع کردن سفارش را توضیح دهید..."
                        className="w-full border border-rose-200 bg-white rounded-xl px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none leading-7"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim() || loading.requestReturn}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all"
                        >
                            {loading.requestReturn
                                ? <IconLoader2 size={13} className="animate-spin" />
                                : <IconRotateClockwise size={13} />}
                            ثبت درخواست
                        </button>
                        <button
                            onClick={() => { setOpen(false); setReason(""); }}
                            className="px-4 py-2 rounded-xl bg-white border border-rose-100 hover:bg-white/80 text-rose-400 text-xs font-semibold transition-all"
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ────── SUB-COMPONENTS ─────────────────────────────── */
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
                        {toPersianDigits(item.discountRateDisplay)} تخفیف
                    </span>
                )}
            </div>

            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <p className="text-sm font-bold text-blue-800">
                    {toPersianDigits(item.totalPriceWithDiscountDisplay)}
                </p>
                <p className="text-xs text-gray-400 flex flex-row-reverse">
                    {toPersianDigits(item.qty)} × {toPersianDigits(item.unitPriceDisplay)}
                </p>
            </div>
        </div>
    );
}

/* ────────── SKELETON ──────────────────────── */
function OrderDetailSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 animate-pulse" />
                <div className="flex flex-col gap-1.5">
                    <div className="h-5 w-36 bg-blue-50 animate-pulse rounded" />
                    <div className="h-3 w-24 bg-blue-50 animate-pulse rounded" />
                </div>
            </div>
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

/* ──────────── MAIN PAGE ──────────────────────── */
export default function OrderDetail() {
    const { orderId }   = useParams<{ orderId: string }>();
    const navigate      = useNavigate();
    const { selectedOrder, loading, fetchUserOrder, clearSelectedOrder } = useUserStore();
    const { downloadInvoice } = useOrderStore();

    const handleDownload = async (orderId: number) => {
        await downloadInvoice(orderId);
    };

    useEffect(() => {
        if (!orderId) return;
        fetchUserOrder(Number(orderId));
        return () => clearSelectedOrder();
    }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading.order) return <OrderDetailSkeleton />;

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

    const order      = selectedOrder as IOrder;
    const s          = STATUS_CONFIG[order.status] ?? DEFAULT_STATUS;
    const StatusIcon = s.icon;
    const isShipping  = order.status === 6;
    const isDelivered = order.status === 7;

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
                            سفارش {toPersianDigits(order.id)}#
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <IconCalendar size={12} />
                            {toPersianDigits(order.creationDateDisplay)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${s.badgeClass}`}>
                        <StatusIcon size={13} />
                        {s.label}
                    </span>
                    <button onClick={() => handleDownload(order.id)} className="flex items-center gap-1.5 text-xs font-medium text-blue-800 bg-white hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all">
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
                                کد رهگیری: {toPersianDigits(order.postTrackingNumber)}
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
                    <SectionCard title={`اقلام سفارش (${toPersianDigits(order.items.length)})`}>
                        <div className="flex flex-col divide-y divide-blue-50">
                            {order.items.map((item) => (
                                <OrderItemRow key={item.id} item={item} />
                            ))}
                        </div>
                    </SectionCard>

                    {/* Receiver */}
                    <SectionCard title="اطلاعات گیرنده و پرداخت">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow icon={IconUser}    label="نام گیرنده"   value={order.receiverFullName || "—"} />
                            <InfoRow icon={IconPhone}   label="موبایل"       value={order.receiverMobile || "—"} />
                            <InfoRow icon={IconMapPin}  label="کد پستی"      value={order.receiverZipCode || "—"} />
                            <InfoRow icon={IconReceipt} label="روش پرداخت"   value={order.paymentMethod || "—"} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-50">
                            <InfoRow icon={IconMapPin} label="آدرس تحویل" value={order.receiverAddress || "—"} />
                        </div>
                    </SectionCard>
                </div>

                {/* ── left column ── */}
                <div className="flex flex-col gap-5">

                    {/* Financial summary */}
                    <SectionCard title="خلاصه مالی">
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>جمع اقلام</span>
                                <span className="font-medium text-gray-800">{toPersianDigits(order.totalAmountDisplay)}</span>
                            </div>

                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>تخفیف</span>
                                    <span className="font-medium">{toPersianDigits(order.discountAmountDisplay)}</span>
                                </div>
                            )}

                            {order.orderCouponAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>تخفیف کوپن</span>
                                    <span className="font-medium">{toPersianDigits(order.orderCouponAmountDisplay)}</span>
                                </div>
                            )}

                            <div className="h-px bg-blue-50 my-1" />

                            <div className="flex justify-between text-blue-800 font-bold text-base">
                                <span>مبلغ پرداخت شده</span>
                                <span>{toPersianDigits(order.payAmountDisplay)}</span>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Coupon code */}
                    {order.couponCode && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                            <IconReceipt size={14} className="text-green-600 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">کد تخفیف اعمال شده</p>
                                <p className="text-sm font-bold text-green-700 mt-0.5">{order.couponCode}</p>
                            </div>
                        </div>
                    )}

                    {/* Return request — only for delivered orders */}
                    {isDelivered && (
                        <ReturnRequestPanel
                            orderId={order.id}
                            deliveredDate={order.lastModifiedDate}
                        />
                    )}

                    {/* Support ticket */}
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