import type { ICards } from "@/services/siteServices/siteServices";
import { PaymentCardItem } from "../paymentCardItem/PaymentCardItem";

function PaymentCardSkeleton() {
  return <div className="rounded-2xl bg-blue-50 animate-pulse h-32 sm:h-36" />;
}

interface PaymentCardsListProps {
  cards: ICards[];
  loading: boolean;
}

export function PaymentCardsList({ cards, loading }: PaymentCardsListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <PaymentCardSkeleton />
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-gray-600">
        مبلغ سفارش را به یکی از کارت‌های زیر واریز کرده و تصویر رسید را ثبت کنید
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <PaymentCardItem key={`${card.number}-${i}`} card={card} />
        ))}
      </div>
    </div>
  );
}