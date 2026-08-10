import { toPersianDigits } from "smart-persian-tools";

interface CommentsStatsStripProps {
  totalCount: number;
  repliedCount: number;
}

export default function CommentsStatsStrip({ totalCount, repliedCount }: CommentsStatsStripProps) {
  const stats = [
    { label: "کل نظرات", value: totalCount, color: "text-blue-800 bg-blue-50 border-blue-100" },
    { label: "پاسخ دریافت شده", value: repliedCount, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-3">
      {stats.map(({ label, value, color }) => (
        <div key={label} className={`w-full rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-center ${color}`}>
          <p className="text-lg sm:text-2xl font-bold">{toPersianDigits(value)}</p>
          <p className="text-[10px] sm:text-xs font-medium mt-0.5 opacity-80">{label}</p>
        </div>
      ))}
    </div>
  );
}