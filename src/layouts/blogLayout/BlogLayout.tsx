import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useArticleCategoriesStore } from "@/store/useArticleCategoriesStore";

import BlogHeaderTopBar from "./_components/blogHeaderTopBar/BlogHeaderTopBar";
import BlogFooter from "./_components/blogFooter/BlogFooter";

export default function BlogLayout() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const isBlogPost = location.pathname.split("/").filter(Boolean).length > 1;

    const { categories, fetchAllCategories } = useArticleCategoriesStore();

    useEffect(() => {
        fetchAllCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <BlogHeaderTopBar
                        isBlogPost={isBlogPost}
                        search={search}
                        onSearchChange={setSearch}
                        onSearchSubmit={handleSearch}
                    />
                </div>
            </header>

            {/* ── Page content ── */}
            <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
                <Outlet />
            </main>

            {/* ── Blog Footer ── */}
            <BlogFooter categories={categories} />
        </div>
    );
}