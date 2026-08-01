import DOMPurify from "dompurify";
import { toPersianDigits } from "smart-persian-tools";

// Components
import CommentsSection from "../commentsSection/CommentsSection";

// Types
import type { ProductTabsProps } from "../../types/productPageTypes";

const sanitize = (html: string) => DOMPurify.sanitize(html ?? "");

export default function ProductTabs({
  activeTab, onTabChange, description, comments, productId
}: ProductTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl p-1 gap-1">
        {(["description", "reviews"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 truncate ${
              activeTab === tab
                ? "bg-white text-blue-800 shadow-sm border border-blue-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "description" ? "معرفی محصول" : `نظرات (${toPersianDigits(comments.length)})`}
          </button>
        ))}
      </div>

      {activeTab === "description" && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6">
          <div
            className="prose prose-rtl max-w-full text-xs sm:text-sm text-gray-700 leading-7 sm:leading-8"
            dangerouslySetInnerHTML={{ __html: sanitize(description ?? "") }}
          />
        </div>
      )}

      {activeTab === "reviews" && (
        <CommentsSection productId={productId} initialComments={comments} />
      )}
    </div>
  );
}