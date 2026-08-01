import { IconStar } from "@tabler/icons-react";
import CommentCard from "../commentCard/CommentCard";
import type { CommentsListProps } from "@/pages/product/types/productPageTypes";

export default function CommentsList({
  comments, currentUserId, onLike, onDislike, onEdit, onDelete, deletingCommentId
}: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 sm:py-16 gap-2.5 sm:gap-3 bg-white rounded-xl sm:rounded-2xl border border-blue-100 px-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <IconStar size={20} className="text-blue-300 sm:w-6 sm:h-6" />
        </div>
        <p className="text-gray-400 text-xs sm:text-sm text-center">هنوز نظری ثبت نشده است</p>
        <p className="text-gray-300 text-[10px] sm:text-xs text-center">اولین نفری باشید که نظر می‌دهد!</p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onLike={() => onLike(comment.id)}
          onDislike={() => onDislike(comment.id)}
          onEdit={() => onEdit(comment.message, comment.rate, comment.id)}
          onDelete={() => onDelete(comment.id)}
          deleteLoading={deletingCommentId === comment.id}
        />
      ))}
    </>
  );
}