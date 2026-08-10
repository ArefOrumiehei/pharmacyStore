import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";

interface AddressDeleteConfirmProps {
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AddressDeleteConfirm({ deleting, onConfirm, onCancel }: AddressDeleteConfirmProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
      <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">مطمئن؟</span>
      <button
        onClick={onConfirm}
        disabled={deleting}
        className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-150 whitespace-nowrap flex-shrink-0"
      >
        {deleting ? <IconLoader2 size={10} className="animate-spin sm:w-[11px] sm:h-[11px]" /> : <IconCheck size={10} className="sm:w-[11px] sm:h-[11px]" />}
        بله
      </button>
      <button
        onClick={onCancel}
        className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-150 whitespace-nowrap flex-shrink-0"
      >
        <IconX size={10} className="sm:w-[11px] sm:h-[11px]" /> خیر
      </button>
    </div>
  );
}