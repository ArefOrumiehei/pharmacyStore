interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
  loading?: boolean;
  highlight?: "green";
}

export function SummaryRow({ label, value, bold, loading, highlight }: SummaryRowProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={bold ? "font-bold text-gray-800" : "text-gray-500"}>{label}</span>
      {loading ? (
        <div className={`bg-blue-50 animate-pulse rounded ${bold ? "h-4 w-28" : "h-3.5 w-20"}`} />
      ) : (
        <span
          className={
            bold
              ? "font-bold text-blue-800 text-base"
              : highlight === "green"
              ? "text-green-600 font-medium"
              : "text-gray-700"
          }
        >
          {value}
        </span>
      )}
    </div>
  );
}