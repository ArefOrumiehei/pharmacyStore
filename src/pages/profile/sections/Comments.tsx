import { useEffect } from "react";
import { Link } from "react-router";
import {
  IconMessage2,
  IconStar,
  IconStarFilled,
  IconMessageCheck,
  IconThumbUp,
  IconThumbDown,
  IconPill,
  IconCalendar,
} from "@tabler/icons-react";
import { useUserStore } from "@/store/useAccountStore";
import { toPersianDigits } from "smart-persian-tools";
import type { IUserComments } from "@/services/accountServices/accountServices";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <IconStarFilled key={i} size={13} className="text-amber-400" />
        ) : (
          <IconStar key={i} size={13} className="text-gray-200" />
        )
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Stats strip skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-blue-50 p-4 text-center">
            <div className="h-7 w-8 bg-blue-50 animate-pulse rounded mx-auto" />
            <div className="h-3 w-16 bg-blue-50 animate-pulse rounded mx-auto mt-2" />
          </div>
        ))}
      </div>
      {/* Card skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3.5 w-32 bg-blue-50 animate-pulse rounded" />
                <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-blue-50 animate-pulse rounded-lg" />
          </div>
          <div className="border-t border-blue-50 pt-3 flex flex-col gap-2">
            <div className="h-3 w-24 bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-full bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Comment card ─────────────────────────────────────────────────────────────

function CommentCard({ comment }: { comment: IUserComments }) {
  const hasReply = !!comment.reply;

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3">

      {/* Product row */}
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/product/${comment.categorySlug}/${comment.productSlug}`}
          className="flex items-center gap-3 min-w-0 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <IconPill size={18} className="text-blue-800" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-800 transition-colors truncate">
              {comment.productSlug}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{comment.categorySlug}</p>
          </div>
        </Link>

        {/* Like / dislike counts */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <IconThumbUp size={13} />
            {toPersianDigits(comment.likeCount)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <IconThumbDown size={13} />
            {toPersianDigits(comment.dislikeCount)}
          </span>
        </div>
      </div>

      {/* Rating + message */}
      <div className="flex flex-col gap-2 border-t border-blue-50 pt-3">
        <StarRating rating={comment.rate} />
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {comment.message}
        </p>
      </div>

      {/* Admin reply */}
      {hasReply && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <IconMessageCheck size={13} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">پاسخ فروشگاه</span>
            {comment.replyDate && (
              <span className="text-xs text-gray-400 mr-auto flex items-center gap-1">
                <IconCalendar size={11} />
                {comment.replyDate}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{comment.reply}</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <IconCalendar size={11} />
        ثبت شده در: {comment.creationDate}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Comments() {
  const { userComments, loading, fetchUserComments } = useUserStore();

  useEffect(() => {
    fetchUserComments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const comments = userComments ?? [];
  const repliedCount = comments.filter((c) => !!c.reply).length;

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-2">
        <IconMessage2 size={20} className="text-blue-800" />
        <h1 className="text-lg font-bold text-blue-800">نظرات من</h1>
        {!loading.comments && comments.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
            {toPersianDigits(comments.length)} نظر
          </span>
        )}
      </div>

      {/* Loading */}
      {loading.comments ? (
        <CommentSkeleton />
      ) : comments.length === 0 ? (

        /* Empty state */
        <div className="bg-white border border-blue-100 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <IconMessage2 size={28} className="text-blue-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">هنوز نظری ثبت نکرده‌اید</p>
          <Link
            to="/products"
            className="text-sm text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all"
          >
            خرید کنید و نظر بدهید
          </Link>
        </div>
      ) : (
        <>
          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "کل نظرات",         value: comments.length, color: "text-blue-800 bg-blue-50 border-blue-100"   },
              { label: "پاسخ دریافت شده",  value: repliedCount,    color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
                <p className="text-2xl font-bold">{toPersianDigits(value)}</p>
                <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
              </div>
            ))}
          </div>

          {/* List */}
          <div className="flex flex-col gap-3">
            {comments.map((comment, index) => (
              <CommentCard key={`${comment.productSlug}-${index}`} comment={comment} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}