import { useEffect, useState } from "react";
import { IconMessage2 } from "@tabler/icons-react";

// Stores
import { useUserStore } from "@/store/account/useAccountStore";
import { useCommentStore } from "@/store/useCommentsStore";

// Components
import CommentCard from "./_components/commentCard/CommentCard";
import CommentsStatsStrip from "./_components/commentsStatsStrip/CommentsStatsStrip";
import CommentsSkeleton from "./_components/commentsSkeleton/CommentsSkeleton";
import CommentsEmptyState from "./_components/commentsEmptyState/CommentsEmptyState";
import EditCommentModal from "./_components/editCommentModal/EditCommentModal";
import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";

// Types
import type { IUserComments } from "@/types/account/account";

export default function Comments() {
    const { userComments, loading, fetchUserComments } = useUserStore();
    const { deleteExistingComment, editExistingComment } = useCommentStore();

    const [editingComment, setEditingComment] = useState<IUserComments | null>(
        null
    );
    const [savingEdit, setSavingEdit] = useState(false);

    const [pendingDeleteComment, setPendingDeleteComment] =
        useState<IUserComments | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchUserComments();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const comments = userComments ?? [];
    const repliedCount = comments.filter((c) => !!c.reply).length;

    const handleSaveEdit = async (message: string, rate: number) => {
        if (!editingComment) return;
        setSavingEdit(true);
        try {
            await editExistingComment(editingComment.id, message, rate);
            setEditingComment(null);
        } finally {
            setSavingEdit(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!pendingDeleteComment) return;
        setDeleting(true);
        try {
            await deleteExistingComment(pendingDeleteComment.id);
        } finally {
            setDeleting(false);
            setPendingDeleteComment(null);
        }
    };

    return (
        <div className="flex flex-col gap-3.5 sm:gap-5" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                <IconMessage2
                    size={18}
                    className="text-blue-800 sm:w-5 sm:h-5"
                />
                <h1 className="text-sm sm:text-lg font-bold text-blue-800">
                    نظرات من
                </h1>
            </div>

            {loading.comments ? (
                <CommentsSkeleton />
            ) : comments.length === 0 ? (
                <CommentsEmptyState />
            ) : (
                <>
                    <CommentsStatsStrip
                        totalCount={comments.length}
                        repliedCount={repliedCount}
                    />

                    <div className="flex flex-col gap-2.5 sm:gap-3">
                        {comments.map((comment, index) => (
                            <CommentCard
                                key={`${comment.productSlug}-${index}`}
                                comment={comment}
                                onEdit={() => setEditingComment(comment)}
                                onDelete={() =>
                                    setPendingDeleteComment(comment)
                                }
                            />
                        ))}
                    </div>
                </>
            )}

            <EditCommentModal
                open={!!editingComment}
                initialMessage={editingComment?.message ?? ""}
                initialRate={editingComment?.rate ?? 0}
                loading={savingEdit}
                onSave={handleSaveEdit}
                onCancel={() => setEditingComment(null)}
            />

            <ConfirmModal
                open={!!pendingDeleteComment}
                title="حذف نظر"
                description="آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست."
                confirmLabel="حذف نظر"
                cancelLabel="انصراف"
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteComment(null)}
            />
        </div>
    );
}
