import { useProductStore } from "@/store/useProductsStore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    IconSearch,
    IconLoader2,
    IconX,
    IconArrowLeft,
    IconPackage,
} from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import { formatNumberToFa } from "@/helpers/formaters";

const DROPDOWN_LIMIT = 6;

function SearchBox() {
    const {
        fetchProductsBySearch,
        clearSearchResults,
        searchResults,
        searchLoading,
    } = useProductStore();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setOpen(false);
            clearSearchResults();
            return;
        }
        const timer = setTimeout(() => {
            fetchProductsBySearch(query.trim());
            setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
            }
            // Enter → go to PLP
            if (e.key === "Enter" && query.trim()) {
                goToPlp();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const goToPlp = () => {
        if (!query.trim()) return;
        setOpen(false);
        navigate(`/plp?q=${encodeURIComponent(query.trim())}`);
    };

    const handleClear = () => {
        setQuery("");
        clearSearchResults();
        setOpen(false);
        inputRef.current?.focus();
    };

    const handleResultClick = () => {
        setOpen(false);
        setQuery("");
        clearSearchResults();
    };

    const previewResults = searchResults.slice(0, DROPDOWN_LIMIT);
    const hasMore = searchResults.length > DROPDOWN_LIMIT;

    return (
        <div
            className="hidden md:flex flex-col w-[35%] relative"
            ref={wrapperRef}
            dir="rtl"
        >
            {/* Input */}
            <div
                className={`flex items-center gap-2 bg-blue-50 border px-3 rounded-xl transition-all duration-200 ${
                    open
                        ? "border-blue-300 ring-2 ring-blue-100"
                        : "border-blue-200"
                }`}
            >
                {searchLoading ? (
                    <IconLoader2
                        size={16}
                        className="text-blue-400 animate-spin flex-shrink-0"
                    />
                ) : (
                    <IconSearch
                        size={16}
                        className="text-blue-400 flex-shrink-0"
                    />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="جستجوی محصول..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() =>
                        query.trim() &&
                        searchResults.length > 0 &&
                        setOpen(true)
                    }
                    className="w-full py-2.5 text-sm text-gray-700 bg-transparent placeholder:text-blue-300 focus:outline-none"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <IconX size={15} />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {/* Loading state */}
                    {searchLoading && (
                        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                            <IconLoader2 size={16} className="animate-spin" />
                            در حال جستجو...
                        </div>
                    )}

                    {/* Results */}
                    {!searchLoading && previewResults.length > 0 && (
                        <>
                            <div className="px-3 pt-3 pb-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    نتایج جستجو
                                </p>
                            </div>
                            <ul>
                                {previewResults.map((item) => {
                                    const displayPrice = item.hasDiscount
                                        ? item.priceWithDiscount
                                        : item.price;
                                    return (
                                        <li key={item.id}>
                                            <Link
                                                to={`/product/${encodeURIComponent(
                                                    item.categoryFullSlug
                                                )}/${encodeURIComponent(
                                                    item.slug
                                                )}`}
                                                onClick={handleResultClick}
                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-blue-50 border border-blue-100 overflow-hidden flex items-center justify-center">
                                                    {item.picture ? (
                                                        <img
                                                            src={`${IMAGE_BASE}${item.picture}`}
                                                            alt={
                                                                item.pictureAlt ??
                                                                item.name
                                                            }
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <IconPackage
                                                            size={20}
                                                            className="text-blue-200"
                                                        />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-gray-800 truncate">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {item.categoryName}
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex flex-col items-end flex-shrink-0">
                                                    {item.hasDiscount && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {formatNumberToFa(
                                                                Number(
                                                                    item.price
                                                                )
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-bold text-blue-800">
                                                        {formatNumberToFa(
                                                            Number(displayPrice)
                                                        )}
                                                        <span className="text-xs font-normal text-gray-400 mr-0.5">
                                                            ت
                                                        </span>
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* See all */}
                            <div className="border-t border-gray-100 p-2">
                                <button
                                    onClick={goToPlp}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors duration-150"
                                >
                                    <span>
                                        مشاهده {hasMore ? "همه" : ""} نتایج برای
                                        «{query}»
                                    </span>
                                    <IconArrowLeft size={15} />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Empty */}
                    {!searchLoading &&
                        searchResults.length === 0 &&
                        query.trim() && (
                            <div className="flex flex-col items-center gap-2 py-8 text-center">
                                <IconPackage
                                    size={28}
                                    className="text-blue-200"
                                />
                                <p className="text-sm text-gray-500">
                                    نتیجه‌ای برای «{query}» یافت نشد
                                </p>
                                <p className="text-xs text-gray-400">
                                    عبارت دیگری امتحان کنید
                                </p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}

export default SearchBox;
