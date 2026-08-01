import FooterBrand from "./_components/footerBrand/FooterBrand";
import FooterLinkColumn from "./_components/footerLinkColumn/FooterLinkColumn";
import FooterContact from "./_components/footerContact/FooterContact";
import FooterBottomBar from "./_components/footerBottomBar/FooterBottomBar";

const QUICK_LINKS = [
    { to: "/blog", label: "مقالات" },
    { to: "/faq", label: "سوالات متداول" },
    { to: "/aboutus", label: "درباره ما" },
    { to: "/contactus", label: "تماس با ما" },
    { to: "/terms", label: "قوانین و مقررات" },
];

const SERVICE_LINKS = [
    { to: "/faq?q=q7", label: "پیگیری سفارش" },
    { to: "/faq?q=q4", label: "مدت زمان ارسال" },
    { to: "/faq?q=q5", label: "شرایط بازگشت کالا" },
    { to: "/faq?q=q6", label: "خرید با نسخه پزشکی" },
];

function Footer() {
    return (
        <footer className="bg-white border-t border-blue-100 text-gray-700" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
                    <FooterBrand />
                    <FooterLinkColumn title="دسترسی سریع" links={QUICK_LINKS} />
                    <FooterLinkColumn title="خدمات مشتریان" links={SERVICE_LINKS} />
                    <FooterContact />
                </div>
            </div>

            <FooterBottomBar />
        </footer>
    );
}

export default Footer;