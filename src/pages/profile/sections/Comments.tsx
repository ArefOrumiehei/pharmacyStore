import { useState } from "react";
import { Link } from "react-router";
import {
  IconMessage2,
  IconStar,
  IconStarFilled,
  IconCircleCheck,
  IconClock,
  IconCircleX,
  IconPill,
} from "@tabler/icons-react";

type CommentStatus = "approved" | "pending" | "rejected";

interface UserComment {
  id: string;
  productName: string;
  productSlug: string;
  productCategory: string;
  rating: number;
  body: string;
  status: CommentStatus;
  createdAt: string;
}

// Replace with your actual store/API call
const MOCK_COMMENTS: UserComment[] = [
  {
    id: "1",
    productName: "قرص سیتالوپرام ۲۰mg",
    productSlug: "antidepressants/citalopram-20",
    productCategory: "داروهای روان‌پزشکی",
    rating: 4,
    body: "دارو خوبی بود. بسته‌بندی سالم رسید و تحویل سریع بود.",
    status: "approved",
    createdAt: "۱۴۰۳/۰۴/۱۲",
  },
  {
    id: "2",
    productName: "شربت بروفن ۱۰۰ml",
    productSlug: "painkillers/ibuprofen-syrup",
    productCategory: "مسکن‌ها",
    rating: 5,
    body: "کیفیت عالی، قیمت مناسب. حتماً دوباره خرید می‌کنم.",
    status: "pending",
    createdAt: "۱۴۰۳/۰۴/۱۵",
  },
  {
    id: "3",
    productName: "کرم ضدآفتاب SPF50",
    productSlug: "skincare/sunscreen-spf50",
    productCategory: "مراقبت پوست",
    rating: 2,
    body: "متأسفانه با توضیحات سایت تطابق نداشت.",
    status: "rejected",
    createdAt: "۱۴۰۳/۰۳/۲۸",
  },
];

const STATUS_CONFIG: Record<
  CommentStatus,
  { label: string; className: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  approved: { label: "تأیید شده",    className: "text-green-700 bg-green-50 border-green-200", icon: IconCircleCheck },
  pending:  { label: "در انتظار تأیید", className: "text-amber-600 bg-amber-50 border-amber-200", icon: IconClock },
  rejected: { label: "رد شده",       className: "text-rose-600 bg-rose-50 border-rose-200",   icon: IconCircleX },
};

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

export default function Comments() {
  const [comments] = useState<UserComment[]>(MOCK_COMMENTS);
  // Replace with: const { comments } = useCommentStore();

  const approvedCount = comments.filter((c) => c.status === "approved").length;
  const pendingCount  = comments.filter((c) => c.status === "pending").length;

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-2">
        <IconMessage2 size={20} className="text-blue-800" />
        <h1 className="text-lg font-bold text-blue-800">نظرات من</h1>
      </div>

      {/* Stats strip */}
      {comments.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "کل نظرات",        value: comments.length,  color: "text-blue-800 bg-blue-50 border-blue-100" },
            { label: "تأیید شده",       value: approvedCount,    color: "text-green-700 bg-green-50 border-green-100" },
            { label: "در انتظار تأیید", value: pendingCount,     color: "text-amber-600 bg-amber-50 border-amber-100" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {comments.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <IconMessage2 size={28} className="text-blue-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">هنوز نظری ثبت نکرده‌اید</p>
          <Link to="/plp" className="text-sm text-blue-800 font-semibold underline underline-offset-2">
            خرید کنید و نظر بدهید
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => {
            const status = STATUS_CONFIG[comment.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={comment.id}
                className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3"
              >
                {/* Product row */}
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/product/${comment.productSlug}`}
                    className="flex items-center gap-3 min-w-0 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <IconPill size={18} className="text-blue-800" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-800 transition-colors truncate">
                        {comment.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {comment.productCategory}
                      </p>
                    </div>
                  </Link>

                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${status.className}`}
                  >
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>

                {/* Rating + body */}
                <div className="flex flex-col gap-2 border-t border-blue-50 pt-3">
                  <StarRating rating={comment.rating} />
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {comment.body}
                  </p>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-400">
                  ثبت شده در: {comment.createdAt}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}