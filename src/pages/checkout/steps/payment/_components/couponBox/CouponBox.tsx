import { IconTag, IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";

interface CouponBoxProps {
  appliedCoupon: string | null;
  couponApplied: boolean;
  couponHasValue: boolean;
  discountMessage?: string;
  couponInput: string;
  onCouponInputChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  applying: boolean;
  couponMsg: string | null;
}

export function CouponBox({
  appliedCoupon,
  couponApplied,
  couponHasValue,
  discountMessage,
  couponInput,
  onCouponInputChange,
  onApply,
  onRemove,
  applying,
  couponMsg,
}: CouponBoxProps) {
  const showAppliedState = !!appliedCoupon && couponHasValue && couponApplied;

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
      <SectionTitle>کد تخفیف</SectionTitle>

      {showAppliedState ? (
        <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <IconCheck size={14} className="text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-700 truncate">{appliedCoupon!.toUpperCase()}</p>
              <p className="text-xs text-green-600 mt-0.5 truncate">{discountMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors duration-150 flex-shrink-0"
          >
            <IconX size={14} className="text-green-600" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <IconTag size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                placeholder="کد تخفیف را وارد کنید"
                className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
                  couponMsg ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={onApply}
              disabled={!couponInput.trim() || applying}
              className="px-3 sm:px-4 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 flex-shrink-0"
            >
              {applying ? <IconLoader2 size={15} className="animate-spin" /> : "اعمال"}
            </button>
          </div>
          {couponMsg && !couponApplied && <p className="text-rose-500 text-xs">{discountMessage || couponMsg}</p>}
        </div>
      )}
    </div>
  );
}