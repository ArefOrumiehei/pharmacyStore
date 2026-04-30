import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  IconClock,
  IconCalendar,
  IconSearch,
  IconX,
  IconEye,
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
  authorAvatar?: string;
  readTime: number;
  date: string;
  views?: number;
  featured?: boolean;
}

const MOCK_BLOGS: BlogPost[] = [
  {
    id: 1, slug: "vitamin-d-deficiency", featured: true,
    title: "کمبود ویتامین D و راه‌های جبران آن",
    excerpt: "ویتامین D یکی از مهم‌ترین ویتامین‌ها برای سلامت استخوان، سیستم ایمنی و تنظیم خلق‌وخو است. در این مقاله روش‌های تشخیص و درمان کمبود آن را بررسی می‌کنیم.",
    cover: "https://picsum.photos/seed/blog1/800/450",
    category: "تغذیه و سلامت", author: "دکتر علی رضایی", readTime: 5, date: "۱۴۰۳/۰۲/۱۵", views: 1240,
  },
  {
    id: 2, slug: "blood-pressure-tips",
    title: "۱۰ راهکار طبیعی برای کنترل فشار خون",
    excerpt: "فشار خون بالا یکی از شایع‌ترین بیماری‌های قلبی‌عروقی است که با تغییر سبک زندگی قابل کنترل است.",
    cover: "https://picsum.photos/seed/blog2/800/450",
    category: "قلب و عروق", author: "دکتر مریم احمدی", readTime: 7, date: "۱۴۰۳/۰۲/۱۰", views: 980,
  },
  {
    id: 3, slug: "skin-care-routine",
    title: "روتین مراقبت از پوست در فصل تابستان",
    excerpt: "گرما و تابش آفتاب می‌تواند آسیب جدی به پوست وارد کند. با این روتین ساده پوست خود را محافظت کنید.",
    cover: "https://picsum.photos/seed/blog3/800/450",
    category: "پوست و مو", author: "دکتر سارا محمدی", readTime: 4, date: "۱۴۰۳/۰۲/۰۵", views: 756,
  },
  {
    id: 4, slug: "omega3-benefits",
    title: "فواید امگا ۳ برای سلامت مغز و قلب",
    excerpt: "اسیدهای چرب امگا ۳ نقش حیاتی در عملکرد مغز و سلامت قلب دارند.",
    cover: "https://picsum.photos/seed/blog4/800/450",
    category: "مکمل‌ها", author: "دکتر حسین کریمی", readTime: 6, date: "۱۴۰۳/۰۱/۲۸", views: 634,
  },
  {
    id: 5, slug: "sleep-hygiene",
    title: "بهداشت خواب: چگونه بهتر بخوابیم؟",
    excerpt: "خواب کافی و با کیفیت یکی از پایه‌های سلامت جسمی و روانی است.",
    cover: "https://picsum.photos/seed/blog5/800/450",
    category: "بهداشت عمومی", author: "دکتر نگار صادقی", readTime: 5, date: "۱۴۰۳/۰۱/۲۰", views: 512,
  },
  {
    id: 6, slug: "baby-nutrition",
    title: "تغذیه نوزاد در شش ماه اول زندگی",
    excerpt: "شیر مادر بهترین غذا برای نوزاد است. در این مقاله نکات مهم تغذیه نوزاد را مرور می‌کنیم.",
    cover: "https://picsum.photos/seed/blog6/800/450",
    category: "مادر و کودک", author: "دکتر فاطمه حسینی", readTime: 8, date: "۱۴۰۳/۰۱/۱۵", views: 890,
  },
];

const CATEGORIES = ["همه", "تغذیه و سلامت", "قلب و عروق", "پوست و مو", "مکمل‌ها", "داروها", "مادر و کودک", "بهداشت عمومی"];

function AuthorAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div className={`${s} rounded-full bg-blue-800 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name[2] ?? name[0]}
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between pt-2 border-t border-blue-50">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-300"
    >
      <div className="w-full h-48 overflow-hidden bg-blue-50 relative flex-shrink-0">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium text-blue-800 bg-white/90 backdrop-blur-sm border border-blue-100 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-6 group-hover:text-blue-800 transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-5 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-blue-50">
          <div className="flex items-center gap-1.5">
            <AuthorAvatar name={post.author} />
            <span className="text-xs text-gray-600 truncate max-w-[90px]">{post.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <IconClock size={11} />
              {post.readTime} دقیقه
            </span>
            <span className="flex items-center gap-1">
              <IconCalendar size={11} />
              {post.date}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group col-span-full bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col sm:flex-row"
    >
      <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden bg-blue-50 relative flex-shrink-0">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 text-xs font-bold text-white bg-blue-800 px-2.5 py-1 rounded-full">
          ویژه
        </span>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-3 justify-center">
        <span className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full w-fit">
          {post.category}
        </span>
        <h2 className="text-lg font-bold text-gray-800 leading-7 group-hover:text-blue-800 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 leading-6 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-blue-50 flex-wrap">
          <div className="flex items-center gap-2">
            <AuthorAvatar name={post.author} size="md" />
            <span className="text-sm text-gray-600">{post.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mr-auto">
            <span className="flex items-center gap-1"><IconClock size={12} />{post.readTime} دقیقه مطالعه</span>
            <span className="flex items-center gap-1"><IconCalendar size={12} />{post.date}</span>
            {post.views && <span className="flex items-center gap-1"><IconEye size={12} />{post.views.toLocaleString("fa-IR")}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "همه");
  const [loading] = useState(false);

  const featured = MOCK_BLOGS.find((b) => b.featured);
  const filtered = MOCK_BLOGS.filter((b) => {
    const matchCat = activeCategory === "همه" || b.category === activeCategory;
    const matchSearch = !search || b.title.includes(search) || b.excerpt.includes(search);
    return matchCat && matchSearch;
  });
  const grid = filtered.filter((b) => !b.featured || activeCategory !== "همه" || search);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    const params: Record<string, string> = {};
    if (cat !== "همه") params.category = cat;
    if (search) params.q = search;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (activeCategory !== "همه") params.category = activeCategory;
    if (search) params.q = search;
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="text-center space-y-3 py-4">
        <h1 className="text-3xl font-bold text-blue-800">مجله سلامت فارماپلاس</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-6">
          آخرین مقالات علمی در حوزه سلامت، دارو، تغذیه و سبک زندگی سالم
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto w-full">
        <div className="relative">
          <IconSearch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در مقالات..."
            className="w-full border border-blue-100 bg-white rounded-2xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 shadow-sm"
          />
          {search && (
            <button type="button" onClick={() => { setSearch(""); setSearchParams({}); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <IconX size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-white text-gray-600 border-blue-100 hover:border-blue-300 hover:text-blue-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeCategory !== "همه") && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            {filtered.length} مقاله یافت شد
            {activeCategory !== "همه" && <span> در دسته «{activeCategory}»</span>}
            {search && <span> برای «{search}»</span>}
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("همه"); setSearchParams({}); }}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <IconX size={12} /> پاک کردن
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white border border-blue-100 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <IconSearch size={28} className="text-blue-300" />
          </div>
          <p className="text-gray-500 font-medium">مقاله‌ای یافت نشد</p>
          <p className="text-gray-400 text-sm">فیلتر یا عبارت جستجو را تغییر دهید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured post spans full width */}
          {featured && activeCategory === "همه" && !search && (
            <FeaturedCard post={featured} />
          )}
          {/* Regular grid */}
          {grid.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}