import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toPersianDigits } from "smart-persian-tools";
import { IconUser, IconPhone, IconMapPin, IconReceipt } from "@tabler/icons-react";

// Stores
import { useUserStore } from "@/store/useAccountStore";

// Types
import type { IOrder } from "@/services/accountServices/accountServices";

// Consts
import { FALLBACK_STATUS, STATUS_CONFIG } from "@/pages/profile/constants/Constants";

// Components
import ShippingBanner from "./_components/shippingBanner/ShippingBanner";
import SectionCard from "./_components/sectionCard/SectionCard";
import InfoRow from "./_components/infoRow/InfoRow";
import OrderItemRow from "./_components/orderItemRow/OrderItemRow";
import FinancialSummaryCard from "./_components/financialSummaryCard/FinancialSummaryCard";
import CouponBanner from "./_components/couponBanner/CouponBanner";
import ReturnRequestPanel from "./_components/returnRequestPanel/ReturnRequestPanel";
import OrderNotFound from "./_components/orderNotFound/OrderNotFound";
import OrderDetailsHeader from "./_components/orderDetailsHeader/OrderDetailsHeader";
import OrderDetailsSkeleton from "./_components/orderDetailsSkeleton/OrderDetailsSkeleton";

export default function OrderDetails() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { selectedOrder, loading, fetchUserOrder, clearSelectedOrder } = useUserStore();

    useEffect(() => {
        if (!orderId) return;
        fetchUserOrder(Number(orderId));
        return () => clearSelectedOrder();
    }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading.order) return <OrderDetailsSkeleton />;

    if (!loading.order && !selectedOrder) {
        return <OrderNotFound onBack={() => navigate("/profile/orders")} />;
    }

    const order = selectedOrder as IOrder;
    const s = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
    const isShipping = order.status === 6;
    const isDelivered = order.status === 7;
    const canDownloadInvoice = (order.status >= 4 && order.status <= 8) || order.status === 11;
    const totalQty = order?.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

    return (
        <div className="flex flex-col gap-3.5 sm:gap-5" dir="rtl">
            <OrderDetailsHeader
                order={order}
                canDownloadInvoice={canDownloadInvoice}
                onBack={() => navigate("/profile/orders")}
            />

            {isShipping && order.postTrackingNumber && (
                <ShippingBanner trackingNumber={order.postTrackingNumber} cardClass={s.class} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">

                <div className="lg:col-span-2 flex flex-col gap-3.5 sm:gap-5">
                <SectionCard title={`اقلام سفارش (${toPersianDigits(totalQty)})`}>
                    <div className="flex flex-col divide-y divide-blue-50">
                        {order.items.map((item) => (
                            <OrderItemRow key={item.id} item={item} />
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="اطلاعات گیرنده و پرداخت">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoRow icon={IconUser} label="نام گیرنده" value={order.receiverFullName || "—"} />
                        <InfoRow icon={IconPhone} label="موبایل" value={order.receiverMobile || "—"} />
                        <InfoRow icon={IconMapPin} label="کد پستی" value={order.receiverZipCode || "—"} />
                        <InfoRow icon={IconReceipt} label="روش پرداخت" value={order.paymentMethod || "—"} />
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-50">
                        <InfoRow icon={IconMapPin} label="آدرس تحویل" value={order.receiverAddress || "—"} />
                    </div>
                </SectionCard>
                </div>

                <div className="flex flex-col gap-3.5 sm:gap-5">
                    <FinancialSummaryCard order={order} />

                    {order.couponCode && <CouponBanner couponCode={order.couponCode} />}

                    {isDelivered && (
                        <ReturnRequestPanel orderId={order.id} deliveredDate={order.lastModifiedDateDisplay} />
                    )}

                    {!isDelivered && 
                        <Link
                            to="/profile/tickets/new"
                            className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 text-xs sm:text-sm font-semibold transition-all"
                        >
                            مشکلی دارید؟ تیکت بزنید
                        </Link>
                    }
                </div>
            </div>
        </div>
    );
}