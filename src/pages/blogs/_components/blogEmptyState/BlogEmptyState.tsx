import { IconSearch } from "@tabler/icons-react";

export default function BlogEmptyState() {
    return (
        <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-14 sm:py-20 gap-4 w-full px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <IconSearch size={28} className="text-blue-300" />
            </div>
            <p className="text-gray-500 font-medium">مقاله‌ای یافت نشد</p>
            <p className="text-gray-400 text-sm">فیلتر یا عبارت جستجو را تغییر دهید</p>
        </div>
    );
}