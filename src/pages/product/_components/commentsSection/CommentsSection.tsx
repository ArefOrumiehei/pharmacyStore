import { useEffect, useState, useCallback } from "react";
import { useCommentStore } from "@/store/useCommentsStore";
import { useUserStore } from "@/store/account/useAccountStore";
import CommentForm from "./commentForm/CommentForm";
import CommentsList from "./commentsList/CommentsList";
import type {
  CommentsSectionProps,
  ProductComment,
} from "../../types/productPageTypes";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router";
import { IconLogin } from "@tabler/icons-react";

export default function CommentsSection({
  productId,
  initialComments,
}: CommentsSectionProps) {
  const {
    addNewComment,
    editExistingComment,
    likeExistingComment,
    dislikeExistingComment,
    deleteExistingComment,
  } = useCommentStore();
  const { user } = useUserStore();
  const { accessToken } = useAuthStore();

  const [comments, setComments] = useState<ProductComment[]>(initialComments);
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Reset everything when navigating to a different product
  useEffect(() => {
    setComments(initialComments);
    setMessage("");
    setRate(0);
    setEditingCommentId(null);
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || rate === 0) return;
    if (editingCommentId !== null) {
      await editExistingComment(editingCommentId, message, rate);
    } else {
      await addNewComment({ message, recordId: productId, type: 1, rate });
    }
    setMessage("");
    setRate(0);
    setEditingCommentId(null);
  }, [
    message,
    rate,
    editingCommentId,
    productId,
    addNewComment,
    editExistingComment,
  ]);

  const handleEdit = useCallback((msg: string, r: number, id: number) => {
    setMessage(msg);
    setRate(r);
    setEditingCommentId(id);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setMessage("");
    setRate(0);
  }, []);

  const handleLike = useCallback(
    async (commentId: number) => {
      if (!user?.id) return;
      const currentUserId = Number(user.id);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const likedUserIds = (c.likedByUserIds ?? []) as number[];
          const dislikedUserIds = (c.dislikedByUserIds ?? []) as number[];
          const liked = likedUserIds.includes(currentUserId);
          return {
            ...c,
            likeCount: liked ? c.likeCount - 1 : c.likeCount + 1,
            likedByUserIds: liked
              ? likedUserIds.filter((id) => id !== currentUserId)
              : [...likedUserIds, currentUserId],
            dislikeCount: dislikedUserIds.includes(currentUserId)
              ? c.dislikeCount - 1
              : c.dislikeCount,
            dislikedByUserIds: dislikedUserIds.filter(
              (id) => id !== currentUserId
            ),
          };
        })
      );
      await likeExistingComment(commentId);
    },
    [user, likeExistingComment]
  );

  const handleDislike = useCallback(
    async (commentId: number) => {
      if (!user?.id) return;
      const currentUserId = Number(user.id);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const dislikedUserIds = (c.dislikedByUserIds ?? []) as number[];
          const likedUserIds = (c.likedByUserIds ?? []) as number[];
          const disliked = dislikedUserIds.includes(currentUserId);
          const liked = likedUserIds.includes(currentUserId);
          return {
            ...c,
            dislikeCount: disliked ? c.dislikeCount - 1 : c.dislikeCount + 1,
            dislikedByUserIds: disliked
              ? dislikedUserIds.filter((id) => id !== currentUserId)
              : [...dislikedUserIds, currentUserId],
            likeCount: liked ? c.likeCount - 1 : c.likeCount,
            likedByUserIds: likedUserIds.filter((id) => id !== currentUserId),
          };
        })
      );
      await dislikeExistingComment(commentId);
    },
    [dislikeExistingComment, user]
  );

  const handleDelete = useCallback(
    async (commentId: number) => {
      setPendingDeleteId(commentId);
      try {
        await deleteExistingComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } finally {
        setPendingDeleteId(null);
      }
    },
    [deleteExistingComment]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div
          className={
            accessToken
              ? undefined
              : "pointer-events-none select-none blur-xs opacity-80"
          }
          aria-hidden={!accessToken}
          inert={!accessToken}
        >
          <CommentForm
            message={message}
            rate={rate}
            isEditing={editingCommentId !== null}
            onMessageChange={setMessage}
            onRateChange={setRate}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        </div>

        {!accessToken && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/40 px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <IconLogin size={20} className="text-blue-400 sm:w-6 sm:h-6" />
            </div>
            <p className="text-gray-600 text-xs sm:text-sm text-center">
              برای ثبت نظر لطفا ابتدا{" "}
              <Link
                to="/login"
                className="text-blue-500 font-medium hover:underline"
              >
                وارد شوید
              </Link>
            </p>
          </div>
        )}
      </div>

      <CommentsList
        comments={comments}
        currentUserId={user?.id}
        onLike={handleLike}
        onDislike={handleDislike}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingCommentId={pendingDeleteId}
      />
    </div>
  );
}
