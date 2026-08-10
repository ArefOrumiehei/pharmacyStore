import { Loader2 } from "lucide-react";
import { IconShoppingCart } from "@tabler/icons-react";

export function SyncingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14 sm:py-20 bg-white rounded-2xl border border-blue-100 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconShoppingCart size={24} className="text-blue-400" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Loader2 size={15} className="animate-spin text-blue-800" />
          <p className="text-sm font-semibold text-blue-800">در حال انتقال سبد خرید...</p>
        </div>
        <p className="text-xs text-gray-400">اقلام انتخابی شما در حال ادغام با حساب شماست</p>
      </div>
    </div>
  );
}