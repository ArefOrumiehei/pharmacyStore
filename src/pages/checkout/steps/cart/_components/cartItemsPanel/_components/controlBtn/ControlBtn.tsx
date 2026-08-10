import type { ReactNode } from "react";

interface ControlBtnProps {
  onClick: () => void;
  danger?: boolean;
  isInStock?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function ControlBtn({ onClick, danger, isInStock, disabled, children }: ControlBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={isInStock || disabled}
      className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed ${
        danger ? "text-rose-500 hover:bg-rose-50" : "text-blue-800 hover:bg-blue-100"
      }`}
    >
      {children}
    </button>
  );
}