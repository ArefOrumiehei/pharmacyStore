import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { IconX, IconLoader2, IconArrowLeft, IconPackage } from "@tabler/icons-react";
import { toPersianDigits } from "smart-persian-tools";
import { IMAGE_BASE } from "@/apis/apiInstance";

// Stores
import { useProductSearchStore } from "@/store/useProductSearchStore";

// Types
import type { MobileSearchBarProps } from "../../types/HeaderTypes";

const DROPDOWN_LIMIT = 6;

export default function MobileSearchBar({ inputRef, open, onClose }: MobileSearchBarProps) {
  const navigate = useNavigate();
  const { fetchResults, items, totalCount, loading} = useProductSearchStore();

  const [query, setQuery] = useState("");

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      try {
        await fetchResults({
          searchTerm: query.trim(),
          page: 1,
          pageSize: DROPDOWN_LIMIT,
          sortBy: 1,
        });
        if (requestId !== requestIdRef.current) return;
      } catch {
        if (requestId !== requestIdRef.current) return;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const goToPlp = () => {
    if (!query.trim()) return;
    navigate(`/plp?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) goToPlp();
    if (e.key === "Escape") onClose();
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleResultClick = () => onClose();

  const hasMore = totalCount > DROPDOWN_LIMIT;
  const showDropdown = open && query.trim().length > 0;

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${
        open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-100">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.2" className="flex-shrink-0">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder="جستجوی محصول..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200"
        />

        {query && !loading && (
          <button
            onClick={handleClear}
            className="absolute left-6 flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
            aria-label="پاک کردن جستجو"
          >
            <IconX size={16} />
          </button>
        )}

        {/* <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
          aria-label="بستن جستجو"
        >
          <IconX size={18} />
        </button> */}
      </div>

      {showDropdown && (
        <div className="max-h-[55vh] overflow-y-auto" dir="rtl">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
              <IconLoader2 size={16} className="animate-spin" />
              در حال جستجو...
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              <ul>
                {items.map((item) => {
                  const displayPrice = item.hasDiscount ? item.priceWithDiscount : item.price;
                  return (
                    <li key={item.id}>
                      <Link
                        to={`/product/${encodeURIComponent(item.categoryFullSlug)}/${encodeURIComponent(item.slug)}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors duration-150"
                      >
                        <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-blue-50 border border-blue-100 overflow-hidden flex items-center justify-center">
                          {item.picture ? (
                            <img
                              src={`${IMAGE_BASE}/${item.picture}`}
                              alt={item.pictureAlt ?? item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <IconPackage size={18} className="text-blue-200" />
                          )}
                        </div>

                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
                          <span className="text-xs text-gray-400">{item.categoryName}</span>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          {item.hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {toPersianDigits(item.price)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-blue-800">
                            {toPersianDigits(displayPrice)}
                            <span className="text-xs font-normal text-gray-400 mr-0.5">ت</span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={goToPlp}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-800 hover:bg-blue-50 transition-colors duration-150"
                >
                  <span>مشاهده {hasMore ? "همه" : ""} نتایج برای «{query}»</span>
                  <IconArrowLeft size={15} />
                </button>
              </div>
            </>
          )}

          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <IconPackage size={26} className="text-blue-200" />
              <p className="text-sm text-gray-500">نتیجه‌ای برای «{query}» یافت نشد</p>
              <p className="text-xs text-gray-400">عبارت دیگری امتحان کنید</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}