export default function CategoryKeywords({
    keywords,
    onSelect,
}: {
    keywords: string[];
    onSelect?: (keyword: string) => void;
}) {
    if (!keywords.length) return null;

    return (
        <div className="flex flex-wrap gap-2 my-6">
            {keywords.map((item) => {
                const label = item.trim();
                if (!label) return null;
                return (
                    <button
                        key={label}
                        type="button"
                        onClick={() => onSelect?.(label)}
                        className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 hover:bg-blue-800 hover:text-white hover:border-blue-800 transition-all duration-200"
                    >
                        #{label}
                    </button>
                );
            })}
        </div>
    );
}