import type { CommentFormProps } from "@/pages/product/types/productPageTypes";
import RatingStars from "../../ratingStars/RatingStars";
import SectionTitle from "../../../../../components/common/sectionTitle/SectionTitle";

export default function CommentForm({
    message,
    rate,
    isEditing,
    onMessageChange,
    onRateChange,
    onSubmit,
    onCancel,
}: CommentFormProps) {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            <SectionTitle>
                {isEditing ? "ویرایش نظر" : "ثبت نظر جدید"}
            </SectionTitle>
            <RatingStars rate={rate} setRate={onRateChange} />
            <textarea
                className="w-full border border-blue-100 bg-blue-50/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-right text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none placeholder-gray-400 transition-all duration-200 leading-6 sm:leading-7"
                rows={3}
                placeholder="نظر خود را بنویسید..."
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
            />
            <div className="flex gap-2">
                {isEditing && (
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        انصراف
                    </button>
                )}
                <button
                    onClick={onSubmit}
                    disabled={!message.trim() || rate === 0}
                    className="flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all"
                >
                    {isEditing ? "ذخیره تغییرات" : "ارسال نظر"}
                </button>
            </div>
        </div>
    );
}
