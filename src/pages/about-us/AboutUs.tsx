import SectionTitle from "@/components/common/sectionTitle/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { useAboutUsQuery } from "@/queries/useSiteSettingsQueries";
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
  const {data, isLoading} = useAboutUsQuery();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
          <IconBuildingHospital size={28} className="text-blue-800" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-blue-800">درباره فارماپلاس</h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          داروخانه آنلاین شما، همراه مطمئن در مسیر سلامتی
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 mb-6">
        <SectionTitle extraClass="mb-5">ماموریت ما</SectionTitle>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="h-4 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-gray-500 leading-7">
            {data?.text}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className="bg-blue-800 rounded-2xl p-3 sm:p-5 text-center text-white"
          >
            <p className="text-lg sm:text-2xl font-bold" dir="ltr">{value}</p>
            <p className="text-[10px] sm:text-xs text-blue-200 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {FEATURES.map(({ icon: Icon, bgClass, iconClass, title, desc }) => (
          <div
            key={title}
            className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col gap-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border ${bgClass}`}>
              <Icon size={20} className={`${iconClass} w-4 h-4 sm:w-5 sm:h-5`} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">{title}</p>
              <p className="text-[10px] sm:text-xs text-gray-400 leading-5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-6 flex items-center gap-4">
        <div className="max-[270px]:hidden w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center flex-shrink-0">
          <IconStar size={20} className="text-amber-400 fill-amber-400" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold text-blue-800">چرا فارماپلاس؟</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-5">
            با بیش از ۵ سال تجربه در حوزه داروخانه آنلاین، بیش از ۱۰۰ هزار مشتری
            راضی به ما اعتماد کرده‌اند. ما به سلامت شما به عنوان یک مسئولیت نگاه
            می‌کنیم، نه صرفاً یک کسب‌وکار.
          </p>
        </div>
      </div>
    </div>
  );
}