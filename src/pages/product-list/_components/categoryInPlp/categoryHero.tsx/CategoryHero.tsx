import { IMAGE_BASE } from "@/apis/apiInstance";

export default function CategoryHero({
    image,
    description,
    title,
}: {
    image?: string;
    description?: string | null;
    title: string;
}) {
    if (!image && !description) return null;

    return (
        <div className="flex items-center gap-3 sm:gap-4 my-6 p-3 sm:p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-100 rounded-2xl">
            {image && (
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center p-2">
                    <img src={`${IMAGE_BASE}/${image}`} alt={title} className="w-full h-full object-contain" />
                </div>
            )}
            {description && (
                <p className="text-xs sm:text-sm text-gray-600 leading-5 sm:leading-6 line-clamp-3">{description}</p>
            )}
        </div>
    );
}