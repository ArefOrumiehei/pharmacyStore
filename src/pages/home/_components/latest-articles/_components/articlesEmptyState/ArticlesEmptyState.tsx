import { IconMoodEmpty } from "@tabler/icons-react";

export default function ArticlesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 sm:py-10 bg-white rounded-lg sm:rounded-xl border border-blue-100 text-center">
      <IconMoodEmpty size={30} className="text-gray-300 sm:w-9 sm:h-9" />
      <p className="text-xs sm:text-sm text-gray-400">مقاله‌ای برای نمایش وجود ندارد</p>
    </div>
  );
}