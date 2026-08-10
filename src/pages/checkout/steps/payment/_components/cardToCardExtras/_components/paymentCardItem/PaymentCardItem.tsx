import { useState } from "react";
import { IconCopy, IconCheck, IconUser } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { ICards } from "@/services/siteServices/siteServices";
import { formatCardNumber } from "../../../../utils/payment";

interface PaymentCardItemProps {
  card: ICards;
}

export function PaymentCardItem({ card }: PaymentCardItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(card.number.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-800 to-blue-600 p-4 sm:p-5 text-white flex flex-col gap-4 sm:gap-5">
      {/* decorative circles */}
      <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

      <div className="flex items-center justify-between gap-2 relative">
        <div className="flex items-center gap-1.5 text-white/70">
          <IconUser size={13} className="flex-shrink-0" />
          <span className="text-xs truncate">{card.owner}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
        >
          {copied ? (
            <>
              <IconCheck size={12} />
              کپی شد
            </>
          ) : (
            <>
              <IconCopy size={12} />
              کپی شماره کارت
            </>
          )}
        </button>
      </div>

      <p dir="ltr" className="relative text-base sm:text-lg font-bold tracking-widest text-center break-all">
        {toPersianDigits(formatCardNumber(card.number))}
      </p>
    </div>
  );
}