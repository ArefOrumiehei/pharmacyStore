import DOMPurify from "dompurify";
import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Breadcrumb from "./_components/breadcrumb/Breadcrumb";
import CompetitiveAdvantages from "./_components/competitiveAdvantages/CompetitiveAdvantages";
import RatingStars from "./_components/RatingStars";
import { useProductStore } from "@/store/useProductsStore";
import { useCommentStore } from "@/store/useCommentsStore";
import { useUserStore } from "@/store/useAccountStore";
import { useCartStore } from "@/store/useCartStore";
import { useParams } from "react-router";
import {
    IconDotsVertical,
    IconFlag,
    IconHeart,
    IconHeartFilled,
    IconPencil,
    IconShare,
    IconStar,
    IconStarFilled,
    IconThumbDown,
    IconThumbDownFilled,
    IconThumbUp,
    IconThumbUpFilled,
    IconTrash,
    IconTruck,
    IconShoppingCart,
} from "@tabler/icons-react";

const IMAGE_BASE = "https://tk9839fd-5000.euw.devtunnels.ms/pictures/";

/* ---------------- TYPES ---------------- */
interface Comment {
    id: number;
    userId: number;
    username: string;
    message: string;
    rate: number;
    creationDate: string;
    likeCount: number;
    dislikeCount: number;
    likedByUserIds: number[];
    dislikedByUserIds: number[];
}

