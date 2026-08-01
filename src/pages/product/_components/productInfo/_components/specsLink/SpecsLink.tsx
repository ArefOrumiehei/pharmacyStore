import { IconChevronLeft } from "@tabler/icons-react";

export default function SpecsLink() {
  return (
    <div className="mt-auto pt-2">
      <a
        href="#specifications"
        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200"
      >
        مشاهده مشخصات کامل
        <IconChevronLeft size={12} />
      </a>
    </div>
  );
}