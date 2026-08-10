import { IconMapPin } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import type { AddressData } from "@/pages/checkout/interfaces/checkout";

interface AddressSummaryProps {
  addressData: AddressData;
  onEdit: () => void;
}

export function AddressSummary({ addressData, onEdit }: AddressSummaryProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <SectionTitle>آدرس تحویل</SectionTitle>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-blue-800 font-medium hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
        >
          ویرایش
        </button>
      </div>
      <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3">
        <IconMapPin size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-gray-700 line-clamp-1">{addressData.receiverFullName}</span>
          <span className="text-xs text-gray-500">{toPersianDigits(addressData.receiverMobile)}</span>
          <span className="text-xs text-gray-500 line-clamp-2">{addressData.receiverAddress}</span>
          <span className="text-xs text-gray-400">کد پستی: {toPersianDigits(addressData.receiverZipCode)}</span>
        </div>
      </div>
    </div>
  );
}