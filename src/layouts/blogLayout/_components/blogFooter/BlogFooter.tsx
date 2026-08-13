import { Link } from "react-router";
import { IconPill } from "@tabler/icons-react";

interface CategoryItem {
    slug: string;
    name: string;
    articlesCount: number;
}

export default function BlogFooter({ categories }: { categories: CategoryItem[] }) {
    return (
        <footer className="bg-white border-t border-blue-100 mt-6 sm:mt-8">
            <div className="container mx-auto px-4 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-4 text-center sm:text-right">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0">
                        <IconPill size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-800">مجله سلامت فارماپلاس</p>
                        {/* <p className="text-xs text-gray-400 mt-0.5">آخرین مقالات علمی در حوزه سلامت و دارو</p> */}
                    </div>
                </div>

                {/* Category quick links in footer */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
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

                <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400 flex-wrap justify-center">
                    <Link to="/" className="hover:text-blue-800 transition-colors">فروشگاه</Link>
                    <Link to="/aboutus" className="hover:text-blue-800 transition-colors">درباره ما</Link>
                    <Link to="/contactus" className="hover:text-blue-800 transition-colors">تماس با ما</Link>
                </div>

                <p className="text-xs text-gray-400">
                    © {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())} فارماپلاس
                </p>
            </div>
        </footer>
    );
}