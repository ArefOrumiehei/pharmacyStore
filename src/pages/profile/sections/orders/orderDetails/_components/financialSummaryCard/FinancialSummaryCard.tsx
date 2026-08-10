import { toPersianDigits } from "smart-persian-tools";
import type { IOrder } from "@/services/accountServices/accountServices";
import SectionCard from "../sectionCard/SectionCard";

export default function FinancialSummaryCard({ order }: { order: IOrder }) {
  return (
    <SectionCard title="خلاصه مالی">
      <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm">
        <div className="flex justify-between text-gray-600">
          <span>جمع اقلام</span>
          <span className="font-medium text-gray-800">{toPersianDigits(order.totalAmountDisplay)} ت</span>
        </div>

        {order.discountAmountDisplay !== "0" && (
          <div className="flex justify-between text-green-600">
            <span>تخفیف محصولات</span>
            <span className="font-medium">{toPersianDigits(order.discountAmountDisplay)} ت</span>
          </div>
        )}

        {order.orderCouponAmountDisplay !== "0" && (
          <div className="flex justify-between text-green-600">
            <span>تخفیف کوپن</span>
            <span className="font-medium">{toPersianDigits(order.orderCouponAmountDisplay)} ت</span>
          </div>
        )}

        <div className="h-px bg-blue-50 my-1" />

        <div className="flex justify-between text-blue-800 font-bold text-sm sm:text-base">
          <span>مبلغ پرداخت شده</span>
          <span>{toPersianDigits(order.payAmountDisplay)} ت</span>
        </div>
      </div>
    </SectionCard>
  );
}