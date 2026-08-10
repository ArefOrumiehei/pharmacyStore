import { IconPlus } from "@tabler/icons-react";

interface AddressesHeaderProps {
  showAddButton: boolean;
  onAddClick: () => void;
}

export default function AddressesHeader({ showAddButton, onAddClick }: AddressesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-bold text-blue-800">آدرس‌های من</h1>
        <p className="hidden sm:block text-xs sm:text-sm text-gray-400 mt-0.5">
          آدرس‌های تحویل سفارش خود را مدیریت کنید
        </p>
      </div>
      {showAddButton && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 whitespace-nowrap"
        >
          <IconPlus size={14} className="sm:w-[15px] sm:h-[15px]" />
          <span className="hidden sm:inline">آدرس جدید</span>
        </button>
      )}
    </div>
  );
}