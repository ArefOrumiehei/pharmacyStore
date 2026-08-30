import { useEffect, useState, useCallback } from "react";
import { useCommentStore } from "@/store/useCommentsStore";
import { useUserStore } from "@/store/account/useAccountStore";
import CommentForm from "./commentForm/CommentForm";
import CommentsList from "./commentsList/CommentsList";
import type { CommentsSectionProps, ProductComment } from "../../types/productPageTypes";

export default function CommentsSection({ productId, initialComments }: CommentsSectionProps) {
  const { addNewComment, editExistingComment, likeExistingComment, dislikeExistingComment, deleteExistingComment } = useCommentStore();
  const { user } = useUserStore();

  const [comments, setComments]               = useState<ProductComment[]>(initialComments);
  const [message, setMessage]                 = useState("");
  const [rate, setRate]                       = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId]   = useState<number | null>(null);

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
  }, [message, rate, editingCommentId, productId, addNewComment, editExistingComment]);

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

  const handleLike = useCallback(async (commentId: number) => {
    if (!user?.id) return;
    const currentUserId = Number(user.id);
    setComments((prev) => prev.map((c) => {
      if (c.id !== commentId) return c;
      const likedUserIds = (c.likedByUserIds ?? []) as number[];
      const dislikedUserIds = (c.dislikedByUserIds ?? []) as number[];
      const liked = likedUserIds.includes(currentUserId);
      return {
        ...c,
        likeCount: liked ? c.likeCount - 1 : c.likeCount + 1,
        likedByUserIds: liked ? likedUserIds.filter((id) => id !== currentUserId) : [...likedUserIds, currentUserId],
        dislikeCount: dislikedUserIds.includes(currentUserId) ? c.dislikeCount - 1 : c.dislikeCount,
        dislikedByUserIds: dislikedUserIds.filter((id) => id !== currentUserId),
      };
    }));
    await likeExistingComment(commentId);
  }, [user, likeExistingComment]);

  const handleDislike = useCallback(async (commentId: number) => {
    if (!user?.id) return;
    const currentUserId = Number(user.id);
    setComments((prev) => prev.map((c) => {
      if (c.id !== commentId) return c;
      const dislikedUserIds = (c.dislikedByUserIds ?? []) as number[];
      const likedUserIds = (c.likedByUserIds ?? []) as number[];
      const disliked = dislikedUserIds.includes(currentUserId);
      const liked = likedUserIds.includes(currentUserId);
      return {
        ...c,
        dislikeCount: disliked ? c.dislikeCount - 1 : c.dislikeCount + 1,
        dislikedByUserIds: disliked ? dislikedUserIds.filter((id) => id !== currentUserId) : [...dislikedUserIds, currentUserId],
        likeCount: liked ? c.likeCount - 1 : c.likeCount,
        likedByUserIds: likedUserIds.filter((id) => id !== currentUserId),
      };
    }));
    await dislikeExistingComment(commentId);
  }, [dislikeExistingComment, user]);

  const handleDelete = useCallback(async (commentId: number) => {
    setPendingDeleteId(commentId);
    try {
      await deleteExistingComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } finally {
      setPendingDeleteId(null);
    }
  }, [deleteExistingComment]);

  return (
    <div className="flex flex-col gap-4">
      <CommentForm
        message={message}
        rate={rate}
        isEditing={editingCommentId !== null}
        onMessageChange={setMessage}
        onRateChange={setRate}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />
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