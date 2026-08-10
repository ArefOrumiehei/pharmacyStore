import { IconAlertTriangle, IconX } from "@tabler/icons-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open, title, description, confirmLabel = "تأیید", cancelLabel = "انصراف",
  loading, onConfirm, onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px] px-4"
      dir="rtl"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-rose-100 shadow-xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
              <IconAlertTriangle size={18} className="text-rose-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-gray-800">{title}</h3>
              {description && <p className="text-xs text-gray-400 leading-5">{description}</p>}
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
            <IconX size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-row-reverse gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all active:scale-95"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-600 text-sm font-semibold transition-all"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}