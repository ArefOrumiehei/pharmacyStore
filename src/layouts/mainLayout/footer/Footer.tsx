import { Separator } from "@/components/ui/separator";
import {
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTelegram,
    IconMail,
    IconMapPin,
    IconPhone,
} from "@tabler/icons-react";
import { Link } from "react-router";

function Footer() {
    return (
        <footer className="bg-white border-t border-blue-100 text-gray-700" dir="rtl">

            {/* ── Main grid ── */}
            <div className="container mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

                    {/* ── Brand col — spans full width on sm, 2 cols on lg ── */}
                    <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-blue-800">فارماپلاس</h3>
                            <ul className="flex items-center gap-2">
                                <li className="bg-blue-50 border border-blue-100 p-2 rounded-2xl hover:bg-blue-100 transition-all duration-200">
                                    <a href="https://instagram.com" aria-label="اینستاگرام">
                                        <IconBrandInstagram size={18} className="text-pink-500" />
                                    </a>
                                </li>
                                <li className="bg-blue-50 border border-blue-100 p-2 rounded-2xl hover:bg-blue-100 transition-all duration-200">
                                    <a href="https://linkedin.com" aria-label="لینکدین">
                                        <IconBrandLinkedin size={18} className="text-blue-800" />
                                    </a>
                                </li>
                                <li className="bg-blue-50 border border-blue-100 p-2 rounded-2xl hover:bg-blue-100 transition-all duration-200">
                                    <a href="https://telegram.me" aria-label="تلگرام">
                                        <IconBrandTelegram size={18} className="text-blue-400" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <Separator className="bg-blue-100" />
                        <p className="text-sm text-gray-500 leading-7 text-justify">
                            یک سری توضیحات راجع به داروخانه و اینکه چطور شروع شد،
                            موسس کیه و ما کی هستیم. از چه سالی فعالیت داریم و هدفمون چیه.
                        </p>
                    </div>

                    {/* ── Quick links ── */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-semibold text-blue-800">دسترسی سریع</h3>
                        <ul className="space-y-3">
                            {[
                                { to: "/blog",      label: "مقالات"           },
                                { to: "/faq",       label: "سوالات متداول"    },
                                { to: "/aboutus",   label: "درباره ما"        },
                                { to: "/contactus", label: "تماس با ما"       },
                                { to: "/terms",     label: "قوانین و مقررات"  },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-gray-500 hover:text-blue-800 transition-colors duration-150"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Customer service ── */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-semibold text-blue-800">خدمات مشتریان</h3>
                        <ul className="space-y-3">
                            {[
                                { to: "/faq?q=q7", label: "پیگیری سفارش"       },
                                { to: "/faq?q=q4", label: "مدت زمان ارسال"     },
                                { to: "/faq?q=q5", label: "شرایط بازگشت کالا"  },
                                { to: "/faq?q=q6", label: "خرید با نسخه پزشکی" },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-gray-500 hover:text-blue-800 transition-colors duration-150"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Contact ── */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-semibold text-blue-800">تماس با ما</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="tel:02134455191"
                                    className="flex items-start gap-2.5 group"
                                >
                                    <span className="mt-0.5 flex-shrink-0 w-7 h-7 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center">
                                        <IconPhone size={14} className="text-green-600" />
                                    </span>
                                    <span className="text-sm text-gray-500 group-hover:text-blue-800 transition-colors duration-150 leading-7">
                                        ۰۲۱-۳۴۴۵۵۱۹۱
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@pharmacy.com"
                                    className="flex items-start gap-2.5 group"
                                >
                                    <span className="mt-0.5 flex-shrink-0 w-7 h-7 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                                        <IconMail size={14} className="text-blue-800" />
                                    </span>
                                    <span className="text-sm text-gray-500 group-hover:text-blue-800 transition-colors duration-150 leading-7 break-all">
                                        support@pharmacy.com
                                    </span>
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex-shrink-0 w-7 h-7 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-center">
                                    <IconMapPin size={14} className="text-rose-500" />
                                </span>
                                <span className="text-sm text-gray-500 leading-7">
                                    کرج، فلان جا، بهمان جا، نبش خیابون فلان
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="bg-blue-800 text-white text-center py-3.5 text-sm">
                ساخته شده با 💗 در{" "}
                {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())}
            </div>
        </footer>
    );
}

export default Footer;