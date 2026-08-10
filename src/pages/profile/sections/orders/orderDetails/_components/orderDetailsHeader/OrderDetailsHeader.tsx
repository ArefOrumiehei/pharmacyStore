import { IconArrowRight, IconCalendar, IconDownload } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { IOrder } from "@/services/accountServices/accountServices";
import { FALLBACK_STATUS, STATUS_CONFIG } from "@/pages/profile/constants/Constants";
import { useOrderStore } from "@/store/useOrderStore";

interface OrderDetailsHeaderProps {
  order: IOrder;
  canDownloadInvoice: boolean;
  onBack: () => void;
}

export default function OrderDetailsHeader({ order, canDownloadInvoice, onBack }: OrderDetailsHeaderProps) {
  const { downloadInvoice } = useOrderStore();
  
  const handleDownload = async (id: number) => {
    await downloadInvoice(id);
  };
  
  const s = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
  const StatusIcon = s.icon;

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <IconArrowRight size={15} className="text-blue-800 sm:w-[17px] sm:h-[17px]" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold text-blue-800 truncate">
            سفارش {toPersianDigits(order.id)}#
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <IconCalendar size={11} className="sm:w-3 sm:h-3" />
            {toPersianDigits(order.creationDateDisplay)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border whitespace-nowrap ${s.class}`}>
          <StatusIcon size={12} className="sm:w-[14px] sm:h-[14px]" />
          {s.label}
        </span>
        {canDownloadInvoice && (
          <button
            onClick={() => handleDownload(order.id)}
            className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-blue-800 bg-white hover:bg-blue-50 border border-blue-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all whitespace-nowrap"
          >
            <IconDownload size={12} className="sm:w-[14px] sm:h-[14px]" />
            فاکتور
          </button>
        )}
      </div>
    </div>
  );
}