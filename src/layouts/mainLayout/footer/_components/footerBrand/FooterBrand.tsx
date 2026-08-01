import { Separator } from "@/components/ui/separator";
import { IconBrandInstagram, IconBrandLinkedin, IconBrandTelegram } from "@tabler/icons-react";

const SOCIALS = [
  { href: "https://instagram.com", label: "اینستاگرام", icon: IconBrandInstagram, iconClass: "text-pink-500" },
  { href: "https://linkedin.com", label: "لینکدین", icon: IconBrandLinkedin, iconClass: "text-blue-800" },
  { href: "https://telegram.me", label: "تلگرام", icon: IconBrandTelegram, iconClass: "text-blue-400" },
];

export default function FooterBrand() {
  return (
    <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
        <h3 className="text-lg sm:text-2xl font-semibold text-blue-800">فارماپلاس</h3>
        <ul className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {SOCIALS.map(({ href, label, icon: Icon, iconClass }) => (
            <li
              key={href}
              className="bg-blue-50 border border-blue-100 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-blue-100 transition-all duration-200"
            >
              <a href={href} aria-label={label}>
                <Icon size={16} className={`${iconClass} sm:w-[18px] sm:h-[18px]`} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Separator className="bg-blue-100" />
      <p className="text-xs sm:text-sm text-gray-500 leading-6 sm:leading-7 text-justify">
        یک سری توضیحات راجع به داروخانه و اینکه چطور شروع شد،
        موسس کیه و ما کی هستیم. از چه سالی فعالیت داریم و هدفمون چیه.
      </p>
    </div>
  );
}