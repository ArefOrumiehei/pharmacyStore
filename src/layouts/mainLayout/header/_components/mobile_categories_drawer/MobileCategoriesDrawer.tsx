import { useEffect, useState } from "react";
import { Link } from "react-router";
import { IconX, IconChevronLeft, IconChevronDown } from "@tabler/icons-react";
import { useProductCatgsQueries } from "@/queries/useProductCatgsQueries";

// Types
import type { MobileCategoriesDrawerProps } from "../../types/HeaderTypes";

export default function MobileCategoriesDrawer({ open, onClose }: MobileCategoriesDrawerProps) {
  const { data: categories, isLoading } = useProductCatgsQueries();
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [openSub, setOpenSub] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset state when closed
  useEffect(() => {
    if (!open) { setOpenCat(null); setOpenSub(null); }
  }, [open]);

  const hasData = !!categories && categories.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — full height, from right, sits above bottom bar (pb-20) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0 block" : "translate-x-full hidden"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-blue-50 flex-shrink-0 bg-blue-800">
          <h2 className="text-base font-bold text-white">دسته‌بندی محصولات</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {isLoading || !hasData ? (
            <MobileCategoriesSkeleton />
          ) : (
            categories.map((cat, ci) => (
              <div key={cat.id} className="border-b border-blue-50 last:border-0">

                {/* Category row */}
                <button
                  onClick={() => { setOpenCat(openCat === ci ? null : ci); setOpenSub(null); }}
                  className={`w-full flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-150 ${
                    openCat === ci ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {cat.name?.[0]}
                    </span>
                    <span className={`text-sm font-semibold ${openCat === ci ? "text-blue-800" : "text-gray-700"}`}>
                      {cat.name}
                    </span>
                  </div>
                  <IconChevronDown
                    size={16}
                    className={`text-blue-300 transition-transform duration-200 flex-shrink-0 ${
                      openCat === ci ? "rotate-180 text-blue-800" : ""
                    }`}
                  />
                </button>

                {/* Subcategories accordion */}
                {openCat === ci && (
                  <div className="bg-blue-50/50">
                    

                    {cat.children.length === 0 ? (
                      <p className="px-5 py-4 text-xs text-gray-400 text-center">زیرمجموعه‌ای ثبت نشده است</p>
                    ) : (
                      cat.children.map((sub, si) => (
                        <div key={sub.id}>
                          {/* Subcategory row */}
                          <button
                            onClick={() => setOpenSub(openSub === si ? null : si)}
                            className={`w-full flex items-center justify-between gap-2 px-5 py-3 transition-colors duration-150 ${
                              openSub === si ? "bg-white" : "hover:bg-blue-50"
                            }`}
                          >
                            <span className={`text-sm font-medium text-right ${openSub === si ? "text-blue-800" : "text-gray-600"}`}>
                              {sub.name}
                            </span>
                            <IconChevronDown
                              size={14}
                              className={`text-gray-300 flex-shrink-0 transition-transform duration-200 ${
                                openSub === si ? "rotate-180 text-blue-800" : ""
                              }`}
                            />
                          </button>

                          {/* Leaf items list */}
                          {openSub === si && (
                            <div className="bg-white border-t border-blue-50 pb-1">
                              {sub.children.length === 0 ? (
                                <p className="px-6 py-3 text-xs text-gray-400 text-center">موردی ثبت نشده است</p>
                              ) : (
                                sub.children.map((item) => (
                                  <Link
                                    key={item.id}
                                    to={`/plp/${cat.slug}/${sub.slug}/${item.slug}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between px-6 py-2.5 hover:bg-blue-50 transition-colors group"
                                  >
                                    <span className="text-sm text-gray-700 group-hover:text-blue-800 font-medium transition-colors truncate">
                                      {item.name}
                                    </span>
                                    <IconChevronLeft size={13} className="text-gray-300 flex-shrink-0" />
                                  </Link>
                                ))
                              )}
                              <Link
                                to={`/plp/${cat.slug}/${sub.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-1 mx-6 mt-1 mb-2 text-xs font-bold text-blue-800 hover:text-blue-600 transition-colors"
                              >
                                مشاهده همه
                                <IconChevronLeft size={11} />
                              </Link>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {/* View all link */}
                    <Link
                      to={`/plp/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-5 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors border-b border-blue-100"
                    >
                      <span>مشاهده همه {cat.name}</span>
                      <IconChevronLeft size={13} />
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function MobileCategoriesSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-5 py-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-14 bg-blue-50 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}