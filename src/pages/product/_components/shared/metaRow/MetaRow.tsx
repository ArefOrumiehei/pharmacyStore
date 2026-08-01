import { Link } from "react-router";

export function MetaRow({
  label, value, href, icon,
}: {
  label: string; value?: string; href?: string; icon?: React.ReactNode;
}) {
  const content = (
    <span className={`text-[10px] sm:text-xs font-medium flex items-center gap-1 min-w-0 truncate ${href ? "text-blue-800 hover:text-blue-600 hover:underline cursor-pointer" : "text-gray-700"}`}>
      {icon}
      <span className="truncate">{value ?? "—"}</span>
    </span>
  );
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-gray-400 text-[10px] sm:text-xs bg-gray-50 border border-gray-100 px-1.5 sm:px-2 py-0.5 rounded-md flex-shrink-0 w-16 sm:w-20 text-center">
        {label}
      </span>
      {href ? <Link to={href} className="min-w-0">{content}</Link> : content}
    </div>
  );
}