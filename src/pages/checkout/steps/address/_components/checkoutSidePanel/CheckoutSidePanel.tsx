import type { ComponentType, ReactNode } from "react";

interface CheckoutSidePanelProps {
  stepLabel: string;
  description: string;
  primaryLabel: ReactNode;
  primaryIcon: ComponentType<{ size?: number }>;
  onPrimaryClick: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: ReactNode;
  secondaryIcon?: ComponentType<{ size?: number }>;
  onSecondaryClick?: () => void;
}

export function CheckoutSidePanel({
  stepLabel,
  description,
  primaryLabel,
  primaryIcon: PrimaryIcon,
  onPrimaryClick,
  primaryDisabled,
  secondaryLabel,
  secondaryIcon: SecondaryIcon,
  onSecondaryClick,
}: CheckoutSidePanelProps) {
  return (
    <div className="w-full lg:w-72 flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{stepLabel}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <button
        type="button"
        onClick={onPrimaryClick}
        disabled={primaryDisabled}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white py-3 text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-100"
      >
        <span>{primaryLabel}</span>
        <PrimaryIcon size={15} />
      </button>

      {secondaryLabel && SecondaryIcon && onSecondaryClick && (
        <button
          type="button"
          onClick={onSecondaryClick}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 text-blue-800 bg-white hover:bg-blue-50 py-3 text-sm font-medium transition-all duration-150"
        >
          <SecondaryIcon size={15} />
          <span>{secondaryLabel}</span>
        </button>
      )}
    </div>
  );
}