import { IconShieldCheck } from "@tabler/icons-react";

export function TrustBadge() {
  return (
    <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
      <IconShieldCheck size={16} className="text-green-600 flex-shrink-0" />
      <p className="text-xs text-green-700 font-medium">پرداخت امن با رمزگذاری SSL</p>
    </div>
  );
}