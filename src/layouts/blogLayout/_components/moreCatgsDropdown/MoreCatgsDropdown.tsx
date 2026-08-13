import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { IconChevronDown } from "@tabler/icons-react";

interface CategoryItem {
    slug: string;
    name: string;
    articlesCount: number;
}

export default function MoreCatgsDropdown({ categories }: { categories: CategoryItem[] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (!categories.length) return null;

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-150"
            >
                بیشتر
                <IconChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/40 py-1.5 z-50">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/blog?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-xs text-gray-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                        >
                            <span>{cat.name}</span>
                            {cat.articlesCount > 0 && <span className="text-[10px] text-gray-400">{cat.articlesCount}</span>}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}