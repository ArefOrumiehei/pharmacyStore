interface OrderStatusFilterProps {
  statuses: string[];
  activeStatus: string;
  onChange: (status: string) => void;
}

export default function OrderStatusFilter({ statuses, activeStatus, onChange }: OrderStatusFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap pb-1 -mb-1">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeStatus === s
              ? "bg-blue-800 text-white border-blue-800"
              : "bg-white text-gray-500 border-blue-100 hover:border-blue-300 hover:text-blue-800"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}