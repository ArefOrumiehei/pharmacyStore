import { IconMail, IconPhone, IconMapPin, IconClock } from "@tabler/icons-react";
import { useSiteGlobalSettingQuery } from "@/queries/useSiteSettingsQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { toPersianDigits } from "smart-persian-tools";

export default function ContactUs() {
  // const [submitted, setSubmitted] = useState(false);
  const { data: generlaSettingsData, isLoading } = useSiteGlobalSettingQuery();

  const phoneItems = generlaSettingsData?.contact?.phones?.map((phone) => ({
    icon: IconPhone,
    bgClass: "bg-green-50 border-green-100",
    iconClass: "text-green-600",
    label: phone.title,
    value: toPersianDigits(phone.number),
    sub: "",
  })) ?? [];

  const CONTACT_ITEMS = [
    ...phoneItems,
    {
      icon: IconMail,
      bgClass: "bg-blue-50 border-blue-100",
      iconClass: "text-blue-800",
      label: "ایمیل",
      value: generlaSettingsData?.contact.email ?? "-",
      sub: "",
    },
    {
      icon: IconMapPin,
      bgClass: "bg-rose-50 border-rose-100",
      iconClass: "text-rose-600",
      label: "آدرس",
      value: generlaSettingsData?.contact.address ?? "-",
      sub: "",
    },
    {
      icon: IconClock,
      bgClass: "bg-amber-50 border-amber-100",
      iconClass: "text-amber-600",
      label: "ساعت کاری",
      value: generlaSettingsData?.contact.workingHours ?? "-",
      sub: "",
    },
  ];

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmitted(true);
  // };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
          <IconMail size={28} className="text-blue-800" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-blue-800">تماس با ما</h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          برای سوالات، پیشنهادات یا پشتیبانی با ما در ارتباط باشید
        </p>
      </div>

      <div className="flex items-start justify-center w-full gap-6">

        {/* Contact form */}
        {/* <div className="flex-2 w-full bg-white border border-blue-100 rounded-2xl p-6">
          <SectionTitle extraClass="mb-5">ارسال پیام</SectionTitle>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                <IconSend size={24} className="text-green-600" />
              </div>
              <p className="font-semibold text-gray-700">پیام شما با موفقیت ارسال شد!</p>
              <p className="text-sm text-gray-400">تیم پشتیبانی ما در اسرع وقت پاسخ خواهد داد.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-sm text-blue-800 hover:text-blue-600 hover:underline transition-colors"
              >
                ارسال پیام جدید
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    placeholder="نام خود را وارد کنید"
                    className="w-full border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">شماره موبایل</label>
                  <input
                    type="tel"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">ایمیل</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">موضوع</label>
                <select className="w-full border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 text-gray-600 transition-all duration-200">
                  <option value="">موضوع پیام را انتخاب کنید</option>
                  <option value="order">پیگیری سفارش</option>
                  <option value="return">مرجوع کردن کالا</option>
                  <option value="pharmacy">مشاوره دارویی</option>
                  <option value="technical">مشکل فنی سایت</option>
                  <option value="other">سایر موارد</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">پیام</label>
                <textarea
                  rows={4}
                  placeholder="متن پیام خود را بنویسید..."
                  className="w-full border border-blue-100 bg-blue-50/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 resize-none transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-150 shadow-sm shadow-blue-100"
              >
                <IconSend size={16} />
                ارسال پیام
              </button>
            </form>
          )}
        </div> */}

        {/* Contact info */}
        <div className="flex flex-col flex-1 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ContactCardSkeleton key={index} />
              ))
            : CONTACT_ITEMS.map(({ icon: Icon, bgClass, iconClass, label, value, sub }) => (
            <div
              key={label}
              className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-blue-200 transition-all duration-200"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border ${bgClass}`}
              >
                <Icon size={18} className={iconClass} />
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {label}
                </span>

                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  {value}
                </span>

                {sub && (
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {sub}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ContactCardSkeleton() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-xl" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}