/* ---------------- HELPERS ---------------- */
const sanitize = (html: string) => DOMPurify.sanitize(html || "");

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function ProductPage() {
    const { fetchProductByName, product, addToFavorites, removeFromFavorites } =
        useProductStore();
    const {
        addNewComment,
        likeExistingComment,
        dislikeExistingComment,
        editExistingComment,
        deleteExistingComment,
    } = useCommentStore();
    const { user } = useUserStore();
    const { addToCart, loading: cartLoading, cart } = useCartStore();

    console.log(cart);

    const [message, setMessage] = useState("");
    const [rate, setRate] = useState(0);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null
    );
    const [isFavorite, setIsFavorite] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const { catgSlug, pSlug } = useParams<{
        catgSlug: string;
        pSlug: string;
    }>();
    const decodedCatgSlug = catgSlug ? decodeURIComponent(catgSlug) : "";

    const isLoaded = !!product;

    /* ── Effects ── */
    useEffect(() => {
        if (pSlug) fetchProductByName(`${catgSlug}/${pSlug}`);
    }, [catgSlug, pSlug]);

    useEffect(() => {
        if (product) {
            setComments(product.comments ?? []);
            setIsFavorite(!!product.currentUserFaved);
        }
    }, [product]);

    /* ── Handlers ── */
    const handleToggleFavorite = useCallback(
        async (productId: number) => {
            const prev = isFavorite;
            setIsFavorite(!prev);
            try {
                if (prev) {
                    await removeFromFavorites(productId);
                } else {
                    await addToFavorites(productId);
                }
            } catch {
                setIsFavorite(prev);
            }
        },
        [isFavorite, addToFavorites, removeFromFavorites]
    );

    const handleAddToCart = useCallback(async () => {
        if (!product) return;
        await addToCart(product.id, 1);
    }, [product, addToCart]);

    const handleSubmitComment = useCallback(async () => {
        if (!message.trim() || rate === 0) {
            alert("لطفا متن نظر و امتیاز را وارد کنید");
            return;
        }
        if (editingCommentId) {
            await editExistingComment(editingCommentId, message, rate);
        } else {
            await addNewComment({
                message,
                ownerRecordId: product.id,
                type: 1,
                rate,
            });
        }
        setMessage("");
        setRate(0);
        setEditingCommentId(null);
    }, [
        message,
        rate,
        editingCommentId,
        product,
        addNewComment,
        editExistingComment,
    ]);

    const handleEditComment = useCallback(
        (msg: string, r: number, id: number) => {
            setMessage(msg);
            setRate(r);
            setEditingCommentId(id);
        },
        []
    );

    const handleLikeComment = useCallback(
        async (commentId: number) => {
            setComments((prev) =>
                prev.map((c) => {
                    if (c.id !== commentId) return c;
                    const liked = c.likedByUserIds?.includes(user?.id);
                    return {
                        ...c,
                        likeCount: liked ? c.likeCount - 1 : c.likeCount + 1,
                        likedByUserIds: liked
                            ? c.likedByUserIds.filter((id) => id !== user?.id)
                            : [...(c.likedByUserIds ?? []), user?.id],
                        dislikeCount: c.dislikedByUserIds?.includes(user?.id)
                            ? c.dislikeCount - 1
                            : c.dislikeCount,
                        dislikedByUserIds: c.dislikedByUserIds?.filter(
                            (id) => id !== user?.id
                        ),
                    };
                })
            );
            await likeExistingComment(commentId);
        },
        [user, likeExistingComment]
    );

    const handleDislikeComment = useCallback(
        async (commentId: number) => {
            setComments((prev) =>
                prev.map((c) => {
                    if (c.id !== commentId) return c;
                    const disliked = c.dislikedByUserIds?.includes(user?.id);
                    return {
                        ...c,
                        dislikeCount: disliked
                            ? c.dislikeCount - 1
                            : c.dislikeCount + 1,
                        dislikedByUserIds: disliked
                            ? c.dislikedByUserIds.filter(
                                (id) => id !== user?.id
                            )
                            : [...(c.dislikedByUserIds ?? []), user?.id],
                        likeCount: c.likedByUserIds?.includes(user?.id)
                            ? c.likeCount - 1
                            : c.likeCount,
                        likedByUserIds: c.likedByUserIds?.filter(
                            (id) => id !== user?.id
                        ),
                    };
                })
            );
            await dislikeExistingComment(commentId);
        },
        [user, dislikeExistingComment]
    );

    /* ── Render ── */
    return (
        <div className="flex flex-col gap-6 w-full py-8" dir="rtl">
            <Breadcrumb categories={decodedCatgSlug} />

            {/* ═══ TOP SECTION ═══ */}
            <div className="flex items-stretch flex-col lg:flex-row gap-4 w-full">
                {/* Product Image */}
                <div className="flex-shrink-0 flex items-center justify-center lg:w-80 xl:w-96 rounded-2xl border border-neutral-200 bg-white/70 overflow-hidden">
                    {isLoaded ? (
                        <img
                            src={`${IMAGE_BASE}${product.picture}`}
                            alt={product.pictureAlt}
                            className="w-full h-full object-contain p-4"
                        />
                    ) : (
                        <Skeleton className="w-full h-80 rounded-2xl" />
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between flex-1 py-5 px-6 rounded-2xl border border-neutral-200 bg-white/70">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-4">
                        {isLoaded ? (
                            <h1 className="text-xl font-bold text-gray-900 leading-relaxed">
                                {product.name}
                            </h1>
                        ) : (
                            <Skeleton className="h-6 w-64" />
                        )}

                        {isLoaded && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <ActionIcon title="اشتراک‌گذاری">
                                    <IconShare size={20} />
                                </ActionIcon>
                                <ActionIcon
                                    title="افزودن به علاقه‌مندی‌ها"
                                    onClick={() =>
                                        handleToggleFavorite(product.id)
                                    }
                                >
                                    {isFavorite ? (
                                        <IconHeartFilled
                                            size={20}
                                            className="text-rose-500"
                                        />
                                    ) : (
                                        <IconHeart size={20} />
                                    )}
                                </ActionIcon>
                            </div>
                        )}
                    </div>

                    <Separator className="my-4" />

                    {/* Meta */}
                    <div className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center justify-between">
                            {isLoaded ? (
                                <span className="text-xs text-neutral-400">
                                    کد محصول: {product.code}
                                </span>
                            ) : (
                                <Skeleton className="h-3 w-24" />
                            )}

                            {isLoaded ? (
                                <div className="flex items-center gap-1">
                                    <IconStarFilled
                                        size={14}
                                        className="text-amber-400"
                                    />
                                    <span className="font-semibold text-sm">
                                        {product.avgRate.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-neutral-400">
                                        ({product.rateCount})
                                    </span>
                                </div>
                            ) : (
                                <Skeleton className="h-3 w-20" />
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <MetaRow
                                label="دسته‌بندی"
                                isLoaded={isLoaded}
                                value={product?.categoryName}
                            />
                            <MetaRow
                                label="برند"
                                isLoaded={isLoaded}
                                value={product?.brand}
                            />
                        </div>

                        {isLoaded && (
                            <div className="flex items-center gap-2 mt-1">
                                <Separator className="flex-1" />
                                <a
                                    href="#specifications"
                                    className="text-xs text-blue-500 hover:underline whitespace-nowrap mx-1"
                                >
                                    مشاهده تمام ویژگی‌ها
                                </a>
                                <Separator className="flex-1" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Purchase Panel */}
                <div className="flex flex-col justify-between gap-4 py-5 px-6 rounded-2xl border border-neutral-200 bg-white/70 lg:w-64">
                    {/* Price */}
                    {isLoaded ? (
                        <div>
                            {product.hasDiscount ? (
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm line-through text-neutral-400">
                                        {product.price} تومان
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-rose-500">
                                            {product.priceWithDiscount} تومان
                                        </span>
                                        <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                            {product.discountRate}٪
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-xl font-bold text-gray-800">
                                    {product.price} تومان
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-6 w-36" />
                        </div>
                    )}

                    {/* Add to Cart */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={
                                cartLoading || !isLoaded || !product?.isInStock
                            }
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150"
                        >
                            {cartLoading ? (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <IconShoppingCart size={18} />
                                    <span>
                                        {isLoaded && !product.isInStock
                                            ? "ناموجود"
                                            : "افزودن به سبد خرید"}
                                    </span>
                                </>
                            )}
                        </button>

                        {isLoaded && product.isInStock && (
                            <div className="flex items-center gap-2 text-xs text-green-700">
                                <IconTruck
                                    size={16}
                                    className="text-green-600 flex-shrink-0"
                                />
                                <span className="font-medium">
                                    موجود در انبار
                                </span>
                                <span className="text-neutral-400">
                                    | ارسال پست
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ COMPETITIVE ADVANTAGES ═══ */}
            <CompetitiveAdvantages />

            {/* ═══ SPECIFICATIONS ═══ */}
            {isLoaded ? (
                <Card
                    className="rounded-2xl border border-neutral-200 bg-white/70 shadow-none"
                    id="specifications"
                >
                    <CardContent className="p-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            مشخصات محصول
                        </h2>
                        <div
                            className="w-full overflow-x-auto rounded-xl"
                            dangerouslySetInnerHTML={{
                                __html: sanitize(product.specifications),
                            }}
                        />
                    </CardContent>
                </Card>
            ) : (
                <SpecificationsSkeleton />
            )}

            {/* ═══ TABS ═══ */}
            {isLoaded && (
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full flex justify-center gap-2 bg-neutral-100/80 rounded-xl p-1">
                        <TabsTrigger
                            value="description"
                            className="flex-1 text-sm font-medium px-6 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                        >
                            معرفی محصول
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="flex-1 text-sm font-medium px-6 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                        >
                            نظرات کاربران ({comments.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Description */}
                    <TabsContent value="description">
                        <Card className="rounded-2xl border border-neutral-200 bg-white/70 shadow-none mt-3">
                            <CardContent className="p-6 leading-8 text-neutral-700">
                                <div
                                    className="prose prose-rtl max-w-full"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitize(product.description),
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reviews */}
                    <TabsContent value="reviews" className="space-y-4 mt-3">
                        {/* Comment Form */}
                        <Card className="rounded-2xl border border-neutral-200 bg-white/70 shadow-none">
                            <CardContent className="p-6 flex flex-col gap-4">
                                <h3 className="text-base font-bold text-gray-800">
                                    {editingCommentId
                                        ? "ویرایش نظر"
                                        : "ثبت نظر جدید"}
                                </h3>

                                <RatingStars rate={rate} setRate={setRate} />

                                <textarea
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none placeholder-gray-400 transition"
                                    rows={4}
                                    placeholder="نظر خود را بنویسید..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />

                                <div className="flex gap-2">
                                    {editingCommentId && (
                                        <button
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setMessage("");
                                                setRate(0);
                                            }}
                                            className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 transition"
                                        >
                                            انصراف
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSubmitComment}
                                        disabled={!message.trim() || rate === 0}
                                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white text-sm font-semibold transition-all duration-150"
                                    >
                                        {editingCommentId
                                            ? "ذخیره تغییرات"
                                            : "ارسال نظر"}
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comment List */}
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-400 py-8 text-sm">
                                هنوز نظری ثبت نشده است.
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                    currentUserId={user?.id}
                                    onLike={() => handleLikeComment(comment.id)}
                                    onDislike={() =>
                                        handleDislikeComment(comment.id)
                                    }
                                    onEdit={() =>
                                        handleEditComment(
                                            comment.message,
                                            comment.rate,
                                            comment.id
                                        )
                                    }
                                    onDelete={() =>
                                        deleteExistingComment(comment.id)
                                    }
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}

/* =============SUB-COMPONENTS================= */

function ActionIcon({
    children,
    onClick,
    title,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className="flex items-center justify-center w-9 h-9 bg-neutral-100 hover:bg-sky-100 rounded-lg transition-all duration-200 active:scale-90"
        >
            {children}
        </button>
    );
}

function MetaRow({
    label,
    value,
    isLoaded,
}: {
    label: string;
    value?: string;
    isLoaded: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-neutral-500 text-xs">{label}:</span>
            {isLoaded ? (
                <span className="text-xs font-medium text-blue-500 cursor-pointer hover:underline">
                    {value}
                </span>
            ) : (
                <Skeleton className="h-3 w-20" />
            )}
        </div>
    );
}

function CommentCard({
    comment,
    currentUserId,
    onLike,
    onDislike,
    onEdit,
    onDelete,
}: {
    comment: Comment;
    currentUserId?: number;
    onLike: () => void;
    onDislike: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isOwner = currentUserId === comment.userId;
    const liked = comment.likedByUserIds?.includes(currentUserId!);
    const disliked = comment.dislikedByUserIds?.includes(currentUserId!);

    return (
        <Card className="rounded-2xl border border-neutral-100 bg-white/80 shadow-none hover:shadow-sm transition-shadow duration-200">
            <CardContent className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors duration-200">
                                <IconDotsVertical
                                    size={18}
                                    className="text-neutral-400"
                                />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-max p-1.5 rounded-xl shadow-lg border border-neutral-100">
                            <div className="flex flex-col">
                                <PopoverItem
                                    icon={<IconFlag size={16} />}
                                    label="گزارش"
                                />
                                {isOwner && (
                                    <>
                                        <PopoverItem
                                            icon={<IconPencil size={16} />}
                                            label="ویرایش"
                                            onClick={onEdit}
                                            variant="blue"
                                        />
                                        <PopoverItem
                                            icon={<IconTrash size={16} />}
                                            label="حذف"
                                            onClick={onDelete}
                                            variant="red"
                                        />
                                    </>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-800">
                            {comment.username}
                        </span>
                        <span className="text-xs text-neutral-400">
                            {comment.creationDate}
                        </span>
                    </div>
                </div>

                {/* Stars + Message */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IconStar
                                key={i}
                                size={15}
                                className={
                                    i < comment.rate
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-200 fill-gray-200"
                                }
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.message}
                    </p>
                </div>

                {/* Like / Dislike */}
                <div className="flex items-center gap-4 pt-1 border-t border-neutral-100">
                    <VoteButton
                        onClick={onLike}
                        active={liked}
                        count={comment.likeCount}
                        activeClass="text-emerald-500"
                        icon={
                            liked ? (
                                <IconThumbUpFilled size={17} />
                            ) : (
                                <IconThumbUp size={17} />
                            )
                        }
                    />
                    <VoteButton
                        onClick={onDislike}
                        active={disliked}
                        count={comment.dislikeCount}
                        activeClass="text-rose-500"
                        icon={
                            disliked ? (
                                <IconThumbDownFilled size={17} />
                            ) : (
                                <IconThumbDown size={17} />
                            )
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function PopoverItem({
    icon,
    label,
    onClick,
    variant,
}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    variant?: "blue" | "red";
}) {
    const color =
        variant === "blue"
            ? "hover:bg-blue-50 text-blue-600"
            : variant === "red"
            ? "hover:bg-red-50 text-red-600"
            : "hover:bg-neutral-100 text-neutral-600";

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${color}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function VoteButton({
    icon,
    count,
    active,
    activeClass,
    onClick,
}: {
    icon: React.ReactNode;
    count: number;
    active?: boolean;
    activeClass: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${
                active ? activeClass : "text-neutral-400 hover:text-neutral-600"
            }`}
        >
            {icon}
            <span className="font-medium">{count}</span>
        </button>
    );
}

function SpecificationsSkeleton() {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 space-y-3">
            <Skeleton className="h-5 w-36 mb-4" />
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-2/4" />
                </div>
            ))}
        </div>
    );
}
