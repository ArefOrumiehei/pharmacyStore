import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { IconHelpCircle } from "@tabler/icons-react";
import { useFAQQuery } from "@/queries/useSiteSettingsQueries";

export default function FAQ() {
    const { data: faqData, isLoading} = useFAQQuery();
    const [searchParams] = useSearchParams();
    const targetValue = searchParams.get("q");

    // Open the targeted item (or first item by default)
    const [openItem, setOpenItem] = useState<string>(targetValue ?? "");

    // Refs for each accordion item so we can scroll to them
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const skeletonItems = Array.from({ length: 4 });

    useEffect(() => {
        if (!targetValue) return;

        // Set the item open
        setOpenItem(targetValue);

        // Scroll to it after a short delay to let the accordion open first
        const timer = setTimeout(() => {
            const el = itemRefs.current[targetValue];
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [targetValue]);

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12" dir="rtl">
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                    <IconHelpCircle size={28} className="text-blue-800" />
                </div>
                <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-blue-800">سوالات متداول</h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                    پاسخ سوالات رایج درباره خدمات فارماپلاس
                </p>
            </div>

            {/* Accordion */}
            <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="w-full">
                        {skeletonItems.map((_, index) => (
                            <div
                                key={index}
                                className={
                                    index !== skeletonItems.length - 1
                                        ? "border-b border-blue-50"
                                        : "border-none"
                                }
                            >
                                <div className="px-4 sm:px-6 py-4">
                                    <div className="h-4 w-3/4 rounded-full bg-blue-100 animate-pulse" />
                                </div>
                                <div className="px-4 sm:px-6 pb-4 space-y-2">
                                    <div className="h-3 w-full rounded-full bg-gray-100 animate-pulse" />
                                    <div className="h-3 w-5/6 rounded-full bg-gray-100 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={openItem}
                        onValueChange={setOpenItem}
                    >
                        {faqData?.items?.map((item, index) => (
                            <AccordionItem
                                key={index}
                                value={item.value}
                                className={
                                    index !== faqData?.items?.length - 1
                                        ? "border-b border-blue-50"
                                        : "border-none"
                                }
                                ref={(el) => {
                                    itemRefs.current[item.value] = el;
                                }}
                            >
                                <AccordionTrigger
                                    className={`px-4 sm:px-6 py-4 text-sm font-semibold hover:no-underline transition-colors duration-150 text-right ${
                                        openItem === item.value
                                            ? "text-blue-800 bg-blue-50/70"
                                            : "text-gray-700 hover:text-blue-800 hover:bg-blue-50/50"
                                    }`}
                                >
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-4 sm:px-6 pb-4 text-sm text-gray-500 leading-7">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 text-center bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <p className="text-sm text-gray-500 mb-3">
                    پاسخ سوال خود را پیدا نکردید؟
                </p>
                <Link
                    to="/contactus"
                    className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
                >
                    تماس با پشتیبانی
                </Link>
            </div>
        </div>
    );
}