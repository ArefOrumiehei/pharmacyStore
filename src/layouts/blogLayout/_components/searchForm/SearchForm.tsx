import { IconSearch } from "@tabler/icons-react";

export default function SearchForm({
    value,
    onChange,
    onSubmit,
    className = "",
    autoFocus = false,
}: {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
    autoFocus?: boolean;
}) {
    return (
        <form onSubmit={onSubmit} className={className}>
            <div className="relative">
                <IconSearch size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="جستجو در مقالات..."
                    autoFocus={autoFocus}
                    className="w-full border border-blue-100 bg-blue-50/30 rounded-xl pl-4 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
                />
            </div>
        </form>
    );
}