import { toPersianDigits } from "smart-persian-tools";

export default function InfoRow({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-blue-800 sm:w-[15px] sm:h-[15px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-400">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5 truncate">{toPersianDigits(value)}</p>
      </div>
    </div>
  );
}