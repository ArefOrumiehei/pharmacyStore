import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  IconClock,
  IconCalendar,
  IconEye,
  IconBookmark,
  IconBookmarkFilled,
  IconArrowLeft,
  IconChevronLeft,
  IconHeartFilled,
  IconHeart,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: string;
  authorBio?: string;
  readTime: number;
  date: string;
  views?: number;
  content: string;
  tags?: string[];
  related?: number[];
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "vitamin-d-deficiency",
    title: "کمبود ویتامین D و راه‌های جبران آن",
    excerpt: "ویتامین D یکی از مهم‌ترین ویتامین‌ها برای سلامت استخوان و سیستم ایمنی است.",
    cover: "https://picsum.photos/seed/blog1/1200/600",
    category: "تغذیه و سلامت",
    author: "دکتر علی رضایی",
    authorBio: "متخصص تغذیه و دیابت، دارای بیش از ۱۵ سال سابقه بالینی",
    readTime: 5,
    date: "۱۴۰۳/۰۲/۱۵",
    views: 1240,
    tags: ["ویتامین D", "استخوان", "سیستم ایمنی", "مکمل"],
    related: [2, 4],
    content: `
## ویتامین D چیست؟

ویتامین D یک ویتامین محلول در چربی است که نقش اساسی در جذب کلسیم و فسفر از روده دارد. بدن انسان قادر است با قرار گرفتن در معرض نور خورشید، این ویتامین را در پوست بسازد.

## علائم کمبود ویتامین D

کمبود ویتامین D می‌تواند علائم متعددی داشته باشد که عبارتند از:

- **خستگی مزمن** و ضعف عضلانی
- **دردهای استخوانی** به‌ویژه در کمر و زانو
- **افسردگی** و تغییرات خلقی
- **ضعف سیستم ایمنی** و بیماری‌های مکرر

## چه کسانی بیشتر در معرض خطر هستند؟

افراد زیر بیشتر در معرض کمبود ویتامین D هستند:

افراد مسن‌تر پوست ضعیف‌تری در ساختن ویتامین D دارند. کسانی که کمتر در معرض آفتاب هستند، مانند کارمندان اداری، نیز در معرض خطر بالاتری قرار دارند. افراد با پوست تیره به نور خورشید بیشتری نیاز دارند.

## منابع غذایی ویتامین D

بهترین منابع غذایی ویتامین D شامل موارد زیر می‌شود:

- ماهی چرب مانند سالمون، ماکرل و ساردین
- زرده تخم‌مرغ
- لبنیات غنی‌شده با ویتامین D
- قارچ‌هایی که در معرض نور UV قرار گرفته‌اند

## چه زمانی باید مکمل مصرف کنیم؟

اگر آزمایش خون سطح ویتامین D شما کمتر از ۳۰ نانوگرم در میلی‌لیتر نشان دهد، پزشک احتمالاً مکمل تجویز خواهد کرد. دوز معمول بین ۱۰۰۰ تا ۴۰۰۰ IU در روز است، اما این مقدار باید توسط پزشک تعیین شود.

## نتیجه‌گیری

کمبود ویتامین D یک مشکل شایع است که می‌توان آن را با تغذیه مناسب، قرار گرفتن در معرض آفتاب و در صورت نیاز مصرف مکمل، برطرف کرد. در صورت مشاهده علائم، حتماً با پزشک مشورت کنید.
    `,
  },
  {
    id: 2, slug: "blood-pressure-tips",
    title: "۱۰ راهکار طبیعی برای کنترل فشار خون",
    excerpt: "فشار خون بالا یکی از شایع‌ترین بیماری‌های قلبی‌عروقی است.",
    cover: "https://picsum.photos/seed/blog2/1200/600",
    category: "قلب و عروق", author: "دکتر مریم احمدی",
    authorBio: "متخصص قلب و عروق، عضو هیئت علمی دانشگاه",
    readTime: 7, date: "۱۴۰۳/۰۲/۱۰", views: 980,
    tags: ["فشار خون", "قلب", "سبک زندگی"],
    related: [1, 4],
    content: `## فشار خون بالا چیست؟\n\nفشار خون بالا یا هیپرتانسیون زمانی رخ می‌دهد که فشار خون در شریان‌ها به طور مداوم بالاتر از حد طبیعی باشد.\n\n## راهکارهای طبیعی\n\n- **کاهش مصرف نمک**: سدیم باعث احتباس آب و افزایش فشار خون می‌شود.\n- **ورزش منظم**: حداقل ۳۰ دقیقه فعالیت هوازی در روز.\n- **کاهش وزن**: هر کیلوگرم کاهش وزن، فشار خون را تا ۱ میلی‌متر جیوه کاهش می‌دهد.`,
  },
  {
    id: 4, slug: "omega3-benefits",
    title: "فواید امگا ۳ برای سلامت مغز و قلب",
    excerpt: "اسیدهای چرب امگا ۳ نقش حیاتی در عملکرد مغز و سلامت قلب دارند.",
    cover: "https://picsum.photos/seed/blog4/1200/600",
    category: "مکمل‌ها", author: "دکتر حسین کریمی",
    authorBio: "دکترای داروسازی، متخصص تغذیه بالینی",
    readTime: 6, date: "۱۴۰۳/۰۱/۲۸", views: 634,
    tags: ["امگا ۳", "مغز", "قلب", "مکمل"],
    related: [1, 2],
    content: `## امگا ۳ چیست؟\n\nامگا ۳ نوعی اسید چرب غیراشباع ضروری است که بدن قادر به ساخت آن نیست و باید از طریق غذا یا مکمل دریافت شود.\n\n## فواید اصلی\n\n- **سلامت قلب**: کاهش تری‌گلیسیرید و التهاب\n- **عملکرد مغز**: بهبود حافظه و کاهش خطر افسردگی\n- **سلامت مفاصل**: کاهش درد و التهاب آرتریت`,
  },
];

