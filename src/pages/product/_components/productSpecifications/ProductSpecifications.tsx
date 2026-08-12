/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconWorld, IconDroplet, IconListDetails } from "@tabler/icons-react";
import type { IProductSpecifications } from "../../types/productPageTypes";
import SectionTitle from "../../../../components/common/sectionTitle/SectionTitle";

const FIELD_CONFIG: {
    key: "countryOfOrigin" | "productForm";
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
    { key: "countryOfOrigin", label: "کشور سازنده", icon: IconWorld },
    { key: "productForm", label: "نوع محصول", icon: IconDroplet },
];

function SpecItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-2.5 sm:gap-3 bg-blue-50/40 border border-blue-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white border border-blue-100 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-blue-800 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400">{label}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5 truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function ProductSpecifications({
    specifications,
}: {
    specifications?: IProductSpecifications | any;
}) {
    if (!specifications) return null;

    const mainItems = FIELD_CONFIG.map((f) => ({
        ...f,
        value: specifications[f.key],
    })).filter((f): f is typeof f & { value: string } => !!f.value);

    const attributeEntries = Object.entries(
        specifications.attributes ?? {}
    ).filter(([, v]) => !!v);
    const isEmpty = mainItems.length === 0 && attributeEntries.length === 0;

    return (
        <div
            id="specifications"
            className="scroll-mt-24 md:scroll-mt-32 bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6"
        >
            <SectionTitle>مشخصات محصول</SectionTitle>

            {isEmpty ? (
                <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
                    مشخصاتی برای این محصول ثبت نشده است
                </p>
            ) : (
                <div className="mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4">
                    {mainItems.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                            {mainItems.map((item) => (
                                <SpecItem
                                    key={item.key}
                                    icon={item.icon}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </div>
                    )}

                    {attributeEntries.length > 0 && (
                        <div className="border-t border-blue-50 pt-3 sm:pt-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                                <IconListDetails
                                    size={13}
                                    className="text-blue-800 sm:w-[15px] sm:h-[15px]"
                                />
                                <p className="text-xs sm:text-sm font-bold text-blue-800">
                                    ویژگی‌های تکمیلی
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
                                {attributeEntries.map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between gap-2 py-1.5 sm:py-2 border-b border-blue-50 text-xs sm:text-sm"
                                    >
                                        <span className="text-gray-400 truncate">
                                            {key}
                                        </span>
                                        <span className="font-semibold text-gray-700 truncate">
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
