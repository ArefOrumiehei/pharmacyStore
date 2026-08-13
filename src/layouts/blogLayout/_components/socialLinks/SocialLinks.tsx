import { IconBrandInstagram, IconBrandTelegram, IconRss } from "@tabler/icons-react";

export default function SocialLinks() {
    return (
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <a
                href="https://instagram.com"
                aria-label="اینستاگرام"
                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
                <IconBrandInstagram size={15} className="text-pink-500" />
            </a>
            <a
                href="https://telegram.me"
                aria-label="تلگرام"
                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
                <IconBrandTelegram size={15} className="text-blue-500" />
            </a>
            <a
                href="/blog/rss"
                aria-label="RSS"
                className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
                <IconRss size={15} className="text-orange-500" />
            </a>
        </div>
    );
}