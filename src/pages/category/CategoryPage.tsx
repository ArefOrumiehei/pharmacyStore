import { Link, useParams } from "react-router";
import { IconTag, IconCategory } from "@tabler/icons-react";
import { useProductCategoryByName } from "@/queries/useProductCatgsQueries";
import { IMAGE_BASE } from "@/apis/apiInstance";
import Breadcrumb from "@/components/common/breadcrumb/Breadcrumb";

const resolveImage = (path?: string | null) => (path ? `${IMAGE_BASE}/${path}` : null);

function CategoryPage() {
    const { catgSlug } = useParams();
    const slug = catgSlug ?? "";

    const { data: catgData, isLoading } = useProductCategoryByName(slug);

    if (isLoading) return <CategoryPageSkeleton />;
    if (!catgData) return null;

    const keywords = catgData.keywords
        ? catgData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];
    const hasChildren = catgData.children && catgData.children.length > 0;
    const bannerSrc = resolveImage(catgData.picture);

    return (
        <div className="flex flex-col gap-8 sm:gap-10 pb-10 px-2 mt-6">
            <Breadcrumb categories={catgData.name} />

            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-50 to-blue-100/40 border border-blue-100">
                <div className="flex flex-col-reverse sm:flex-row items-center gap-6 p-6 sm:p-10">
                    <div className="flex-1 text-center sm:text-right space-y-3">
                        <h1 className="text-xl sm:text-3xl font-bold text-blue-900">
                            {catgData.name}
                        </h1>
                        {catgData.description && (
                            <div
                                className="text-gray-500 text-xs sm:text-sm leading-6 max-w-xl [&_p]:m-0"
                                dangerouslySetInnerHTML={{ __html: catgData.description }}
                            />
                        )}
                    </div>

                    {bannerSrc && (
                        <div className="shrink-0 w-28 h-28 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                            <img
                                src={bannerSrc}
                                alt={catgData.pictureAlt || catgData.name}
                                title={catgData.pictureTitle || catgData.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Subcategories */}
            {hasChildren && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <IconCategory size={18} className="text-blue-700" />
                        <h2 className="text-base sm:text-lg font-bold text-gray-800">زیردسته‌ها</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {catgData.children.map((subCatg) => {
                            const subImg = resolveImage(subCatg.picture);
                            return (
                                <Link
                                    key={subCatg.id}
                                    to={`/plp/${subCatg.fullSlug}`}
                                    className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all"
                                >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                                        {subImg ? (
                                            <img
                                                src={subImg}
                                                alt={subCatg.pictureAlt || subCatg.name}
                                                title={subCatg.pictureTitle || subCatg.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <IconCategory size={24} className="text-blue-300" />
                                        )}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-blue-700 transition-colors line-clamp-2">
                                        {subCatg.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <IconTag size={16} className="text-gray-400" />
                        <h2 className="text-sm font-semibold text-gray-500">کلمات مرتبط</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {keywords.map((keyword, index) => (
                            <span
                                key={`${index}-${keyword}`}
                                className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function CategoryPageSkeleton() {
    return (
        <div className="flex flex-col gap-8 sm:gap-10 pb-10 animate-pulse">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-40 sm:h-52 bg-gray-100 rounded-2xl" />
            <div className="space-y-4">
                <div className="h-5 w-24 bg-gray-100 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;