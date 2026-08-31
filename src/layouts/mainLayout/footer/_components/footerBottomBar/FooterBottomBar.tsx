import { useSiteGlobalSettingQuery } from "@/queries/useSiteSettingsQueries";

export default function FooterBottomBar() {
  const {data: siteSetting} = useSiteGlobalSettingQuery();
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-2 mx-auto px-4 sm:px-6 bg-blue-800 text-white text-center py-2.5 sm:py-3.5 text-xs sm:text-sm">
      <div>
        {siteSetting?.generalSetting.copyrightText}
      </div>
      <div>
        ساخته شده با 💗 در{" "}
        {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())}
      </div>
    </div>
  );
}