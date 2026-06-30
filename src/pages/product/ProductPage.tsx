import DOMPurify from "dompurify";
import { useEffect, useState, useCallback, useRef } from "react";
import Breadcrumb from "./_components/breadcrumb/Breadcrumb";
import CompetitiveAdvantages from "./_components/competitiveAdvantages/CompetitiveAdvantages";
import RatingStars from "./_components/RatingStars";
import { useProductStore } from "@/store/useProductsStore";
import { useCommentStore } from "@/store/useCommentsStore";
import { useUserStore } from "@/store/useAccountStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams, Link } from "react-router";
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
  IconCheck,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconBuildingStore,
} from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import { toPersianDigits } from "smart-persian-tools";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ProductPage() {
  const { fetchProductByName, product, addToFavorites, removeFromFavorites } = useProductStore();
  const { addNewComment, likeExistingComment, dislikeExistingComment, editExistingComment, deleteExistingComment } = useCommentStore();
  const { user } = useUserStore();
  const { addToCart, addToGuestCart, loading: cartLoading } = useCartStore();
  const { accessToken } = useAuthStore();

  const [activeTab, setActiveTab]               = useState<"description" | "reviews">("description");
  const [message, setMessage]                   = useState("");
  const [rate, setRate]                         = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite]             = useState(false);
  const [addedToCart, setAddedToCart]           = useState(false);
  const [comments, setComments]                 = useState<Comment[]>([]);
  const [activeImage, setActiveImage]           = useState(0);

  const { catgSlug, pSlug } = useParams<{ catgSlug: string; pSlug: string }>();
  const decodedCatgSlug     = catgSlug ? decodeURIComponent(catgSlug) : "";
  const isLoaded            = !!product;

  /* ── Effects ── */
  useEffect(() => {
    if (pSlug) fetchProductByName(`${catgSlug}/${pSlug}`);
  }, [catgSlug, pSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (product) {
      setComments(product?.comments);
      setIsFavorite(!!product.isCurrentUserFaved);
      setActiveImage(0);
    }
  }, [product]);

  /* ── Handlers ── */
  const handleToggleFavorite = useCallback(async (productId: number) => {
    const prev = isFavorite;
    setIsFavorite(!prev);
    try {
      if (prev) await removeFromFavorites(productId);
      else      await addToFavorites(productId);
    } catch {
      setIsFavorite(prev);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    if (!accessToken) {
      addToGuestCart({
        productId:   product.id,
        productName: product.name,
        picture:     product.picture,
        unitPrice:   Number(product.priceWithDiscount ?? product.price),
        qty:         1,
      });
    } else {
      await addToCart(product.id, 1);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [product, accessToken, addToCart, addToGuestCart]);

  const handleSubmitComment = useCallback(async () => {
    if (!message.trim() || rate === 0) return;
    if (editingCommentId !== null) {
      await editExistingComment(editingCommentId, message, rate);
    } else {
      await addNewComment({ message, ownerRecordId: product.id, type: 1, rate });
    }
    setMessage("");
    setRate(0);
    setEditingCommentId(null);
  }, [message, rate, editingCommentId, product, addNewComment, editExistingComment]);

  const handleEditComment   = useCallback((msg: string, r: number, id: number) => { setMessage(msg); setRate(r); setEditingCommentId(id); setActiveTab("reviews"); }, []);
  const handleCancelEdit    = useCallback(() => { setEditingCommentId(null); setMessage(""); setRate(0); }, []);

  const handleLikeComment = useCallback(async (commentId: number) => {
    if (!user?.id) return;
    setComments((prev) => prev.map((c) => {
      if (c.id !== commentId) return c;
      const liked = c.likedByUserIds?.includes(user.id);
      return {
        ...c,
        likeCount:         liked ? c.likeCount - 1 : c.likeCount + 1,
        likedByUserIds:    liked ? c.likedByUserIds.filter((id) => id !== user.id) : [...(c.likedByUserIds ?? []), user.id],
        dislikeCount:      c.dislikedByUserIds?.includes(user.id) ? c.dislikeCount - 1 : c.dislikeCount,
        dislikedByUserIds: c.dislikedByUserIds?.filter((id) => id !== user.id),
      };
    }));
    await likeExistingComment(commentId);
  }, [user, likeExistingComment]);

  const handleDislikeComment = useCallback(async (commentId: number) => {
    if (!user?.id) return;
    setComments((prev) => prev.map((c) => {
      if (c.id !== commentId) return c;
      const disliked = c.dislikedByUserIds?.includes(user.id);
      return {
        ...c,
        dislikeCount:      disliked ? c.dislikeCount - 1 : c.dislikeCount + 1,
        dislikedByUserIds: disliked ? c.dislikedByUserIds.filter((id) => id !== user.id) : [...(c.dislikedByUserIds ?? []), user.id],
        likeCount:         c.likedByUserIds?.includes(user.id) ? c.likeCount - 1 : c.likeCount,
        likedByUserIds:    c.likedByUserIds?.filter((id) => id !== user.id),
      };
    }));
    await dislikeExistingComment(commentId);
  }, [user, dislikeExistingComment]);

  // All images: main + extra pictures
  const allImages = product
    ? [{ picture: product.picture, pictureAlt: product.pictureAlt }, ...(product.pictures ?? []).filter((p: { isRemoved: boolean }) => !p.isRemoved)]
    : [];

  const displayPrice = product?.hasDiscount ? product.priceWithDiscount : product?.price;

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-6 w-full py-6" dir="rtl">
      <Breadcrumb categories={decodedCatgSlug} />

      {/* ══ TOP SECTION ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_280px] gap-4">

        {/* ── Image gallery ── */}
        <div className="flex flex-col gap-3 lg:w-80 xl:w-96">
          {/* Main image */}
          <div className="relative w-full aspect-square rounded-2xl border border-blue-100 bg-white overflow-hidden flex items-center justify-center">
            {isLoaded ? (
              <>
                <img
                  key={activeImage}
                  src={`${IMAGE_BASE}${allImages[activeImage]?.picture ?? product.picture}`}
                  alt={allImages[activeImage]?.pictureAlt ?? product.pictureAlt}
                  className="w-4/5 h-4/5 object-contain transition-opacity duration-300"
                  loading="eager"
                />
                {/* Discount badge */}
                {product.hasDiscount && (
                  <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <IconPercentage size={11} />
                    {product.discountRate}٪
                  </div>
                )}
                {/* Nav arrows when multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((p) => Math.max(0, p - 1))}
                      disabled={activeImage === 0}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 hover:bg-white border border-blue-100 flex items-center justify-center shadow-sm disabled:opacity-30 transition-all"
                    >
                      <IconChevronRight size={16} className="text-blue-800" />
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => Math.min(allImages.length - 1, p + 1))}
                      disabled={activeImage === allImages.length - 1}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 hover:bg-white border border-blue-100 flex items-center justify-center shadow-sm disabled:opacity-30 transition-all"
                    >
                      <IconChevronLeft size={16} className="text-blue-800" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-blue-50 animate-pulse" />
            )}
          </div>

          {/* Thumbnail strip */}
          {isLoaded && allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-white transition-all duration-150 ${
                    activeImage === i ? "border-blue-800 shadow-sm" : "border-blue-100 hover:border-blue-300"
                  }`}
                >
                  <img
                    src={`${IMAGE_BASE}${img.picture}`}
                    alt={img.pictureAlt}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="flex flex-col gap-4 bg-white rounded-2xl border border-blue-100 p-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            {isLoaded ? (
              <h1 className="text-xl font-bold text-gray-900 leading-relaxed flex-1">{product.name}</h1>
            ) : (
              <div className="h-7 w-64 bg-blue-50 animate-pulse rounded flex-1" />
            )}
            {isLoaded && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  title="اشتراک‌گذاری"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all active:scale-90"
                >
                  <IconShare size={16} className="text-gray-400" />
                </button>
                <button
                  title="افزودن به علاقه‌مندی‌ها"
                  onClick={() => handleToggleFavorite(product.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all active:scale-90"
                >
                  {isFavorite
                    ? <IconHeartFilled size={16} className="text-rose-500" />
                    : <IconHeart size={16} className="text-gray-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Rating + code row */}
          {isLoaded ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl">
                <IconStarFilled size={13} className="text-amber-400" />
                <span className="font-bold text-sm text-amber-700">{Number(product.avgRate).toFixed(1)}</span>
                <span className="text-xs text-amber-400">({toPersianDigits(product.rateCount)} نظر)</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-xl">
                کد: {product.code}
              </span>
              {!product.isInStock && (
                <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-xl font-medium">
                  ناموجود
                </span>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="h-7 w-28 bg-blue-50 animate-pulse rounded-xl" />
              <div className="h-7 w-20 bg-blue-50 animate-pulse rounded-xl" />
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-blue-50" />

          {/* Meta: category + brand */}
          {isLoaded ? (
            <div className="flex flex-col gap-2.5">
              <MetaRow label="دسته‌بندی" value={product.categoryName} />
              <MetaRow
                label="برند"
                value={product.brand}
                href={product.brand ? `/brand/${product.brand}` : undefined}
                icon={<IconBuildingStore size={12} className="text-blue-400" />}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-48 bg-blue-50 animate-pulse rounded" />
              <div className="h-5 w-36 bg-blue-50 animate-pulse rounded" />
            </div>
          )}

          {/* Short description */}
          {isLoaded && product.shortDescription && (
            <>
              <div className="h-px bg-blue-50" />
              <p className="text-sm text-gray-500 leading-7">{product.shortDescription}</p>
            </>
          )}

          {/* Jump to specs */}
          {isLoaded && (
            <div className="mt-auto pt-2">
              <a
                href="#specifications"
                className="inline-flex items-center gap-1.5 text-xs text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200"
              >
                مشاهده مشخصات کامل
                <IconChevronLeft size={12} />
              </a>
            </div>
          )}
        </div>

        {/* ── Purchase panel ── */}
        <div className="flex flex-col gap-4 bg-white rounded-2xl border border-blue-100 p-5">
          {/* Price */}
          {isLoaded ? (
            <div className="flex flex-col gap-1">
              {product.hasDiscount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 line-through">
                    {toPersianDigits(Number(product.price))} تومان
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                    <IconPercentage size={10} />
                    {product.discountRate}٪ تخفیف
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-blue-800">
                  {toPersianDigits(Number(displayPrice))}
                </span>
                <span className="text-sm text-gray-400">تومان</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-blue-50 animate-pulse rounded" />
              <div className="h-8 w-40 bg-blue-50 animate-pulse rounded" />
            </div>
          )}

          <div className="h-px bg-blue-50" />

          {/* Stock status */}
          {isLoaded ? (
            <div className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border font-medium ${
              product.isInStock
                ? "bg-green-50 border-green-100 text-green-700"
                : "bg-gray-50 border-gray-100 text-gray-400"
            }`}>
              {product.isInStock
                ? <IconTruck size={15} className="text-green-600 flex-shrink-0" />
                : <IconPackage size={15} className="text-gray-400 flex-shrink-0" />}
              <span>{product.isInStock ? "موجود در انبار" : "ناموجود"}</span>
              {product.isInStock && <span className="text-gray-400 mr-auto">ارسال پست</span>}
            </div>
          ) : (
            <div className="h-10 bg-blue-50 animate-pulse rounded-xl" />
          )}

          {/* Add to cart */}
          {isLoaded ? (
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || !product.isInStock}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
                addedToCart
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : product.isInStock
                  ? "bg-blue-800 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 disabled:opacity-50"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {cartLoading ? (
                <IconLoader2 size={17} className="animate-spin" />
              ) : addedToCart ? (
                <><IconCheck size={17} /><span>افزوده شد</span></>
              ) : (
                <><IconShoppingCart size={17} /><span>{product.isInStock ? "افزودن به سبد خرید" : "ناموجود"}</span></>
              )}
            </button>
          ) : (
            <div className="h-12 bg-blue-50 animate-pulse rounded-xl" />
          )}

          {/* Delivery info pills */}
          {isLoaded && product.isInStock && (
            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <IconTruck size={13} className="text-blue-400 flex-shrink-0" />
                ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <IconPackage size={13} className="text-blue-400 flex-shrink-0" />
                ضمانت اصالت کالا
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ COMPETITIVE ADVANTAGES ══ */}
      <CompetitiveAdvantages />

      {/* ══ SPECIFICATIONS ══ */}
      {isLoaded ? (
        <div id="specifications" className="bg-white rounded-2xl border border-blue-100 p-6">
          <SectionTitle>مشخصات محصول</SectionTitle>
          <div
            className="w-full overflow-x-auto mt-4 text-sm text-gray-700 leading-7"
            dangerouslySetInnerHTML={{ __html: sanitize(product.specifications ?? "") }}
          />
        </div>
      ) : (
        <SpecificationsSkeleton />
      )}

      {/* ══ TABS ══ */}
      {isLoaded ? (
        <div className="flex flex-col gap-4">
          {/* Tab bar */}
          <div className="flex bg-blue-50 border border-blue-100 rounded-2xl p-1 gap-1">
            {(["description", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-blue-800 shadow-sm border border-blue-100"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "description" ? "معرفی محصول" : `نظرات کاربران (${toPersianDigits(comments.length)})`}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === "description" && (
            <div className="bg-white rounded-2xl border border-blue-100 p-6">
              <div
                className="prose prose-rtl max-w-full text-sm text-gray-700 leading-8"
                dangerouslySetInnerHTML={{ __html: sanitize(product.description ?? "") }}
              />
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-4">
              {/* Comment form */}
              <div className="bg-white rounded-2xl border border-blue-100 p-6 flex flex-col gap-4">
                <SectionTitle>{editingCommentId !== null ? "ویرایش نظر" : "ثبت نظر جدید"}</SectionTitle>
                <RatingStars rate={rate} setRate={setRate} />
                <textarea
                  className="w-full border border-blue-100 bg-blue-50/30 rounded-xl p-3 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none placeholder-gray-400 transition-all duration-200 leading-7"
                  rows={4}
                  placeholder="نظر خود را بنویسید..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex gap-2">
                  {editingCommentId !== null && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      انصراف
                    </button>
                  )}
                  <button
                    onClick={handleSubmitComment}
                    disabled={!message.trim() || rate === 0}
                    className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white text-sm font-semibold transition-all"
                  >
                    {editingCommentId !== null ? "ذخیره تغییرات" : "ارسال نظر"}
                  </button>
                </div>
              </div>

              {/* Comment list */}
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-blue-100">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <IconStar size={24} className="text-blue-300" />
                  </div>
                  <p className="text-gray-400 text-sm">هنوز نظری ثبت نشده است</p>
                  <p className="text-gray-300 text-xs">اولین نفری باشید که نظر می‌دهد!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    currentUserId={user?.id}
                    onLike={() => handleLikeComment(comment.id)}
                    onDislike={() => handleDislikeComment(comment.id)}
                    onEdit={() => handleEditComment(comment.message, comment.rate, comment.id)}
                    onDelete={() => deleteExistingComment(comment.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <TabsSkeleton />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   META ROW
───────────────────────────────────────── */
function MetaRow({
  label, value, href, icon,
}: {
  label: string; value?: string; href?: string; icon?: React.ReactNode;
}) {
  const content = (
    <span className={`text-xs font-medium flex items-center gap-1 ${href ? "text-blue-800 hover:text-blue-600 hover:underline cursor-pointer" : "text-gray-700"}`}>
      {icon}
      {value ?? "—"}
    </span>
  );
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md flex-shrink-0 w-20 text-center">
        {label}
      </span>
      {href ? <Link to={href}>{content}</Link> : content}
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION TITLE
───────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

/* ─────────────────────────────────────────
   COMMENT CARD
───────────────────────────────────────── */
function CommentCard({
  comment, currentUserId, onLike, onDislike, onEdit, onDelete,
}: {
  comment: Comment; 
  currentUserId?: string | number;
  onLike: () => void; onDislike: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef                 = useRef<HTMLDivElement>(null);
  const userId                  = currentUserId ? Number(currentUserId) : undefined;
  const isOwner                 = userId === comment.userId;
  const liked                   = comment.likedByUserIds?.includes(userId!);
  const disliked                = comment.dislikedByUserIds?.includes(userId!);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-sm font-bold flex-shrink-0">
            {comment.username?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800">{comment.username}</span>
            <span className="text-xs text-gray-400">{comment.creationDate}</span>
          </div>
        </div>

        {/* Options menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <IconDotsVertical size={17} className="text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] bg-white border border-blue-100 rounded-xl shadow-lg z-20 py-1 min-w-[120px]">
              <MenuBtn icon={<IconFlag size={14} />} label="گزارش" onClick={() => setMenuOpen(false)} />
              {isOwner && (
                <>
                  <MenuBtn icon={<IconPencil size={14} />} label="ویرایش" variant="blue" onClick={() => { onEdit(); setMenuOpen(false); }} />
                  <MenuBtn icon={<IconTrash size={14} />}  label="حذف"    variant="red"  onClick={() => { onDelete(); setMenuOpen(false); }} />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            size={14}
            className={i < comment.rate ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>

      {/* Message */}
      <p className="text-sm text-gray-700 leading-7">{comment.message}</p>

      {/* Vote row */}
      <div className="flex items-center gap-4 pt-2 border-t border-blue-50">
        <VoteButton onClick={onLike}    active={liked}    count={comment.likeCount}    activeClass="text-emerald-600" icon={liked    ? <IconThumbUpFilled   size={15} /> : <IconThumbUp   size={15} />} />
        <VoteButton onClick={onDislike} active={disliked} count={comment.dislikeCount} activeClass="text-rose-500"    icon={disliked ? <IconThumbDownFilled size={15} /> : <IconThumbDown size={15} />} />
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, variant }: { icon: React.ReactNode; label: string; onClick: () => void; variant?: "blue" | "red" }) {
  const color = variant === "blue" ? "text-blue-800 hover:bg-blue-50" : variant === "red" ? "text-rose-600 hover:bg-rose-50" : "text-gray-600 hover:bg-gray-50";
  return (
    <button onClick={onClick} className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${color}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function VoteButton({ icon, count, active, activeClass, onClick }: { icon: React.ReactNode; count: number; active?: boolean; activeClass: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 text-sm transition-colors ${active ? activeClass : "text-gray-400 hover:text-gray-600"}`}>
      {icon}
      <span className="font-medium tabular-nums">{toPersianDigits(count)}</span>
    </button>
  );
}

/* ─────────────────────────────────────────
   SKELETONS
───────────────────────────────────────── */
function SpecificationsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-6 flex flex-col gap-3">
      <div className="h-5 w-36 bg-blue-50 animate-pulse rounded mb-2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-1/4 bg-blue-50 animate-pulse rounded" />
          <div className="h-4 w-2/4 bg-blue-50 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

function TabsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-12 bg-blue-50 animate-pulse rounded-2xl" />
      <div className="bg-white rounded-2xl border border-blue-100 p-6 flex flex-col gap-3">
        <div className="h-5 w-32 bg-blue-50 animate-pulse rounded mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-4 bg-blue-50 animate-pulse rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}