import { IconSearch, IconX } from "@tabler/icons-react";

export default function BlogSearchBar({
    value,
    onChange,
    onSubmit,
    onClear,
}: {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClear: () => void;
}) {
    return (
        <form onSubmit={onSubmit} className="max-w-lg mx-auto w-full">
            <div className="relative">
                <IconSearch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="جستجو در مقالات..."
                    className="w-full border border-blue-100 bg-white rounded-2xl pl-4 pr-11 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 shadow-sm"
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <IconX size={14} />
                    </button>
                )}
            </div>
        </form>
    );
}