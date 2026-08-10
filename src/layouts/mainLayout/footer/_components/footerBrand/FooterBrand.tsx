import { Separator } from "@/components/ui/separator";
import { useSiteGlobalSettingQuery } from "@/queries/useSiteSettingsQueries";
import type { ISocialItem } from "@/services/siteServices/siteServices";
import { IconBrandInstagram, IconBrandLinkedin, IconBrandTelegram } from "@tabler/icons-react";

const SOCIAL_ICON_MAP = {
  tel: {
    icon: IconBrandTelegram,
    label: "تلگرام",
    iconClass: "text-blue-400",
  },
  telegram: {
    icon: IconBrandTelegram,
    label: "تلگرام",
    iconClass: "text-blue-400",
  },
  instagram: {
    icon: IconBrandInstagram,
    label: "اینستاگرام",
    iconClass: "text-pink-500",
  },
  linkedin: {
    icon: IconBrandLinkedin,
    label: "لینکدین",
    iconClass: "text-blue-800",
  },
};

const getSocialConfig = (platformName: string) => {
  return SOCIAL_ICON_MAP[
    platformName.toLowerCase() as keyof typeof SOCIAL_ICON_MAP
  ];
};

const getSocialHref = (social: ISocialItem) => {
  const id = social.linkOrId;

  switch (social.platformName.toLowerCase()) {
    case "tel":
    case "telegram":
      return `https://t.me/${id}`;

    case "instagram":
      return `https://instagram.com/${id}`;

    case "linkedin":
      return `https://linkedin.com/in/${id}`;

    default:
      return "#";
  }
};

export default function FooterBrand() {
  const { data: siteSttings } = useSiteGlobalSettingQuery();
  
  return (
    <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
        <h3 className="text-lg sm:text-2xl font-semibold text-blue-800">فارماپلاس</h3>
        <ul className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {siteSttings?.socials.items.map((social, index) => {
            const config = getSocialConfig(social.platformName);

            if (!config) return null;

            const Icon = config.icon;

            return (
              <li
                key={index}
                className="bg-blue-50 border border-blue-100 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-blue-100 transition-all duration-200"
              >

                <a
                  href={getSocialHref(social)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={config.label}
                >
                  <Icon
                    size={16}
                    className={`${config.iconClass} sm:h-[18px] sm:w-[18px]`}
                  />
                </a>
              </li>
            );
          })}
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