import { useEffect, useMemo, useRef, useState } from "react";
import { IconCheck, IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";

export default function BrandSelect({
    brands,
    value,
    onChange,
}: {
    brands: string[];
    value: string | null;
    onChange: (brand: string | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // De-duplicate (the brand facet can repeat the same name) and filter by search
    const options = useMemo(() => {
        const unique = Array.from(new Set(brands.map((b) => b.trim()).filter(Boolean)));
        const q = query.trim();
        return q ? unique.filter((b) => b.includes(q)) : unique;
    }, [brands, query]);

    const handleSelect = (brand: string) => {
        onChange(value === brand ? null : brand);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between gap-2 border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2 text-sm hover:bg-blue-50 transition-all duration-200"
            >
                <span className={`truncate ${value ? "text-gray-700" : "text-gray-400"}`}>
                    {value ?? "انتخاب برند..."}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {value && (
                        <span
                            role="button"
                            aria-label="حذف انتخاب برند"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);
                            }}
                            className="text-gray-400 hover:text-rose-500 transition-colors"
                        >
                            <IconX size={14} />
                        </span>
                    )}
                    <IconChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {open && (
                <div className="absolute right-0 left-0 top-[calc(100%+6px)] bg-white border border-blue-100 rounded-2xl shadow-lg z-30 overflow-hidden">
                    <div className="relative p-2 border-b border-blue-50">
                        <IconSearch
                            size={14}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="جستجوی برند..."
                            className="w-full border border-blue-100 bg-blue-50/30 rounded-xl pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1">
                        {options.length ? (
                            options.map((brand) => (
                                <button
                                    type="button"
                                    key={brand}
                                    onClick={() => handleSelect(brand)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm text-right transition-colors duration-150 ${
                                        value === brand ? "text-blue-800 font-semibold bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {brand}
                                    {value === brand && <IconCheck size={13} className="text-blue-800" />}
                                </button>
                            ))
                        ) : (
                            <div className="text-sm text-gray-400 px-3 py-3 text-center">نتیجه‌ای یافت نشد.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}