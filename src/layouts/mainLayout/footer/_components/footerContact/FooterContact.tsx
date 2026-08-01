import { IconPhone, IconMail, IconMapPin } from "@tabler/icons-react";

export default function FooterContact() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <h3 className="text-sm sm:text-base font-semibold text-blue-800">تماس با ما</h3>
      <ul className="space-y-3 sm:space-y-4">
        <li>
          <a href="tel:02134455191" className="flex items-start gap-2 sm:gap-2.5 group">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-green-50 border border-green-100 rounded-md sm:rounded-lg flex items-center justify-center">
              <IconPhone size={13} className="text-green-600 sm:w-[14px] sm:h-[14px]" />
            </span>
            <span className="text-xs sm:text-sm text-gray-500 group-hover:text-blue-800 transition-colors duration-150 leading-6 sm:leading-7">
              ۰۲۱-۳۴۴۵۵۱۹۱
            </span>
          </a>
        </li>
        <li>
          <a href="mailto:support@pharmacy.com" className="flex items-start gap-2 sm:gap-2.5 group">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-50 border border-blue-100 rounded-md sm:rounded-lg flex items-center justify-center">
              <IconMail size={13} className="text-blue-800 sm:w-[14px] sm:h-[14px]" />
            </span>
            <span className="text-xs sm:text-sm text-gray-500 group-hover:text-blue-800 transition-colors duration-150 leading-6 sm:leading-7 break-all">
              support@pharmacy.com
            </span>
          </a>
        </li>
        <li className="flex items-start gap-2 sm:gap-2.5">
          <span className="mt-0.5 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-rose-50 border border-rose-100 rounded-md sm:rounded-lg flex items-center justify-center">
            <IconMapPin size={13} className="text-rose-500 sm:w-[14px] sm:h-[14px]" />
          </span>
          <span className="text-xs sm:text-sm text-gray-500 leading-6 sm:leading-7">
            کرج، فلان جا، بهمان جا، نبش خیابون فلان
          </span>
        </li>
      </ul>
    </div>
  );
}