import type { ComponentType } from "react";

interface SectionHeaderProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-white" />
      </div>
      <h2 className="text-sm font-bold text-blue-800">{title}</h2>
    </div>
  );
}