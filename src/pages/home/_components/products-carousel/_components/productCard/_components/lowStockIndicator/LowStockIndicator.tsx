export default function LowStockIndicator({ stockCount }: { stockCount: number }) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
      </span>
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden min-w-0">
        <div
          className={`h-full rounded-full transition-all duration-500
            ${stockCount <= 3 ? "bg-red-400" : stockCount <= 6 ? "bg-orange-400" : "bg-amber-400"}`}
          style={{ width: `${(stockCount / 10) * 100}%` }}
        />
      </div>
      <span className={`text-[9px] sm:text-[11px] font-semibold whitespace-nowrap flex-shrink-0
        ${stockCount <= 3 ? "text-red-500" : stockCount <= 6 ? "text-orange-500" : "text-amber-600"}`}>
        فقط {new Intl.NumberFormat("fa-IR").format(stockCount)} عدد
      </span>
    </div>
  );
}