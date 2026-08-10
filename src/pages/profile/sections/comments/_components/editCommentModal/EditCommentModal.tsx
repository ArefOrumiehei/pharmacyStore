import { useEffect, useState } from "react";
import { IconX, IconLoader2 } from "@tabler/icons-react";
import RatingStars from "@/pages/product/_components/ratingStars/RatingStars";

interface EditCommentModalProps {
  open: boolean;
  initialMessage: string;
  initialRate: number;
  loading?: boolean;
  onSave: (message: string, rate: number) => void;
  onCancel: () => void;
}

export default function EditCommentModal({
  open, initialMessage, initialRate, loading, onSave, onCancel,
}: EditCommentModalProps) {
  const [message, setMessage] = useState(initialMessage);
  const [rate, setRate] = useState(initialRate);

  // Reset local draft whenever a different comment opens for editing
  useEffect(() => {
    if (open) {
      setMessage(initialMessage);
      setRate(initialRate);
    }
  }, [open, initialMessage, initialRate]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px] px-3 sm:px-4"
      dir="rtl"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white rounded-xl sm:rounded-2xl border border-blue-100 shadow-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-gray-800">ویرایش نظر</h3>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-50 transition-colors">
            <IconX size={16} className="text-gray-400 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        <RatingStars rate={rate} setRate={setRate} />

        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          className="w-full border border-blue-100 bg-blue-50/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none placeholder-gray-400 transition-all duration-200 leading-6 sm:leading-7"
        />

        <div className="flex flex-row-reverse gap-2">
          <button
            onClick={() => onSave(message, rate)}
            disabled={!message.trim() || rate === 0 || loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
          >
            {loading && <IconLoader2 size={14} className="animate-spin" />}
            ذخیره تغییرات
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-600 text-xs sm:text-sm font-semibold transition-all"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}