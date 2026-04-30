import { Link } from "react-router";
import { IconArrowLeft, IconClock, IconCalendar } from "@tabler/icons-react";
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
}

// const IMAGE_BASE = "https://tk9839fd-5000.euw.devtunnels.ms/pictures/";

const MOCK_BLOGS: BlogPost[] = [
  {
    id: 1, slug: "vitamin-d-deficiency", title: "کمبود ویتامین D و راه‌های جبران آن",
    excerpt: "ویتامین D یکی از مهم‌ترین ویتامین‌ها برای سلامت استخوان و سیستم ایمنی است.",
    cover: "https://picsum.photos/seed/blog1/400/250", category: "تغذیه و سلامت",
    author: "دکتر علی رضایی", authorAvatar: "", readTime: 5, date: "۱۴۰۳/۰۲/۱۵",
  },
  {
    id: 2, slug: "blood-pressure-tips", title: "۱۰ راهکار طبیعی برای کنترل فشار خون",
    excerpt: "فشار خون بالا یکی از شایع‌ترین بیماری‌های قلبی‌عروقی است که با تغییر سبک زندگی قابل کنترل است.",
    cover: "https://picsum.photos/seed/blog2/400/250", category: "قلب و عروق",
    author: "دکتر مریم احمدی", authorAvatar: "", readTime: 7, date: "۱۴۰۳/۰۲/۱۰",
  },
  {
    id: 3, slug: "skin-care-routine", title: "روتین مراقبت از پوست در فصل تابستان",
    excerpt: "گرما و تابش آفتاب می‌تواند آسیب جدی به پوست وارد کند. با این روتین ساده پوست خود را محافظت کنید.",
    cover: "https://picsum.photos/seed/blog3/400/250", category: "پوست و مو",
    author: "دکتر سارا محمدی", authorAvatar: "", readTime: 4, date: "۱۴۰۳/۰۲/۰۵",
  },
  {
    id: 4, slug: "omega3-benefits", title: "فواید امگا ۳ برای سلامت مغز و قلب",
    excerpt: "اسیدهای چرب امگا ۳ نقش حیاتی در عملکرد مغز و سلامت قلب دارند.",
    cover: "https://picsum.photos/seed/blog4/400/250", category: "مکمل‌ها",
    author: "دکتر حسین کریمی", authorAvatar: "", readTime: 6, date: "۱۴۰۳/۰۱/۲۸",
  },
];

function BlogCardSkeleton() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col">
      <Skeleton className="w-full h-44" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
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
      {/* Cover */}
      <div className="w-full h-44 overflow-hidden bg-blue-50 flex-shrink-0">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Category */}
        <span className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full w-fit">
          {post.category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-6 group-hover:text-blue-800 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-5">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-blue-50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {post.author[2]}
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[80px]">{post.author}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <IconClock size={12} />
              {post.readTime} دقیقه
            </span>
            <span className="flex items-center gap-1">
              <IconCalendar size={12} />
              {post.date}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Blogs({
  posts = MOCK_BLOGS,
  loading = false,
}: {
  posts?: BlogPost[];
  loading?: boolean;
}) {
  const showSkeletons = loading || posts.length === 0;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-800">آخرین مقالات</h2>
        <Link
          to="/blog"
          className="flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200"
        >
          مشاهده همه
          <IconArrowLeft size={15} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {showSkeletons
          ? Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
          : posts.slice(0, 4).map((post) => <BlogCard key={post.id} post={post} />)
        }
      </div>
    </div>
  );
}