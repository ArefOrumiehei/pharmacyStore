import { useState } from 'react';
import { IconBellRinging, IconBellCheck } from '@tabler/icons-react';

export default function NotifyMeBtn() {
  const [isNotified, setIsNotified] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotified((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full h-7 sm:h-9 flex items-center justify-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[8px] sm:text-xs font-medium transition-all duration-200 active:scale-95 flex-shrink-0 whitespace-nowrap ${
        isNotified
          ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
          : 'border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-500'
      }`}
    >
      {isNotified ? (
        <IconBellCheck size={11} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
      ) : (
        <IconBellRinging size={11} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
      )}
      <span className="truncate">{isNotified ? 'ثبت شد' : 'اطلاع‌رسانی'}</span>
    </button>
  );
}