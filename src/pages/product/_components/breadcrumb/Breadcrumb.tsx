import { Link } from "react-router";

interface BreadcrumbProps {
  categories: string;
}

export default function Breadcrumb({ categories }: BreadcrumbProps) {
  const segments = categories.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500" aria-label="breadcrumb">
      {/* <Link to="/" className="hover:text-blue-500 transition-colors duration-150">
        صفحه اصلی
      </Link> */}

      {segments.map((segment, index) => (
        <span key={index} className="flex items-center gap-1">
          <span className="text-gray-300">/</span>
          <Link
            to={`/category/${segment.toLowerCase()}`}
            className={`transition-colors duration-150 ${
              index === segments.length - 1
                ? "text-gray-700 font-medium pointer-events-none"
                : "hover:text-blue-500"
            }`}
          >
            {segment}
          </Link>
        </span>
      ))}
    </nav>
  );
}