import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown, IconSortAscending } from "@tabler/icons-react";
import { SORT_OPTIONS } from "../../lib/plpFilters";

export default function SortDropdown({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "مرتب‌سازی";

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2.5 rounded-xl transition-all duration-200"
            >
                <IconSortAscending size={16} />
                <span className="hidden sm:inline">{label}</span>
                <IconChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-blue-100 rounded-2xl shadow-lg z-30 py-1.5 min-w-[160px]">
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm transition-colors duration-150 ${
                                value === opt.value ? "text-blue-800 font-semibold bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {opt.label}
                            {value === opt.value && <IconCheck size={13} className="text-blue-800" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}