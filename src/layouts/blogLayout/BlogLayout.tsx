import { Outlet, Link, useLocation } from "react-router";
import {
  IconPill, IconSearch, IconBrandInstagram,
  IconBrandTelegram, IconMail, IconRss, IconChevronDown,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useArticleCategoriesStore } from "@/store/useArticleCategoriesStore";

export default function BlogLayout() {
  const [search,       setSearch]       = useState("");
  const [catMenuOpen,  setCatMenuOpen]  = useState(false);
  const catMenuRef                      = useRef<HTMLDivElement>(null);
  const navigate                        = useNavigate();
  const location                        = useLocation();
  const isBlogPost = location.pathname.split("/").filter(Boolean).length > 1;

  const { categories, loading, fetchAllCategories } = useArticleCategoriesStore();

  useEffect(() => {
    fetchAllCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setCatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/blog?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50" dir="rtl">

      {/* ── Blog Header ── */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40">
        <div className="container mx-auto px-4">

          {/* Top bar */}
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo + breadcrumb */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
                  <IconPill size={16} className="text-white" />
                </div>
                <span className="font-bold text-blue-800 text-sm hidden sm:block">فارماپلاس</span>
              </Link>
              <div className="w-px h-5 bg-blue-100" />
              <Link
                to="/blog"
                className="text-sm font-bold text-gray-700 hover:text-blue-800 transition-colors"
              >
                مجله سلامت
              </Link>
              {isBlogPost && (
                <>
                  <div className="w-px h-5 bg-blue-100 hidden sm:block" />
                  <Link
                    to="/blog"
                    className="hidden sm:flex items-center gap-1 text-xs text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200"
                  >
                    بازگشت به مقالات
                  </Link>
                </>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:block">
              <div className="relative">
                <IconSearch size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در مقالات..."
                  className="w-full border border-blue-100 bg-blue-50/30 rounded-xl pl-4 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </form>

            {/* Social + RSS */}
            <div className="flex items-center gap-2">
              <a href="https://instagram.com" aria-label="اینستاگرام"
                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <IconBrandInstagram size={15} className="text-pink-500" />
              </a>
              <a href="https://telegram.me" aria-label="تلگرام"
                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <IconBrandTelegram size={15} className="text-blue-500" />
              </a>
              <a href="/blog/rss" aria-label="RSS"
                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <IconRss size={15} className="text-orange-500" />
              </a>
            </div>
          </div>

          {/* ── Category nav strip ── */}
          <nav className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide border-t border-blue-50">
            <Link
              to="/blog"
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ${
                location.pathname === "/blog"
                  ? "bg-blue-800 text-white"
                  : "text-gray-600 hover:text-blue-800 hover:bg-blue-50"
              }`}
            >
              همه
            </Link>

            {loading.all ? (
              // Skeleton tabs
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 h-6 w-20 bg-blue-50 animate-pulse rounded-lg" />
              ))
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/blog?category=${encodeURIComponent(cat.name)}`}
                  className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap ${
                    location.search.includes(`category=${encodeURIComponent(cat.name)}`)
                      ? "bg-blue-800 text-white"
                      : "text-gray-600 hover:text-blue-800 hover:bg-blue-50"
                  }`}
                >
                  {cat.name}
                  {cat.articlesCount > 0 && (
                    <span className="mr-1 text-[10px] opacity-60">({cat.articlesCount})</span>
                  )}
                </Link>
              ))
            )}

            {/* More dropdown — shown if many categories */}
            {categories.length > 6 && (
              <div className="relative flex-shrink-0" ref={catMenuRef}>
                <button
                  onClick={() => setCatMenuOpen((p) => !p)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                  بیشتر
                  <IconChevronDown size={12} className={`transition-transform duration-200 ${catMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {catMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/40 py-1.5 z-50">
                    {categories.slice(6).map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/blog?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setCatMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs text-gray-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                      >
                        <span>{cat.name}</span>
                        {cat.articlesCount > 0 && (
                          <span className="text-[10px] text-gray-400">{cat.articlesCount}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* ── Blog Footer ── */}
      <footer className="bg-white border-t border-blue-100 mt-8">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
              <IconPill size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800">مجله سلامت فارماپلاس</p>
              <p className="text-xs text-gray-400 mt-0.5">آخرین مقالات علمی در حوزه سلامت و دارو</p>
            </div>
          </div>

          {/* Category quick links in footer */}
          {categories.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/blog?category=${encodeURIComponent(cat.name)}`}
                  className="text-xs text-gray-400 hover:text-blue-800 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/" className="hover:text-blue-800 transition-colors">فروشگاه</Link>
            <Link to="/aboutus" className="hover:text-blue-800 transition-colors">درباره ما</Link>
            <Link to="/contactus" className="hover:text-blue-800 transition-colors">تماس با ما</Link>
            <a
              href="mailto:blog@pharmaplus.com"
              className="flex items-center gap-1 hover:text-blue-800 transition-colors"
            >
              <IconMail size={12} />
              blog@pharmaplus.com
            </a>
          </div>

          <p className="text-xs text-gray-400">
            © {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())} فارماپلاس
          </p>
        </div>
      </footer>
    </div>
  );
}