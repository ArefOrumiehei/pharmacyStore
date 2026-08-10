import type { ComponentType, ReactNode } from "react";

interface FieldProps {
  label: string;
  error?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  children: ReactNode;
}

export function Field({ label, error, icon: Icon, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-rose-500 text-xs">{error}</p>}
    </div>
  );
}

