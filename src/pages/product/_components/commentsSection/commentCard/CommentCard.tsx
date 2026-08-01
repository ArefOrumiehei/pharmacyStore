import { useEffect, useRef, useState } from "react";
import { toPersianDigits } from "smart-persian-tools";
import {
  IconDotsVertical,
  IconFlag,
  IconPencil,
  IconStar,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
  IconTrash,
  IconRosetteDiscountCheck,
  IconMessageCircle,
} from "@tabler/icons-react";

// Components
import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";

// Types
import type { CommentCardProps } from "@/pages/product/types/productPageTypes";

export default function CommentCard({
  comment, currentUserId, onLike, onDislike, onEdit, onDelete, deleteLoading
}: CommentCardProps) {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef                     = useRef<HTMLDivElement>(null);
  const userId                      = currentUserId ? Number(currentUserId) : undefined;
  const isOwner                     = userId === comment.userId;
  const liked                       = comment.likedByUserIds?.includes(userId!);
  const disliked                    = comment.dislikedByUserIds?.includes(userId!);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleConfirmDelete = () => {
    onDelete();
    setConfirmOpen(false);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs sm:text-sm font-bold flex-shrink-0">
            {comment.username?.[0]}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-semibold text-xs sm:text-sm text-gray-800 truncate">{comment.username}</span>
              {comment.isBuyer && (
                <span className="flex items-center gap-0.5 text-[10px] sm:text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                  <IconRosetteDiscountCheck size={11} className="text-emerald-600 sm:w-3 sm:h-3" />
                  خریدار محصول
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 truncate">
              {comment.creationDate}
              {comment.hasEdited && (
                <span title={`ویرایش شده در ${comment.lastModifedDate}`} className="text-gray-300 whitespace-nowrap">
                  · ویرایش شده
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <IconDotsVertical size={16} className="text-gray-400 sm:w-[17px] sm:h-[17px]" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] bg-white border border-blue-100 rounded-xl shadow-lg z-20 py-1 min-w-[110px] sm:min-w-[120px]">
              <MenuBtn icon={<IconFlag size={14} />} label="گزارش" onClick={() => setMenuOpen(false)} />
              {isOwner && (
                <>
                  <MenuBtn icon={<IconPencil size={14} />} label="ویرایش" variant="blue" onClick={() => { onEdit(); setMenuOpen(false); }} />
                  <MenuBtn
                    icon={<IconTrash size={14} />}
                    label="حذف"
                    variant="red"
                    onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            size={12}
            className={`sm:w-3.5 sm:h-3.5 ${i < comment.rate ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
          />
        ))}
      </div>

      <p className="text-xs sm:text-sm text-gray-700 leading-6 sm:leading-7 whitespace-pre-line">{comment.message}</p>

      {comment.reply && (
        <div className="flex gap-2 sm:gap-2.5 bg-blue-50/60 border border-blue-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mr-2 sm:mr-4">
          <IconMessageCircle size={14} className="text-blue-800 flex-shrink-0 mt-0.5 sm:w-[15px] sm:h-[15px]" />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold text-blue-800">پاسخ فارماپلاس</span>
              {comment.replyDate && (
                <span className="text-[10px] sm:text-[12px] text-blue-400">{comment.replyDate}</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-5 sm:leading-6">{comment.reply}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-4 pt-1.5 sm:pt-2 border-t border-blue-50">
        <VoteButton onClick={onLike} active={liked} count={comment.likeCount} activeClass="text-emerald-600" icon={liked ? <IconThumbUpFilled size={14} /> : <IconThumbUp size={14} />} />
        <VoteButton onClick={onDislike} active={disliked} count={comment.dislikeCount} activeClass="text-rose-500" icon={disliked ? <IconThumbDownFilled size={14} /> : <IconThumbDown size={14} />} />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="حذف نظر"
        description="آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست."
        confirmLabel="حذف نظر"
        cancelLabel="انصراف"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function MenuBtn({
  icon, label, onClick, variant,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; variant?: "blue" | "red";
}) {
  const color = variant === "blue" ? "text-blue-800 hover:bg-blue-50" : variant === "red" ? "text-rose-600 hover:bg-rose-50" : "text-gray-600 hover:bg-gray-50";
  return (
    <button onClick={onClick} className={`flex items-center gap-2 w-full px-3 py-2 text-xs sm:text-sm transition-colors ${color}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function VoteButton({
  icon, count, active, activeClass, onClick
}: {
  icon: React.ReactNode; count: number; active?: boolean; activeClass: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm transition-colors ${active ? activeClass : "text-gray-400 hover:text-gray-600"}`}>
      {icon}
      <span className="font-medium tabular-nums">{toPersianDigits(count)}</span>
    </button>
  );
}