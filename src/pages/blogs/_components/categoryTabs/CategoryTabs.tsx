export default function CategoryTabs({
    categories,
    active,
    onSelect,
}: {
    categories: string[];
    active: string | null;
    onSelect: (category: string) => void;
}) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
                <button
                    key={cat}
                    type="button"
                    onClick={() => onSelect(cat)}
                    className={`flex-shrink-0 snap-start whitespace-nowrap text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${
                        active === cat
                            ? "bg-blue-800 text-white border-blue-800"
                            : "bg-white text-gray-600 border-blue-100 hover:border-blue-300 hover:text-blue-800"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}