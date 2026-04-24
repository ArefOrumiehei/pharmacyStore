import {
  IconCreditCard,
  IconHelpCircle,
  IconPhone,
  IconRosetteDiscountCheck,
  IconTruck,
} from "@tabler/icons-react";

/* ---------------- TYPES ---------------- */
interface Advantage {
  id: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  title: string;
  description: string;
}

/* ---------------- DATA ---------------- */
const ADVANTAGES: Advantage[] = [
  {
    id: 1,
    icon: IconRosetteDiscountCheck,
    iconClass: "text-yellow-600",
    title: "ضمانت اصالت کالا",
    description: "تمامی محصولات دارای گواهی اصالت هستند",
  },
  {
    id: 2,
    icon: IconTruck,
    iconClass: "text-green-600",
    title: "ارسال سریع و رایگان",
    description: "به سراسر کشور در کمتر از ۲۴ ساعت",
  },
  {
    id: 3,
    icon: IconHelpCircle,
    iconClass: "text-blue-600",
    title: "مشاوره پزشکی آنلاین",
    description: "دریافت مشاوره آنلاین از پزشکان متخصص",
  },
  {
    id: 4,
    icon: IconPhone,
    iconClass: "text-red-600",
    title: "پشتیبانی ۲۴ ساعته",
    description: "آنلاین و تلفنی در تمام ساعات شبانه‌روز",
  },
  {
    id: 5,
    icon: IconCreditCard,
    iconClass: "text-green-600",
    title: "پرداخت در محل",
    description: "امکان پرداخت هنگام تحویل کالا",
  },
];

/* ---------------- COMPONENT ---------------- */
export default function CompetitiveAdvantages() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 py-4 px-6 rounded-xl border border-neutral-200 bg-white/60 backdrop-blur select-none">
      {ADVANTAGES.map(({ id, icon: Icon, iconClass, title, description }) => (
        <div key={id} className="flex items-center gap-3 bg-neutral-100/80 rounded-xl px-4 py-3">
          <Icon size={20} className={`${iconClass} flex-shrink-0`} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-800">{title}</span>
            <span className="text-xs text-neutral-500">{description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}