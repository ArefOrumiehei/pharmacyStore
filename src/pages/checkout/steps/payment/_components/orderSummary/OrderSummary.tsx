import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import { formatCurrency, toPersianDigits } from "smart-persian-tools";
import { SummaryRow } from "../../../cart/_components/cartSummaryPanel/_components/summaryRow/SummaryRow";
import type { ICheckoutPreview } from "@/services/orderServices/orderServices";

interface OrderSummaryProps {
  preview: ICheckoutPreview | null;
  loading: boolean;
  totalQty: number;
}

export function OrderSummary({ preview, loading, totalQty }: OrderSummaryProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
      <SectionTitle>خلاصه سفارش</SectionTitle>
      <div className="flex flex-col gap-2">
        <SummaryRow label="تعداد اقلام" value={preview ? `${toPersianDigits(totalQty)} محصول` : "—"} loading={loading} />
        <SummaryRow
          label="جمع محصولات"
          value={preview?.totalAmount ? `${formatCurrency(preview.totalAmount)}` : "—"}
          loading={loading}
        />
        {preview && preview.totalAutoDiscountAmount > 0 && (
          <SummaryRow label="تخفیف محصولات" value={`${formatCurrency(preview.totalAutoDiscountAmount)}`} highlight="green" loading={loading} />
        )}
        {preview && preview.orderCouponAmount > 0 && (
          <SummaryRow label={`کد تخفیف (%${toPersianDigits(preview.couponRate)})`} value={`${formatCurrency(preview.orderCouponAmount)}`} highlight="green" loading={loading} />
        )}
        <SummaryRow
          label="هزینه ارسال"
          value={preview?.shippingCost === 0 ? "رایگان" : `${formatCurrency(preview?.shippingCost ?? 0)}`}
          highlight={preview?.shippingCost === 0 ? "green" : undefined}
          loading={loading}
        />
        <div className="h-px bg-blue-50 my-1" />
        <SummaryRow label="مبلغ قابل پرداخت" value={preview ? `${formatCurrency(preview.finalPayAmount)}` : "—"} bold loading={loading} />
      </div>
    </div>
  );
}