import { IconChevronLeft } from "@tabler/icons-react";
import { Link } from "react-router";

interface BreadcrumbProps {
    categories: string;
}

export default function Breadcrumb({ categories = "" }: BreadcrumbProps) {
    const segments = categories.split("/").filter(Boolean);
    const breadcrumbs = segments.map((seg, i) => ({
        label: seg,
        path: "/plp/" + segments.slice(0, i + 1).join("/"),
        isLast: i === segments.length - 1,
    }));

    if (categories != "") return (
        <nav
            className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-500 flex-wrap"
            aria-label="breadcrumb"
        >
            <Link
                to="/"
                className="text-blue-800 font-medium hover:text-blue-600 transition-colors duration-150 text-[10px] sm:text-sm"
            >
                خانه
            </Link>
            {breadcrumbs.map((segment, index) => (
                <span key={index} className="flex items-center gap-1 sm:gap-1.5">
                    <IconChevronLeft size={12} className="flex-shrink-0" />
                    <Link
                        to={`${segment.path}`}
                        className={`text-[10px] sm:text-sm transition-colors duration-150 ${
                            index === segments.length - 1
                                ? "text-blue-800 font-medium pointer-events-none"
                                : "text-gray-400 hover:text-blue-800"
                        }`}
                    >
                        {segment.label.replace(/-/g, " ")}
                    </Link>
                </span>
            ))}
        </nav>
    );
}
