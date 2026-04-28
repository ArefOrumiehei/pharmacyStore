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
        <footer className="bg-white border border-blue-100 text-gray-700 pt-6 rounded-t-lg overflow-hidden h-full">
            <div className="container mx-auto px-6 pb-6 pt-4 flex items-start justify-center flex-wrap gap-8 h-full">
                <div className="flex-2 px-6 pb-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-blue-800">
                            فارماپلاس
                        </h3>
                        <div>
                            <ul className="flex items-center justify-start gap-2">
                                <li className="bg-blue-50 border border-blue-100 p-2 rounded-2xl hover:bg-blue-100 transition-all duration-200">
                                    <a href="https://instagram.com">
                                        <IconBrandInstagram className="text-pink-500" />
                                    </a>
                                </li>
                                <li className="bg-blue-50 border border-blue-100 p-2 rounded-2xl hover:bg-blue-100 transition-all duration-200">
                                    <a href="https://telegram.me">
                                        <IconBrandLinkedin className="text-blue-800" />
                                    </a>
                                </li>
                                <li className="bg-blue-50 border border-blue-100 p-2 rounded-2xl hover:bg-blue-100 transition-all duration-200">
                                    <a href="https://telegram.me">
                                        <IconBrandTelegram className="text-blue-400" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Separator className="my-4 bg-blue-100" />
                    <div>
                        <p className="text-justify leading-6.5 text-gray-600">
                            ی سری توضیحات راجب داروخونه و اینکه چیشد ک چنین شد و
                            اصن چرا و به چ دلیل ک ما اینجاییم و اخه ک چی بشه اصن
                            تهش خب برای چی اصن؟ فلان بهمان و بیسار و تشکیلات و
                            اینکه از چ سالی داروخونه هستش و چیشد ک به اینجا رسید
                            و موسس کیه و ما کی هستیم و اوتا کی هستنو و ازمون چی
                            میخان.؟
                        </p>
                    </div>
                </div>

                <div className="flex-1 min-w-[100px]">
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">
                        دسترسی سریع
                    </h3>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                خانه
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/aboutus"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                درباره ما
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contactus"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                تماس با ما
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faq"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                سوالات متداول
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                قوانین و مقررات
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="flex-1 min-w-[120px]">
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">
                        خدمات مشتریان
                    </h3>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                نحوه ثبت سفارش
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/aboutus"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                پیگیری سفارش
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faq"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                شرایط بازگشت کالا
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faq"
                                className="text-gray-600 hover:text-blue-800 transition"
                            >
                                نحوه ارسال مرسولات
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="flex-1 flex items-start justify-between flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <IconPhone className="flex-shrink-0 text-green-600" />
                        <span className="text-gray-600">021-34455191</span>
                    </div>
                    <Separator className="bg-blue-100" />
                    <div className="flex items-center gap-2">
                        <IconMail className="flex-shrink-0 text-blue-800" />
                        <span className="text-gray-600">
                            support@pharmacy.com
                        </span>
                    </div>
                    <Separator className="bg-blue-100" />
                    <div className="flex items-center gap-2">
                        <IconMapPin className="flex-shrink-0 text-blue-800" />
                        <span className="text-gray-600">
                            کرج، فلان جا، بهمان جا، نبش خیابون فلان
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-blue-800 text-white text-center py-4 text-sm">
                ساخته شده با 💗 در{" "}
                {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
                    new Date()
                )}
            </div>
        </footer>
    );
}

export default Footer;
