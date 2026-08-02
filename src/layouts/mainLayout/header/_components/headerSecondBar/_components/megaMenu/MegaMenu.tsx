import { useProductCatgsQueries } from "@/queries/useProductCatgsQueries";
import { type ProductCategory } from "@/store/useProductCategoriesStore";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

function MegaMenu() {
  const { data: categories, isLoading } = useProductCatgsQueries();
  const [isOpen, setIsOpen]     = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [activeSub, setActiveSub] = useState(0);

  const hasData = !!categories && categories.length > 0;
  const currentCat: ProductCategory | undefined = hasData ? categories[activeCat] : undefined;
  const subcategories = currentCat?.children ?? [];
  const currentSub: ProductCategory | undefined = subcategories[activeSub];
  const leafItems = currentSub?.children ?? [];

  const resetHover = () => { setIsOpen(false); setActiveCat(0); setActiveSub(0); };

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={resetHover}>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isOpen ? "bg-blue-300/20 text-white" : "text-white/90 hover:bg-blue-300/20 hover:text-white"
        }`}
      >
        دسته‌بندی‌ها
      </button>

      {isOpen && <div className="absolute right-0 top-full w-full h-2 bg-transparent" />}

      <div
        className={`absolute right-0 top-[calc(100%+8px)] md:min-w-[700px] lg:min-w-[860px] z-50 flex flex-row bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden transition-all duration-200 ease-out ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        {isLoading || !hasData ? (
          <MegaMenuSkeleton />
        ) : (
          <>
            {/* ── Column 1 — Main categories ── */}
            <div className="w-52 bg-blue-50 border-l border-blue-100 py-3 flex-shrink-0 flex flex-col">
              <p className="text-xs font-bold text-blue-300 uppercase tracking-widest px-5 pb-3 pt-1">
                دسته‌بندی‌ها
              </p>
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => { setActiveCat(i); setActiveSub(0); }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    activeCat === i ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        activeCat === i ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {cat.name?.[0]}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <ChevronLeft className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${activeCat === i ? "opacity-100" : "opacity-0"}`} />
                </button>
              ))}
            </div>

            {/* ── Column 2 — Subcategories ── */}
            <div className="w-52 bg-white border-l border-blue-50 py-3 flex-shrink-0 flex flex-col">
              <div className="flex items-center gap-2 px-4 pb-3 pt-1 border-b border-blue-50 mb-1">
                <p className="text-xs font-bold text-blue-800 truncate">{currentCat?.name}</p>
              </div>
              {subcategories.length === 0 ? (
                <p className="px-4 py-6 text-xs text-gray-400 text-center">زیرمجموعه‌ای ثبت نشده است</p>
              ) : (
                subcategories.map((sub, i) => (
                  <button
                    key={sub.id}
                    onMouseEnter={() => setActiveSub(i)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-all duration-150 ${
                      activeSub === i ? "bg-blue-50 text-blue-800 font-semibold" : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-800 font-medium"
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    <ChevronLeft className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${activeSub === i ? "opacity-100 text-blue-800" : "opacity-0"}`} />
                  </button>
                ))
              )}
            </div>

            {/* ── Column 3 — Leaf items ── */}
            <div className="flex-1 bg-white py-4 px-4 flex flex-col">
              {currentSub && (
                <>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-blue-50">
                    <h3 className="text-sm font-bold text-blue-800 truncate">{currentSub.name}</h3>
                    <Link
                      to={`/plp/${currentCat?.slug}/${currentSub.slug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      مشاهده همه
                      <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </div>

                  {leafItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-xs text-gray-400">موردی برای نمایش وجود ندارد</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-1 mb-2.5">
                      {leafItems.map((item) => (
                        <Link
                          key={item.id}
                          to={`/plp/${currentCat?.slug}/${currentSub?.slug}/${item.slug}`}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 group transition-all duration-150"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-800 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                            <ArrowLeft size={12} className="text-blue-800 group-hover:text-white transition-colors duration-150" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-800 transition-colors truncate">
                            {item.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-blue-50">
                    <Link
                      to={`/plp/${currentCat?.slug}`}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-150"
                    >
                      <span className="text-xs font-bold text-blue-800">مشاهده همه {currentCat?.name}</span>
                      <ArrowLeft size={14} className="text-blue-800" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MegaMenuSkeleton() {
  return (
    <div className="flex md:min-w-[700px] lg:min-w-[860px]">
      <div className="w-52 bg-blue-50 border-l border-blue-100 py-3 flex flex-col gap-2 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 bg-blue-100/60 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="w-52 bg-white border-l border-blue-50 py-3 flex flex-col gap-2 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 bg-blue-50 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="flex-1 py-4 px-4">
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-blue-50 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;