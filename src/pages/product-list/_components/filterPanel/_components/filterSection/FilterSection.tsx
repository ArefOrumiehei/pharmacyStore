import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

export default function FilterSection({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="px-4 py-3">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between mb-2 group"
            >
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-800 transition-colors">
                    {title}
                </span>
                <IconChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && children}
        </div>
    );
}