// Simple markdown-like renderer
function renderContent(content: string) {
  return content
    .trim()
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-blue-800 mt-8 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-800 rounded-full inline-block flex-shrink-0" />
          {line.replace("## ", "")}
        </h2>;
      }
      if (line.startsWith("- ")) {
        const html = line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-7">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0 mt-2.5" />
          <span dangerouslySetInnerHTML={{ __html: html }} />
        </li>;
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-800">$1</strong>');
      return <p key={i} className="text-gray-600 text-sm leading-8" dangerouslySetInnerHTML={{ __html: html }} />;
    });
}

function AuthorAvatar({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "w-12 h-12 text-base" : "w-6 h-6 text-[10px]";
  return (
    <div className={`${s} rounded-full bg-blue-800 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name[2] ?? name[0]}
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(42);

  const post = MOCK_POSTS.find((p) => p.slug === slug);
  const related = MOCK_POSTS.filter((p) => post?.related?.includes(p.id));

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };

  if (!post) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Skeleton className="w-full h-80 rounded-2xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-0">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6 flex-wrap">
        <Link to="/blog" className="hover:text-blue-800 transition-colors">مجله سلامت</Link>
        <IconChevronLeft size={12} />
        <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-blue-800 transition-colors">
          {post.category}
        </Link>
        <IconChevronLeft size={12} />
        <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Cover image */}
      <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-blue-50 mb-8">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article header */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-6">
        {/* Category */}
        <span className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 leading-9 mt-3 mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-blue-50">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AuthorAvatar name={post.author} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{post.author}</p>
                {post.authorBio && <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{post.authorBio}</p>}
              </div>
            </div>
            <div className="w-px h-8 bg-blue-50" />
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><IconCalendar size={12} />{post.date}</span>
              <span className="flex items-center gap-1"><IconClock size={12} />{post.readTime} دقیقه مطالعه</span>
              {post.views && <span className="flex items-center gap-1"><IconEye size={12} />{post.views.toLocaleString("fa-IR")} بازدید</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                liked ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-blue-100 text-gray-500 hover:border-rose-200 hover:text-rose-500"
              }`}
            >
              {liked ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
              {likeCount}
            </button>
            <button
              onClick={() => setBookmarked((p) => !p)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                bookmarked ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-white border-blue-100 text-gray-400 hover:border-blue-200 hover:text-blue-800"
              }`}
              title="ذخیره"
            >
              {bookmarked ? <IconBookmarkFilled size={15} /> : <IconBookmark size={15} />}
            </button>
            <button
              onClick={handleCopy}
              className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                copied ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-blue-100 text-gray-400 hover:border-blue-200 hover:text-blue-800"
              }`}
              title="کپی لینک"
            >
              {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-7 mt-4 bg-blue-50/50 border border-blue-50 rounded-xl p-4 italic">
          {post.excerpt}
        </p>
      </div>

      {/* Article content */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-6">
        <ul className="space-y-1">
          {renderContent(post.content)}
        </ul>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-2xl p-5 mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">برچسب‌ها</p>
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
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

      {/* Author card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 mb-6 flex items-start gap-4">
        <AuthorAvatar name={post.author} size="lg" />
        <div>
          <p className="text-sm font-bold text-blue-800">{post.author}</p>
          {post.authorBio && <p className="text-xs text-gray-500 mt-1 leading-5">{post.authorBio}</p>}
          <Link
            to={`/blog?author=${encodeURIComponent(post.author)}`}
            className="inline-flex items-center gap-1 text-xs text-blue-800 hover:text-blue-600 mt-2 transition-colors"
          >
            مشاهده سایر مقالات
            <IconArrowLeft size={12} />
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold text-blue-800 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-blue-800 rounded-full inline-block" />
            مقالات مرتبط
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rp) => (
              <Link
                key={rp.id}
                to={`/blog/${rp.slug}`}
                className="group bg-white border border-blue-100 rounded-2xl overflow-hidden flex gap-3 p-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200"
              >
                <img
                  src={rp.cover}
                  alt={rp.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-blue-50"
                />
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-xs text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full w-fit">
                    {rp.category}
                  </span>
                  <h3 className="text-xs font-semibold text-gray-700 line-clamp-2 leading-5 group-hover:text-blue-800 transition-colors">
                    {rp.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1 mt-auto">
                    <IconClock size={10} />{rp.readTime} دقیقه
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}