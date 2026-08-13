import { Link } from "react-router";
import { IMAGE_BASE } from "@/apis/apiInstance";

export interface SubCategoryItem {
    id: string | number;
    name: string;
    fullSlug: string | null;
    picture: string;
    pictureAlt?: string;
}

export default function SubCategoriesGrid({ items }: { items: SubCategoryItem[] }) {
    if (!items.length) return null;

    return (
        <div className="my-6">
            {/* Mobile: horizontal snap-scroll strip of icon chips */}
            <div className="sm:hidden -mx-4 px-4 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden">
                {items.map((subCatg) => (
                    <Link
                        to={`/plp/${subCatg.fullSlug}`}
                        key={subCatg.id}
                        className="group flex flex-col items-center gap-2 flex-shrink-0 w-20 snap-start"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden p-2 transition-transform duration-150 group-active:scale-95">
                            <img
                                src={`${IMAGE_BASE}/${subCatg.picture}`}
                                alt={subCatg.pictureAlt ?? subCatg.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-[10px] text-center text-gray-600 font-medium line-clamp-2 leading-tight">
                            {subCatg.name}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Tablet / desktop: card grid */}
            <div className="hidden sm:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((subCatg) => (
                    <Link
                        to={`/plp/${subCatg.fullSlug}`}
                        key={subCatg.id}
                        className="group flex flex-col items-center rounded-2xl border border-blue-100 bg-white w-full p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-800 hover:shadow-lg"
                    >
                        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-blue-50/60 p-2">
                            <img
                                src={`${IMAGE_BASE}/${subCatg.picture}`}
                                alt={subCatg.pictureAlt ?? subCatg.name}
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="text-center text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-blue-800 transition-colors">
                            {subCatg.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}