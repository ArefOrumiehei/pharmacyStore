import { IconCheck, IconClock, IconTrash, IconX } from "@tabler/icons-react";

export type CommentStatus = 1 | 2 | 3 | 4;
export type CommentsLabel = "در حال بررسی" | "تایید شده" | "رد شده" | "حذف شده";

const STATUS_MAP: Record<
    CommentStatus,
    {
        label: CommentsLabel;
        icon: typeof IconCheck;
        wrapClass: string;
        iconClass: string;
    }
> = {
    1: {
        label: "در حال بررسی",
        icon: IconClock,
        wrapClass: "bg-amber-50 border-amber-100 text-amber-700",
        iconClass: "text-amber-600",
    },
    2: {
        label: "تایید شده",
        icon: IconCheck,
        wrapClass: "bg-emerald-50 border-emerald-100 text-emerald-700",
        iconClass: "text-emerald-600",
    },
    3: {
        label: "رد شده",
        icon: IconX,
        wrapClass: "bg-red-50 border-red-100 text-red-700",
        iconClass: "text-red-600",
    },
    4: {
        label: "حذف شده",
        icon: IconTrash,
        wrapClass: "bg-rose-50 border-rose-100 text-rose-700",
        iconClass: "text-rose-600",
    },
};

interface CommentStatusBadgeProps {
    status: CommentStatus;
}

export default function CommentStatusBadge({
    status,
}: CommentStatusBadgeProps) {
    const { label, icon: Icon, wrapClass, iconClass } = STATUS_MAP[status];

    return (
        <span
            className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium flex-shrink-0 ${wrapClass}`}
        >
            <Icon size={11} className={`${iconClass} sm:w-3 sm:h-3`} />
            {label}
        </span>
    );
}