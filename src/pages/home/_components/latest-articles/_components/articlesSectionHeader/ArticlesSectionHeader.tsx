import { Link } from "react-router";
import { IconArrowLeft } from "@tabler/icons-react";

interface ArticlesSectionHeaderProps {
  title: string;
  subtitle: string;
  showViewAll: boolean;
}

export default function ArticlesSectionHeader({ title, subtitle, showViewAll }: ArticlesSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-0.5 min-w-0">
        <h2 className="text-sm sm:text-lg font-bold text-blue-800 truncate">{title}</h2>
        <p className="text-[11px] sm:text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
      {showViewAll && (
        <Link
          to="/blog"
          className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 whitespace-nowrap"
        >
          <span className="hidden xs:inline">همه مقالات</span>
          <span className="xs:hidden">همه</span>
          <IconArrowLeft size={13} className="sm:w-[15px] sm:h-[15px]" />
        </Link>
      )}
    </div>
  );
}