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
    IconPackage,
    IconPercentage,
} from "@tabler/icons-react";

const IMAGE_BASE = "https://tk9839fd-5000.euw.devtunnels.ms/pictures/";

/* ── Types ── */
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

const sanitize = (html: string) => DOMPurify.sanitize(html ?? "");

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
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
    const { addToCart, loading: cartLoading } = useCartStore();

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
        if (editingCommentId !== null) {
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

    const handleCancelEdit = useCallback(() => {
        setEditingCommentId(null);
        setMessage("");
        setRate(0);
    }, []);

    const handleLikeComment = useCallback(
        async (commentId: number) => {
            if (!user?.id) return;
            setComments((prev) =>
                prev.map((c) => {
                    if (c.id !== commentId) return c;
                    const liked = c.likedByUserIds?.includes(user.id);
                    return {
                        ...c,
                        likeCount: liked ? c.likeCount - 1 : c.likeCount + 1,
                        likedByUserIds: liked
                            ? c.likedByUserIds.filter((id) => id !== user.id)
                            : [...(c.likedByUserIds ?? []), user.id],
                        dislikeCount: c.dislikedByUserIds?.includes(user.id)
                            ? c.dislikeCount - 1
                            : c.dislikeCount,
                        dislikedByUserIds: c.dislikedByUserIds?.filter(
                            (id) => id !== user.id
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
            if (!user?.id) return;
            setComments((prev) =>
                prev.map((c) => {
                    if (c.id !== commentId) return c;
                    const disliked = c.dislikedByUserIds?.includes(user.id);
                    return {
                        ...c,
                        dislikeCount: disliked
                            ? c.dislikeCount - 1
                            : c.dislikeCount + 1,
                        dislikedByUserIds: disliked
                            ? c.dislikedByUserIds.filter((id) => id !== user.id)
                            : [...(c.dislikedByUserIds ?? []), user.id],
                        likeCount: c.likedByUserIds?.includes(user.id)
                            ? c.likeCount - 1
                            : c.likeCount,
                        likedByUserIds: c.likedByUserIds?.filter(
                            (id) => id !== user.id
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
            {/* Breadcrumb */}
            <Breadcrumb categories={decodedCatgSlug} />

            {/* ═══ TOP SECTION ═══ */}
            <div className="flex items-stretch flex-col lg:flex-row gap-4 w-full">
                {/* Image */}
                <div className="flex-shrink-0 flex items-center justify-center lg:w-80 xl:w-96 min-h-72 rounded-2xl border border-blue-100 bg-white overflow-hidden">
                    {isLoaded ? (
                        <img
                            src={`${IMAGE_BASE}${product.picture}`}
                            alt={product.pictureAlt}
                            className="w-full h-full object-contain p-6"
                        />
                    ) : (
                        <Skeleton className="w-full h-80" />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 py-5 px-6 rounded-2xl border border-blue-100 bg-white">
                    {/* Title + actions */}
                    <div className="flex items-start justify-between gap-4">
                        {isLoaded ? (
                            <h1 className="text-xl font-bold text-blue-800 leading-relaxed">
                                {product.name}
                            </h1>
                        ) : (
                            <Skeleton className="h-7 w-64" />
                        )}
                        {isLoaded && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <ActionIcon title="اشتراک‌گذاری">
                                    <IconShare
                                        size={17}
                                        className="text-gray-400"
                                    />
                                </ActionIcon>
                                <ActionIcon
                                    title="افزودن به علاقه‌مندی‌ها"
                                    onClick={() =>
                                        handleToggleFavorite(product.id)
                                    }
                                >
                                    {isFavorite ? (
                                        <IconHeartFilled
                                            size={17}
                                            className="text-rose-500"
                                        />
                                    ) : (
                                        <IconHeart
                                            size={17}
                                            className="text-gray-400"
                                        />
                                    )}
                                </ActionIcon>
                            </div>
                        )}
                    </div>

                    <Separator className="my-4 bg-blue-50" />

                    {/* Meta */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            {isLoaded ? (
                                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                                    کد محصول: {product.code}
                                </span>
                            ) : (
                                <Skeleton className="h-6 w-28" />
                            )}

                            {isLoaded ? (
                                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                                    <IconStarFilled
                                        size={13}
                                        className="text-amber-400"
                                    />
                                    <span className="font-bold text-sm text-amber-700">
                                        {product.avgRate.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-amber-400">
                                        ({product.rateCount} نظر)
                                    </span>
                                </div>
                            ) : (
                                <Skeleton className="h-6 w-24" />
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
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
                                <Separator className="flex-1 bg-blue-50" />
                                <a
                                    href="#specifications"
                                    className="text-xs text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                                >
                                    مشاهده تمام ویژگی‌ها
                                </a>
                                <Separator className="flex-1 bg-blue-50" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Purchase panel */}
                <div className="flex flex-col justify-between gap-5 py-5 px-6 rounded-2xl border border-blue-100 bg-white lg:w-64">
                    {/* Price */}
                    {isLoaded ? (
                        <div className="flex flex-col gap-1.5">
                            {product.hasDiscount ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm line-through text-gray-400">
                                            {product.price} تومان
                                        </span>
                                        <div className="flex items-center gap-0.5 bg-rose-50 border border-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                                            <IconPercentage size={11} />
                                            {product.discountRate}٪
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-blue-800">
                                            {product.priceWithDiscount}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            تومان
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-blue-800">
                                        {product.price}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        تومان
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-7 w-36" />
                        </div>
                    )}

                    {/* Stock + Cart */}
                    <div className="flex flex-col gap-3">
                        {isLoaded ? (
                            <div
                                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ${
                                    product.isInStock
                                        ? "bg-green-50 border-green-100 text-green-700"
                                        : "bg-gray-50 border-gray-100 text-gray-400"
                                }`}
                            >
                                {product.isInStock ? (
                                    <IconTruck
                                        size={14}
                                        className="text-green-600 flex-shrink-0"
                                    />
                                ) : (
                                    <IconPackage
                                        size={14}
                                        className="text-gray-400 flex-shrink-0"
                                    />
                                )}
                                <span className="font-medium">
                                    {product.isInStock
                                        ? "موجود در انبار"
                                        : "ناموجود"}
                                </span>
                                {product.isInStock && (
                                    <span className="text-gray-400 mr-auto">
                                        ارسال پست
                                    </span>
                                )}
                            </div>
                        ) : (
                            <Skeleton className="h-8 w-full rounded-xl" />
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={
                                cartLoading || !isLoaded || !product?.isInStock
                            }
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
                        >
                            {cartLoading ? (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <IconShoppingCart size={17} />
                                    <span>
                                        {isLoaded && !product.isInStock
                                            ? "ناموجود"
                                            : "افزودن به سبد خرید"}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ COMPETITIVE ADVANTAGES ═══ */}
            <CompetitiveAdvantages />

            {/* ═══ SPECIFICATIONS ═══ */}
            {isLoaded ? (
                <Card
                    id="specifications"
                    className="rounded-2xl border border-blue-100 bg-white shadow-none"
                >
                    <CardContent className="p-6">
                        <SectionTitle>مشخصات محصول</SectionTitle>
                        <div
                            className="w-full overflow-x-auto rounded-xl mt-4"
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
            {isLoaded ? (
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="w-full flex justify-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-1 h-auto">
                        <TabsTrigger
                            value="description"
                            className="flex-1 text-sm font-medium px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-100 text-gray-400 transition-all duration-200"
                        >
                            معرفی محصول
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="flex-1 text-sm font-medium px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-100 text-gray-400 transition-all duration-200"
                        >
                            نظرات کاربران ({comments.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Description tab */}
                    <TabsContent value="description">
                        <Card className="rounded-2xl border border-blue-100 bg-white shadow-none mt-3">
                            <CardContent className="p-6 leading-8 text-gray-700">
                                <div
                                    className="prose prose-rtl max-w-full"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitize(product.description),
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reviews tab */}
                    <TabsContent value="reviews" className="space-y-4 mt-3">
                        {/* Comment form */}
                        <Card className="rounded-2xl border border-blue-100 bg-white shadow-none">
                            <CardContent className="p-6 flex flex-col gap-4">
                                <SectionTitle>
                                    {editingCommentId !== null
                                        ? "ویرایش نظر"
                                        : "ثبت نظر جدید"}
                                </SectionTitle>

                                <RatingStars rate={rate} setRate={setRate} />

                                <textarea
                                    className="w-full border border-blue-100 bg-blue-50/30 rounded-xl p-3 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none placeholder-gray-400 transition-all duration-200"
                                    rows={4}
                                    placeholder="نظر خود را بنویسید..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />

                                <div className="flex gap-2">
                                    {editingCommentId !== null && (
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            انصراف
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSubmitComment}
                                        disabled={!message.trim() || rate === 0}
                                        className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white text-sm font-semibold transition-all duration-150"
                                    >
                                        {editingCommentId !== null
                                            ? "ذخیره تغییرات"
                                            : "ارسال نظر"}
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comment list */}
                        {comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                    <IconStar
                                        size={24}
                                        className="text-blue-300"
                                    />
                                </div>
                                <p className="text-gray-400 text-sm">
                                    هنوز نظری ثبت نشده است.
                                </p>
                                <p className="text-gray-300 text-xs">
                                    اولین نفری باشید که نظر می‌دهد!
                                </p>
                            </div>
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
            ) : (
                <TabsSkeleton />
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
            {children}
        </h2>
    );
}

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
            className="flex items-center justify-center w-9 h-9 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all duration-200 active:scale-90"
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
            <span className="text-gray-400 text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md flex-shrink-0">
                {label}
            </span>
            {isLoaded ? (
                <span className="text-xs font-medium text-blue-800 hover:text-blue-600 cursor-pointer hover:underline transition-colors">
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
        <Card className="rounded-2xl border border-blue-100 bg-white shadow-none hover:shadow-sm hover:border-blue-200 transition-all duration-200">
            <CardContent className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    {/* Username + date */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold flex-shrink-0">
                            {comment.username?.[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm text-gray-800">
                                {comment.username}
                            </span>
                            <span className="text-xs text-gray-400">
                                {comment.creationDate}
                            </span>
                        </div>
                    </div>

                    {/* Options popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                                <IconDotsVertical
                                    size={17}
                                    className="text-gray-400"
                                />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-max p-1.5 rounded-xl shadow-lg border border-blue-100"
                            align="end"
                        >
                            <div className="flex flex-col">
                                <PopoverItem
                                    icon={<IconFlag size={15} />}
                                    label="گزارش"
                                />
                                {isOwner && (
                                    <>
                                        <PopoverItem
                                            icon={<IconPencil size={15} />}
                                            label="ویرایش"
                                            onClick={onEdit}
                                            variant="blue"
                                        />
                                        <PopoverItem
                                            icon={<IconTrash size={15} />}
                                            label="حذف"
                                            onClick={onDelete}
                                            variant="red"
                                        />
                                    </>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <IconStar
                            key={i}
                            size={14}
                            className={
                                i < comment.rate
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200 fill-gray-200"
                            }
                        />
                    ))}
                </div>

                {/* Message */}
                <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.message}
                </p>

                {/* Like / Dislike */}
                <div className="flex items-center gap-4 pt-2 border-t border-blue-50">
                    <VoteButton
                        onClick={onLike}
                        active={liked}
                        count={comment.likeCount}
                        activeClass="text-emerald-600"
                        icon={
                            liked ? (
                                <IconThumbUpFilled size={15} />
                            ) : (
                                <IconThumbUp size={15} />
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
                                <IconThumbDownFilled size={15} />
                            ) : (
                                <IconThumbDown size={15} />
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
            ? "hover:bg-blue-50 text-blue-800"
            : variant === "red"
            ? "hover:bg-red-50 text-red-600"
            : "hover:bg-gray-50 text-gray-600";

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
                active ? activeClass : "text-gray-400 hover:text-gray-600"
            }`}
        >
            {icon}
            <span className="font-medium tabular-nums">{count}</span>
        </button>
    );
}

function SpecificationsSkeleton() {
    return (
        <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3">
            <Skeleton className="h-5 w-36 mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-2/4" />
                </div>
            ))}
        </div>
    );
}

function TabsSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-3">
                <Skeleton className="h-5 w-32 mb-2" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
                    />
                ))}
            </div>
        </div>
    );
}
