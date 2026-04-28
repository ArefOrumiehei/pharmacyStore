import {
    IconCreditCard,
    IconHelpCircle,
    IconPhone,
    IconRosetteDiscountCheck,
    IconTruck,
} from "@tabler/icons-react";

interface Advantage {
    id: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    bgClass: string;
    iconClass: string;
    title: string;
    description: string;
}

const ADVANTAGES: Advantage[] = [
    {
        id: 1,
        icon: IconRosetteDiscountCheck,
        bgClass: "bg-amber-50 border-amber-100",
        iconClass: "text-amber-600",
        title: "ضمانت اصالت کالا",
        description: "تمامی محصولات دارای گواهی اصالت هستند",
    },
    {
        id: 2,
        icon: IconTruck,
        bgClass: "bg-green-50 border-green-100",
        iconClass: "text-green-600",
        title: "ارسال سریع و رایگان",
        description: "به سراسر کشور در کمتر از ۲۴ ساعت",
    },
    {
        id: 3,
        icon: IconHelpCircle,
        bgClass: "bg-blue-50 border-blue-100",
        iconClass: "text-blue-800",
        title: "مشاوره پزشکی آنلاین",
        description: "دریافت مشاوره آنلاین از پزشکان متخصص",
    },
    {
        id: 4,
        icon: IconPhone,
        bgClass: "bg-rose-50 border-rose-100",
        iconClass: "text-rose-600",
        title: "پشتیبانی ۲۴ ساعته",
        description: "آنلاین و تلفنی در تمام ساعات شبانه‌روز",
    },
    {
        id: 5,
        icon: IconCreditCard,
        bgClass: "bg-emerald-50 border-emerald-100",
        iconClass: "text-emerald-600",
        title: "پرداخت در محل",
        description: "امکان پرداخت هنگام تحویل کالا",
    },
];

export default function CompetitiveAdvantages() {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 py-4 px-4 rounded-2xl border border-blue-100 bg-white select-none">
            {ADVANTAGES.map(
                ({
                    id,
                    icon: Icon,
                    bgClass,
                    iconClass,
                    title,
                    description,
                }) => (
                    <div
                        key={id}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 border bg-white hover:shadow-sm transition-all duration-200 border-blue-50 hover:border-blue-100"
                    >
                        <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${bgClass}`}
                        >
                            <Icon size={18} className={iconClass} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-gray-700">
                                {title}
                            </span>
                            <span className="text-xs text-gray-400 leading-4">
                                {description}
                            </span>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
