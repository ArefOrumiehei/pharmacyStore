import { useEffect, useState } from "react";
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";

export type ToastVariant = "success" | "error" | "info";

const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof IconCheck; iconBg: string; iconColor: string; border: string }> = {
  success: { icon: IconCheck,         iconBg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-100" },
  error:   { icon: IconAlertTriangle, iconBg: "bg-rose-50",    iconColor: "text-rose-600",    border: "border-rose-100" },
  info:    { icon: IconInfoCircle,    iconBg: "bg-blue-50",    iconColor: "text-blue-800",    border: "border-blue-100" },
};

interface ToastItemProps {
  message: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

export default function ToastItem({
  message, description, variant = "success", actionLabel, onAction, onClose,
}: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const { icon: Icon, iconBg, iconColor, border } = VARIANT_CONFIG[variant];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`flex items-start gap-3 bg-white border ${border} rounded-2xl shadow-lg shadow-gray-200/50 p-4 transition-all duration-200 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} className={iconColor} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-800">{message}</p>
        {description && <p className="text-xs text-gray-400 leading-5">{description}</p>}

        {actionLabel && onAction && (
          <button
            onClick={() => { onAction(); handleClose(); }}
            className="mt-1 self-start text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg px-3 py-1.5 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>

      <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
        <IconX size={14} className="text-gray-400" />
      </button>
    </div>
  );
}