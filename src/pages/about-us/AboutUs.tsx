import {
  IconHeart,
  IconUsers,
  IconAward,
  IconShieldCheck,
  IconBuildingHospital,
  IconStar,
} from "@tabler/icons-react";

const FEATURES = [
  {
    icon: IconHeart,
    bgClass: "bg-rose-50 border-rose-100",
    iconClass: "text-rose-500",
    title: "سلامت شما، اولویت ما",
    desc: "ارائه محصولات اصل و مرغوب با مجوزهای معتبر از وزارت بهداشت",
  },
  {
    icon: IconShieldCheck,
    bgClass: "bg-green-50 border-green-100",
    iconClass: "text-green-600",
    title: "تضمین اصالت",
    desc: "تمامی محصولات دارای مجوز رسمی و گواهی اصالت هستند",
  },
  {
    icon: IconUsers,
    bgClass: "bg-blue-50 border-blue-100",
    iconClass: "text-blue-800",
    title: "مشاوره تخصصی",
    desc: "پشتیبانی ۲۴ ساعته توسط داروسازان مجرب و متخصص",
  },
  {
    icon: IconAward,
    bgClass: "bg-amber-50 border-amber-100",
    iconClass: "text-amber-600",
    title: "تحویل سریع",
    desc: "ارسال فوری و ایمن به سراسر کشور در کمترین زمان",
  },
];

const STATS = [
  { value: "+۵۰۰۰", label: "محصول موجود" },
  { value: "+۱۰۰K", label: "مشتری راضی" },
  { value: "۲۴/۷", label: "پشتیبانی آنلاین" },
  { value: "+۵", label: "سال تجربه" },
];

export default function AboutUs() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
          <IconBuildingHospital size={28} className="text-blue-800" />
        </div>
        <h1 className="text-3xl font-bold text-blue-800">درباره فارماپلاس</h1>
        <p className="text-gray-400 text-sm">
          داروخانه آنلاین شما، همراه مطمئن در مسیر سلامتی
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-blue-800 flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
          ماموریت ما
        </h2>
        <div className="flex flex-col gap-3 text-sm text-gray-500 leading-7">
          <p>
            فارماپلاس با هدف تسهیل دسترسی به داروها و محصولات بهداشتی باکیفیت،
            خدمات داروخانه آنلاین را با بالاترین استانداردها ارائه می‌دهد. تلاش
            ما این است که شما بتوانید با اطمینان کامل، نیازهای دارویی خود را در
            کمترین زمان و با بهترین قیمت تأمین کنید.
          </p>
          <p>
            تیم ما متشکل از داروسازان مجرب، متخصصان فناوری اطلاعات و کارشناسان
            خدمات مشتری است که با تعهد و دقت، در خدمت سلامت شما هستند.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className="bg-blue-800 rounded-2xl p-5 text-center text-white"
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-blue-200 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {FEATURES.map(({ icon: Icon, bgClass, iconClass, title, desc }) => (
          <div
            key={title}
            className="bg-white border border-blue-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bgClass}`}>
              <Icon size={20} className={iconClass} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
              <p className="text-xs text-gray-400 leading-5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center flex-shrink-0">
          <IconStar size={20} className="text-amber-400 fill-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-800">چرا فارماپلاس؟</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-5">
            با بیش از ۵ سال تجربه در حوزه داروخانه آنلاین، بیش از ۱۰۰ هزار مشتری
            راضی به ما اعتماد کرده‌اند. ما به سلامت شما به عنوان یک مسئولیت نگاه
            می‌کنیم، نه صرفاً یک کسب‌وکار.
          </p>
        </div>
      </div>
    </div>
  );
}