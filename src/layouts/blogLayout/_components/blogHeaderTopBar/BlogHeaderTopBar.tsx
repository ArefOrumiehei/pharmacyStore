import { Link } from "react-router";
import { IconPill } from "@tabler/icons-react";

export default function BlogHeaderTopBar({
    isBlogPost,
    search,
    onSearchChange,
    onSearchSubmit,
}: {
    isBlogPost: boolean;
    search: string;
    onSearchChange: (v: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}) {
    // const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
                {/* Logo + breadcrumb */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
                            <IconPill size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-blue-800 text-sm hidden sm:block">فارماپلاس</span>
                    </Link>
                    <div className="w-px h-5 bg-blue-100 flex-shrink-0" />
                    <Link
                        to="/blog"
                        className="text-sm font-bold text-gray-700 hover:text-blue-800 transition-colors truncate"
                    >
                        مجله سلامت
                    </Link>
                    {isBlogPost && (
                        <>
                            <div className="w-px h-5 bg-blue-100 hidden sm:block flex-shrink-0" />
                            <Link
                                to="/blog"
                                className="hidden sm:flex items-center gap-1 text-xs text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200 flex-shrink-0"
                            >
                                بازگشت به مقالات
                            </Link>
                        </>
                    )}
                </div>

                {/* Search — inline on desktop */}
                {/* <SearchForm
                    value={search}
                    onChange={onSearchChange}
                    onSubmit={onSearchSubmit}
                    className="flex-1 max-w-sm hidden md:block"
                /> */}

                {/* Search toggle — mobile only */}
                {/* <button
                    type="button"
                    onClick={() => setMobileSearchOpen((p) => !p)}
                    aria-label={mobileSearchOpen ? "بستن جستجو" : "جستجو"}
                    className="md:hidden w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0"
                >
                    {mobileSearchOpen ? <IconX size={15} className="text-blue-800" /> : <IconSearch size={15} className="text-blue-800" />}
                </button> */}

                {/* <SocialLinks /> */}
                <Link
                    to="/"
                    className="hidden sm:flex items-center gap-1 text-xs text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200 flex-shrink-0"
                >
                    رفتن به فروشگاه
                </Link>
            </div>

            {/* Search — expandable row on mobile */}
            {/* {mobileSearchOpen && (
                <div className="md:hidden pb-3">
                    <SearchForm value={search} onChange={onSearchChange} onSubmit={onSearchSubmit} autoFocus />
                </div>
            )} */}
        </>
    );
}