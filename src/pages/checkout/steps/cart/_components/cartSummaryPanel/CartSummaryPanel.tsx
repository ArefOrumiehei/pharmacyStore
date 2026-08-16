import { ArrowLeft } from "lucide-react";
import { IconTag } from "@tabler/icons-react";
import { formatCurrency, toPersianDigits } from "smart-persian-tools";
import { SummaryRow } from "./_components/summaryRow/SummaryRow";
import NoteText from "./_components/noteText/NoteText";

interface CartSummaryPanelProps {
  totalQty: number;
  totalAmount: number;
  totalDiscountAmount: number;
  initialLoading: boolean;
  isEmpty: boolean;
  isGuest: boolean;
  onProceed: () => void;
}

export function CartSummaryPanel({ totalQty, totalAmount, totalDiscountAmount, initialLoading, isEmpty, isGuest, onProceed }: CartSummaryPanelProps) {
  return (
    <div className="lg:w-80 flex flex-col bg-white rounded-2xl border border-blue-100 overflow-hidden h-fit">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-blue-50">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <IconTag size={16} className="text-blue-800" />
        </div>
        <h3 className="text-base font-bold text-blue-800">خلاصه سفارش</h3>
      </div>

      <div className="px-4 sm:px-6 py-5 space-y-3">
        <SummaryRow label={`مجموع اقلام (${toPersianDigits(totalQty)})`} value={`${formatCurrency(totalAmount)}`} loading={initialLoading} />
        {totalDiscountAmount !== 0 && <SummaryRow label="مجموع تخفیف" value={`${formatCurrency(totalDiscountAmount)}`} loading={initialLoading} />}
        <div className="border-t border-dashed border-blue-100 pt-3">
          <SummaryRow label="مبلغ قابل پرداخت" value={`${formatCurrency(totalAmount - totalDiscountAmount)}`} loading={initialLoading} bold />
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-6 flex flex-col gap-3">
        <button
          onClick={onProceed}
          disabled={isEmpty || initialLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-100"
        >
          {isGuest ? <span>ورود برای ادامه خرید</span> : <span>ادامه — ثبت آدرس</span>}
          <ArrowLeft size={15} />
        </button>

        <NoteText isEmpty={isEmpty} isGuest={isGuest} />
      </div>
    </div>
  );
}