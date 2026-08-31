import FooterBrand from "./_components/footerBrand/FooterBrand";
import FooterLinkColumn from "./_components/footerLinkColumn/FooterLinkColumn";
import FooterContact from "./_components/footerContact/FooterContact";
import FooterBottomBar from "./_components/footerBottomBar/FooterBottomBar";
import { useProductCatgsQueries } from "@/queries/useProductCatgsQueries";
import FooterTrustBadges from "./_components/footerTrustBadges/FooterTrustBadges";

const QUICK_LINKS = [
    { to: "/blog", label: "مقالات" },
    { to: "/aboutus", label: "درباره ما" },
    { to: "/contactus", label: "تماس با ما" },
    { to: "/faq", label: "سوالات متداول" },
    { to: "/terms", label: "قوانین و مقررات" },
];

const SERVICE_LINKS = [
    { to: "/return-policy", label: "شرایط بازگشت کالا" },
    { to: "/faq?q=7", label: "پیگیری سفارش" },
    { to: "/faq?q=4", label: "مدت زمان ارسال" },
    { to: "/faq?q=6", label: "خرید با نسخه پزشکی" },
];

const MAX_FOOTER_CATEGORIES = 5;

function Footer() {
    const { data: catgsData, isLoading } = useProductCatgsQueries();

    const categoryLinks =
        catgsData?.slice(0, MAX_FOOTER_CATEGORIES).map((c) => ({
            to: `/plp/${c.slug}`,
            label: c.name,
        })) ?? [];

    return (
        <footer className="bg-white border-t border-blue-100 text-gray-700" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6">
                    <FooterBrand />
                    <FooterLinkColumn title="دسترسی سریع" links={QUICK_LINKS} />
                    <FooterLinkColumn title="خدمات مشتریان" links={SERVICE_LINKS} />
                    {!isLoading && categoryLinks.length > 0 && (
                        <FooterLinkColumn title="دسته‌بندی محصولات" links={categoryLinks} />
                    )}
                    <FooterContact />
                </div>

                <div className="mt-8 pt-6 border-t border-blue-50 flex justify-center md:justify-end">
                    <FooterTrustBadges />
                </div>
            </div>

            <FooterBottomBar />
        </footer>
    );
}

export default Footer;