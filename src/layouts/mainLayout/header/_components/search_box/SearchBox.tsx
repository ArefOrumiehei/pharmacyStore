/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProductStore } from "@/store/useProductsStore";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { IconSearch } from '@tabler/icons-react';
function SearchBox() {
    const { fetchProductsBySearch, searchResults } = useProductStore();

    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!search.trim()) {
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(() => {
            fetchProductsBySearch(search);
            setShowDropdown(true);
        }, 800);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="hidden md:flex flex-col w-[35%] relative">
          <div className="flex bg-amber-50 rounded-md px-2 items-center">
            <IconSearch color="#3e3e3e" />
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search && setShowDropdown(true)}
              className="w-full p-2 text-sm text-black bg-inherit focus:outline-none"
            />
          </div>

            {/* ─── SEARCH RESULTS DROPDOWN ───────────────────── */}
            {showDropdown && searchResults?.items?.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md overflow-hidden max-h-72 overflow-y-auto z-100 border border-gray-200">
                    {searchResults?.items.map((item: any) => (
                        <Link
                            key={item.id}
                            to={`/product/${encodeURIComponent(
                                item.categoryFullSlug
                            )}/${encodeURIComponent(item.slug)}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setShowDropdown(false)}
                        >
                            <img
                                src={item.imageUrl}
                                className="w-12 h-12 object-cover rounded-md"
                                alt=""
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800">
                                    {item.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                    قیمت: {item.price?.toLocaleString()} تومان
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {showDropdown && searchResults?.items?.length === 0 && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md p-3 text-sm text-gray-500 border z-50">
                    نتیجه‌ای یافت نشد
                </div>
            )}
        </div>
    );
}

export default SearchBox;
