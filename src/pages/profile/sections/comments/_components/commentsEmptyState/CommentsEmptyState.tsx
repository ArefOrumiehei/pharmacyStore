import { IconMessage2 } from "@tabler/icons-react";

export default function CommentsEmptyState() {
  return (
    <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-8 sm:p-12 flex flex-col items-center gap-2.5 sm:gap-3 text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center">
        <IconMessage2 size={24} className="text-blue-300 sm:w-7 sm:h-7" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-500">هنوز نظری ثبت نکرده‌اید</p>
    </div>
  );
}