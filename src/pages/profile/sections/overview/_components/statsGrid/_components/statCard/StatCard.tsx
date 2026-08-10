import { Link } from "react-router";
import { toPersianDigits } from "smart-persian-tools";

export interface StatItem {
  label: string;
  value?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  link: string;
  color: string;
  iconColor: string;
}

export default function StatCard({ stat }: { stat: StatItem }) {
  const borderColorClass = stat.color.split(" ")[1];

  return (
    <Link to={stat.link}>
      <div className={`bg-white border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-start gap-2 sm:gap-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200 cursor-pointer h-full ${borderColorClass}`}>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center ${stat.color}`}>
          <stat.icon size={16} className={`${stat.iconColor} sm:w-5 sm:h-5`} />
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-bold text-gray-800">
            {stat.value !== undefined ? toPersianDigits(stat.value) : "—"}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">{stat.label}</p>
        </div>
      </div>
    </Link>
  );
}