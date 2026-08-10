import { IconWorldWww, IconCreditCard } from "@tabler/icons-react";
import type { PayMethod } from "../../types/payment";

const METHODS: { id: PayMethod; title: string; subtitle: string }[] = [
  { id: 1, title: "پرداخت آنلاین", subtitle: "درگاه امن بانکی" },
  { id: 2, title: "کارت به کارت", subtitle: "انتقال و ارسال رسید" },
];

interface PaymentMethodSelectorProps {
  selected: PayMethod;
  onSelect: (method: PayMethod) => void;
}

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {METHODS.map(({ id, title, subtitle }) => {
        const isActive = selected === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-right ${
              isActive ? "border-blue-800 bg-blue-50" : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/50"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                isActive ? "bg-blue-800 border-blue-800" : "bg-blue-50 border-blue-100"
              }`}
            >
              {id === 1 ? (
                <IconWorldWww size={18} className={isActive ? "text-white" : "text-blue-800"} />
              ) : (
                <IconCreditCard size={18} className={isActive ? "text-white" : "text-blue-800"} />
              )}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate ${isActive ? "text-blue-800" : "text-gray-700"}`}>{title}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
            </div>
            {isActive && <div className="mr-auto w-2 h-2 rounded-full bg-blue-800 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}