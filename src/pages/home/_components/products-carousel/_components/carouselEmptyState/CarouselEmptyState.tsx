import { IconMoodEmpty } from "@tabler/icons-react";

export default function CarouselEmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 sm:py-10 text-center" dir="rtl">
      <IconMoodEmpty size={28} className="text-gray-300 sm:w-9 sm:h-9" />
      <p className="text-xs sm:text-sm text-gray-400">{text}</p>
    </div>
  );
}