import { Link } from "react-router";
import { IconMessageCheck, IconPill, IconCalendar } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import type { IUserComments } from "@/types/account/account";
import CommentCardMenu from "./_components/commentCardMenu/CommentCardMenu";
import CommentVoteStats from "./_components/commentVoteStats/CommentVoteStats";
import StarRating from "./_components/starRating/StarRating";
import CommentStatusBadge from "./_components/commentStatusBadge/CommentStatusBadge";

interface CommentCardProps {
    comment: IUserComments;
    onEdit: () => void;
    onDelete: () => void;
}

export default function CommentCard({
    comment,
    onEdit,
    onDelete,
}: CommentCardProps) {
    const hasReply = !!comment.reply;

    const isDeleted = comment.status === "حدف شده";

    return (
        <div className="w-full min-w-0 bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
            {/* Product row */}
            <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                <div className="flex flex-1 items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <IconPill
                            size={16}
                            className="text-blue-800 sm:w-[18px] sm:h-[18px]"
                        />
                    </div>
                    <div className="flex flex-col items-start w-full">
                        <Link
                            to={`/product/${encodeURIComponent(
                                comment.categoryFullSlug
                            )}/${encodeURIComponent(comment.productSlug)}`}
                        >
                            <p className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-blue-800 transition-colors">
                                {comment.productName}
                            </p>
                        </Link>
                        <Link
                            to={`/plp/${encodeURIComponent(
                                comment.categoryFullSlug
                            )}`}
                        >
                            <p className="text-[10px] sm:text-xs text-gray-400 hover:text-gray-600 mt-0.5 transition-colors">
                                {comment.categoryName}
                            </p>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <CommentStatusBadge status={comment.status} />
                    {!isDeleted && <CommentCardMenu onEdit={onEdit} onDelete={onDelete} />}
                </div>
            </div>

            {/* Rating + message */}
            <div className="flex flex-col gap-1.5 sm:gap-2 border-t border-blue-50 pt-2.5 sm:pt-3">
                <StarRating rating={comment.rate} />
                <p className="text-xs sm:text-sm text-gray-600 leading-6 sm:leading-relaxed line-clamp-3">
                    {comment.message}
                </p>
            </div>

            {/* Admin reply */}
            {hasReply && (
                <div className="w-full bg-emerald-50 border border-emerald-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-1 sm:gap-1.5">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <IconMessageCheck
                                size={12}
                                className="text-emerald-600 sm:w-[13px] sm:h-[13px]"
                            />
                            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700">
                                پاسخ فروشگاه
                            </span>
                        </div>
                        {comment.replyDate && (
                            <span className="text-[10px] sm:text-xs text-gray-400 sm:mr-auto flex items-center gap-1">
                                <IconCalendar
                                    size={10}
                                    className="sm:w-[11px] sm:h-[11px]"
                                />
                                <span dir="ltr">
                                    {toPersianDigits(comment.replyDate)}
                                </span>
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-5 sm:leading-relaxed">
                        {comment.reply}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                    <IconCalendar
                        size={10}
                        className="sm:w-[11px] sm:h-[11px]"
                    />
                    ثبت شده در:{" "}
                    <span dir="ltr">
                        {toPersianDigits(comment.creationDate)}
                    </span>
                </p>

                <CommentVoteStats
                    likeCount={comment.likeCount}
                    dislikeCount={comment.dislikeCount}
                />
            </div>
        </div>
    );
}
