import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  IconCalendar, IconEye, IconBookmark, IconBookmarkFilled,
  IconArrowLeft, IconChevronLeft, IconHeartFilled, IconHeart,
  IconCopy, IconCheck, IconStar, IconMessageCircle,
} from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { IArticle } from "@/services/articleServices/articleServices";
import { useArticleStore } from "@/store/useArticlsStore";

// ─── Content renderer ─────────────────────────────────────────────────────────

function RenderBody({ html }: { html: string }) {
  return (
    <div
      className="prose prose-sm prose-blue max-w-none text-gray-600 leading-8
        prose-headings:text-blue-800 prose-headings:font-bold
        prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-sm prose-p:leading-8 prose-p:text-gray-600
        prose-li:text-sm prose-li:text-gray-700 prose-li:leading-7
        prose-strong:text-gray-800
        prose-a:text-blue-800 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:border prose-img:border-blue-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      <div className="w-full h-72 bg-blue-50 animate-pulse rounded-2xl" />
      <div className="bg-white border border-blue-50 rounded-2xl p-6 flex flex-col gap-4">
        <div className="h-4 w-20 bg-blue-50 animate-pulse rounded-full" />
        <div className="h-7 w-full bg-blue-50 animate-pulse rounded" />
        <div className="h-7 w-3/4 bg-blue-50 animate-pulse rounded" />
        <div className="flex gap-3 pt-4 border-t border-blue-50">
          <div className="w-10 h-10 rounded-full bg-blue-50 animate-pulse" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3.5 w-32 bg-blue-50 animate-pulse rounded" />
            <div className="h-3 w-48 bg-blue-50 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="bg-white border border-blue-50 rounded-2xl p-6 flex flex-col gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`h-3.5 bg-blue-50 animate-pulse rounded ${i % 5 === 4 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Author avatar ────────────────────────────────────────────────────────────

function AuthorAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "w-12 h-12 text-lg" : size === "md" ? "w-9 h-9 text-sm" : "w-6 h-6 text-[10px]";
  return (
    <div className={`${s} rounded-full bg-blue-800 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      م
    </div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────

function RelatedCard({ article }: { article: IArticle }) {
  return (
    <Link
      to={`/blog/${article.categorySlug}/${article.slug}`}
      className="group bg-white border border-blue-100 rounded-2xl overflow-hidden flex gap-3 p-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200"
    >
      <img
        src={`${IMAGE_BASE}/${article.picture}`}
        alt={article.pictureAlt}
        className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-blue-50"
        loading="lazy"
      />
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="text-xs text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full w-fit">
          {article.categoryName}
        </span>
        <h3 className="text-xs font-semibold text-gray-700 line-clamp-2 leading-5 group-hover:text-blue-800 transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
          <span className="flex items-center gap-1 text-amber-500">
            <IconStar size={10} />{article.avgRateStr || article.avgRate}
          </span>
          <span className="flex items-center gap-1">
            <IconEye size={10} />{article.viewsLabel || article.viewCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const { catgSlug, slug } = useParams<{ catgSlug: string; slug: string }>();

  const {
    selectedArticle: article,
    latestArticles,
    loading, error,
    fetchArticle,
    fetchLatestArticles,
    clearSelectedArticle,
  } = useArticleStore();

  const [bookmarked, setBookmarked] = useState(false);
  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(0);
  const [copied,     setCopied]     = useState(false);

  useEffect(() => {
    if (slug && catgSlug) fetchArticle(slug, catgSlug);
    if (!latestArticles.length) fetchLatestArticles();
    return () => clearSelectedArticle();
  }, [slug, catgSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync like count with article data
  useEffect(() => {
    if (article) setLikeCount(article.rateCount);
  }, [article]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };

  // Related = latest excluding current
  const related = latestArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading.article) return <PostSkeleton />;

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error.article) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
          <IconMessageCircle size={28} className="text-rose-300" />
        </div>
        <p className="text-sm text-rose-500 font-medium">{error.article}</p>
        <Link to="/blog" className="text-sm text-blue-800 hover:text-blue-600 transition-colors">
          بازگشت به مجله
        </Link>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!article) return <PostSkeleton />;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
        <Link to="/blog" className="hover:text-blue-800 transition-colors">مجله سلامت</Link>
        <IconChevronLeft size={12} />
        <Link
          to={`/blog?category=${encodeURIComponent(article.categoryName)}`}
          className="hover:text-blue-800 transition-colors"
        >
          {article.categoryName}
        </Link>
        <IconChevronLeft size={12} />
        <span className="text-gray-600 truncate max-w-[200px]">{article.title}</span>
      </nav>

      {/* Cover */}
      <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-blue-50">
        <img
          src={`${IMAGE_BASE}/${article.picture}`}
          alt={article.pictureAlt}
          title={article.pictureTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article header */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">

        {/* Category */}
        <span className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full w-fit">
          {article.categoryName}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 leading-9">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-blue-50">
          <div className="flex items-center gap-3 flex-wrap">
            <AuthorAvatar size="md" />
            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <IconCalendar size={12} />{article.publishDate}
              </span>
              <span className="flex items-center gap-1">
                <IconEye size={12} />{article.viewsLabel || article.viewCount} بازدید
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <IconStar size={12} />{article.avgRateStr || article.avgRate}
              </span>
              <span className="flex items-center gap-1">
                <IconMessageCircle size={12} />{article.commentCountStr || article.commentCount} نظر
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                liked
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-white border-blue-100 text-gray-500 hover:border-rose-200 hover:text-rose-500"
              }`}
            >
              {liked ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
              {likeCount}
            </button>
            <button
              onClick={() => setBookmarked((p) => !p)}
              title="ذخیره"
              className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                bookmarked
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-white border-blue-100 text-gray-400 hover:border-blue-200 hover:text-blue-800"
              }`}
            >
              {bookmarked ? <IconBookmarkFilled size={15} /> : <IconBookmark size={15} />}
            </button>
            <button
              onClick={handleCopy}
              title="کپی لینک"
              className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                copied
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-white border-blue-100 text-gray-400 hover:border-blue-200 hover:text-blue-800"
              }`}
            >
              {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
            </button>
          </div>
        </div>

        {/* Short description */}
        <p className="text-sm text-gray-500 leading-7 bg-blue-50/50 border border-blue-50 rounded-xl p-4 italic">
          {article.shortDescription}
        </p>
      </div>

      {/* Body */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <RenderBody html={article.body} />
      </div>

      {/* Keywords / tags */}
      {article.keywordList && article.keywordList.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">برچسب‌ها</p>
          <div className="flex items-center gap-2 flex-wrap">
            {article.keywordList.map((tag) => (
              <Link
                key={tag}
                to={`/blog?q=${encodeURIComponent(tag)}`}
                className="text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {article.comments && article.comments.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
            نظرات ({article.commentCountStr || article.commentCount})
          </h2>

          <div className="flex flex-col gap-4">
            {article.comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-2">
                <div className="flex items-start gap-3 bg-blue-50/40 border border-blue-50 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {comment.username?.[0] ?? "؟"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{comment.username}</span>
                        {comment.isBuyer && (
                          <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">
                            خریدار
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {comment.rate > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-500">
                            <IconStar size={11} />{comment.rate}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{comment.creationDate}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-6 mt-1.5">{comment.message}</p>
                  </div>
                </div>

                {/* Admin reply */}
                {comment.reply && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mr-8">
                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">ادمین</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-blue-800">پشتیبانی فارماپلاس</span>
                        {comment.replyDate && (
                          <span className="text-xs text-gray-400">{comment.replyDate}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-6 mt-1.5">{comment.reply}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-800 rounded-full inline-block" />
            مقالات مرتبط
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((a) => <RelatedCard key={a.id} article={a} />)}
          </div>
        </div>
      )}

      {/* Back link */}
      <Link
        to="/blog"
        className="self-start flex items-center gap-2 text-sm text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2.5 rounded-xl transition-all duration-200 mb-4"
      >
        <IconArrowLeft size={15} />
        بازگشت به مجله سلامت
      </Link>
    </div>
  );
}