import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { IconHelpCircle } from "@tabler/icons-react";

const FAQ_ITEMS = [
    {
        value: "q1",
        question: "چگونه ثبت‌نام کنم؟",
        answer: "برای ثبت‌نام کافی است روی دکمه «ثبت‌نام» در بالای صفحه کلیک کنید، شماره موبایل یا ایمیل خود را وارد کرده و فرم را تکمیل نمایید. پس از تأیید، حساب کاربری شما فعال خواهد شد.",
    },
    {
        value: "q2",
        question: "آیا محصولات دارای ضمانت اصالت هستند؟",
        answer: "بله. تمامی محصولات فارماپلاس دارای مجوز از وزارت بهداشت بوده و از منابع معتبر و رسمی تأمین می‌شوند. گواهی اصالت برای هر محصول در صفحه آن قابل مشاهده است.",
    },
    {
        value: "q3",
        question: "روش‌های پرداخت چیست؟",
        answer: "پرداخت از طریق درگاه امن بانکی (کارت‌های عضو شبکه شتاب)، پرداخت در محل و کیف پول سایت امکان‌پذیر است. تمامی تراکنش‌ها رمزگذاری شده و کاملاً ایمن هستند.",
    },
    {
        value: "q4",
        question: "مدت زمان ارسال سفارش چقدر است؟",
        answer: "سفارشات در تهران معمولاً ظرف ۲۴ تا ۴۸ ساعت و در سایر شهرها ۳ تا ۵ روز کاری تحویل داده می‌شوند. پس از ارسال، کد پیگیری مرسوله برای شما پیامک می‌شود.",
    },
    {
        value: "q5",
        question: "آیا امکان مرجوع کردن کالا وجود دارد؟",
        answer: "بله. در صورتی که محصول دارای عیب یا آسیب باشد، ظرف ۷ روز از تاریخ تحویل می‌توانید درخواست مرجوعی ثبت کنید. برای محصولات دارویی خاص، شرایط مرجوعی ممکن است متفاوت باشد.",
    },
    {
        value: "q6",
        question: "آیا نسخه پزشکی برای خرید لازم است؟",
        answer: "داروهای بدون نسخه (OTC) بدون نیاز به نسخه قابل خرید هستند. برای داروهای نسخه‌ای، هنگام ثبت سفارش باید تصویر نسخه معتبر پزشک را آپلود کنید.",
    },
    {
        value: "q7",
        question: "چگونه می‌توانم سفارشم را پیگیری کنم؟",
        answer: "پس از ارسال سفارش، کد پیگیری از طریق پیامک و ایمیل برای شما ارسال می‌شود. همچنین می‌توانید از بخش «سفارشات من» در پروفایل خود وضعیت سفارش را مشاهده کنید.",
    },
    {
        value: "q8",
        question: "پشتیبانی چگونه با شما تماس بگیرم؟",
        answer: "تیم پشتیبانی ما ۲۴ ساعته از طریق چت آنلاین، تلفن ۰۲۱-۳۴۴۵۵۱۹۱ و ایمیل support@pharmaplus.com در دسترس است. میانگین زمان پاسخگویی کمتر از ۳۰ دقیقه است.",
    },
    {
        value: "q9",
        question: "آیا مشاوره دارویی رایگان است؟",
        answer: "بله. داروسازان مجرب ما به صورت رایگان و آنلاین آماده پاسخگویی به سوالات دارویی شما هستند. برای دریافت مشاوره می‌توانید از بخش «مشاوره آنلاین» استفاده کنید.",
    },
    {
        value: "q10",
        question: "آیا اشتراک ویژه یا باشگاه مشتریان دارید؟",
        answer: "بله. با عضویت در باشگاه مشتریان فارماپلاس از تخفیف‌های ویژه، اولویت ارسال و امتیازات خرید بهره‌مند شوید. جزئیات بیشتر در بخش «باشگاه مشتریان» موجود است.",
    },
];

export default function FAQ() {
    const [searchParams] = useSearchParams();
    const targetValue = searchParams.get("q");

    // Open the targeted item (or first item by default)
    const [openItem, setOpenItem] = useState<string>(targetValue ?? "");

    // Refs for each accordion item so we can scroll to them
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                    <IconHelpCircle size={28} className="text-blue-800" />
                </div>
                <h1 className="text-3xl font-bold text-blue-800">سوالات متداول</h1>
                <p className="text-gray-400 text-sm">
                    پاسخ سوالات رایج درباره خدمات فارماپلاس
                </p>
            </div>

            {/* Accordion */}
            <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={openItem}
                    onValueChange={setOpenItem}
                >
                    {FAQ_ITEMS.map((item, index) => (
                        <AccordionItem
                            key={item.value}
                            value={item.value}
                            className={
                                index !== FAQ_ITEMS.length - 1
                                    ? "border-b border-blue-50"
                                    : "border-none"
                            }
                            ref={(el) => {
                                itemRefs.current[item.value] = el;
                            }}
                        >
                            <AccordionTrigger
                                className={`px-6 py-4 text-sm font-semibold hover:no-underline transition-colors duration-150 text-right ${
                                    openItem === item.value
                                        ? "text-blue-800 bg-blue-50/70"
                                        : "text-gray-700 hover:text-blue-800 hover:bg-blue-50/50"
                                }`}
                            >
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-sm text-gray-500 leading-7">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 text-center bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <p className="text-sm text-gray-500 mb-3">
                    پاسخ سوال خود را پیدا نکردید؟
                </p>
                <a
                    href="/contactus"
                    className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
                >
                    تماس با پشتیبانی
                </a>
            </div>
        </div>
    );
}