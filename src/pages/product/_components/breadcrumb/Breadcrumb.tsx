import { Link } from "react-router";

interface BreadcrumbProps {
    categories: string;
}

export default function Breadcrumb({ categories }: BreadcrumbProps) {
    const segments = categories.split("/").filter(Boolean);

    return (
        <nav
            className="flex items-center gap-1 text-sm text-gray-500 flex-wrap"
            aria-label="breadcrumb"
        >
            <Link
                to="/"
                className="text-blue-800 hover:text-blue-600 transition-colors duration-150 text-s"
            >
                خانه
            </Link>
            {segments.map((segment, index) => (
                <span key={index} className="flex items-center gap-1">
                    <span className="text-gray-300">/</span>
                    <Link
                        to={`/category/${segment.toLowerCase()}`}
                        className={`text-s transition-colors duration-150 ${
                            index === segments.length - 1
                                ? "text-blue-800 font-medium pointer-events-none"
                                : "text-gray-400 hover:text-blue-800"
                        }`}
                    >
                        {segment.replace(/-/g, " ")}
                    </Link>
                </span>
            ))}
        </nav>
    );
}
