import {
  IconPackage,
  IconHeart,
  IconMapPin,
  IconBell,
  IconShoppingBag,
  IconSparkles,
  IconChevronLeft,
  IconClockHour4,
  IconTruck,
  IconCircleCheck,
  IconX,
} from "@tabler/icons-react";
import { Link } from "react-router";
import { useUserStore } from "@/store/useAccountStore";

const formatPrice = (price: string) => price;

const STATUS_STYLES: Record<string, { label: string; class: string; icon: typeof IconTruck }> = {
  "در حال ارسال": { label: "در حال ارسال", class: "bg-blue-50 border-blue-100 text-blue-800", icon: IconTruck },
  "تحویل شده":   { label: "تحویل شده",   class: "bg-green-50 border-green-100 text-green-700", icon: IconCircleCheck },
  "در حال پردازش": { label: "در حال پردازش", class: "bg-amber-50 border-amber-100 text-amber-700", icon: IconClockHour4 },
  "لغو شده":     { label: "لغو شده",     class: "bg-rose-50 border-rose-100 text-rose-600", icon: IconX },
};

const STATS = [
  { label: "سفارش‌های فعال", value: "۲", icon: IconPackage, link: "/profile/orders", color: "bg-blue-50 border-blue-100", iconColor: "text-blue-800" },
  { label: "علاقه‌مندی‌ها",  value: "۸", icon: IconHeart,   link: "/profile/favorites", color: "bg-rose-50 border-rose-100", iconColor: "text-rose-500" },
  { label: "آدرس‌های ذخیره", value: "۳", icon: IconMapPin,  link: "/profile/addresses", color: "bg-green-50 border-green-100", iconColor: "text-green-600" },
  { label: "اعلان‌های جدید", value: "۵", icon: IconBell,    link: "/profile/notifications", color: "bg-amber-50 border-amber-100", iconColor: "text-amber-600" },
];

const RECENT_ORDERS = [
  { id: "ORD-1002", date: "۱۴۰۳/۰۲/۰۱", status: "در حال ارسال", total: "450,000", items: 3 },
  { id: "ORD-1001", date: "۱۴۰۳/۰۱/۲۸", status: "تحویل شده",   total: "280,000", items: 2 },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

export default function Overview() {
  const { user } = useUserStore();

  return (
    <div className="flex flex-col gap-5">

      {/* Welcome */}
      <div className="bg-white border-2 border-blue-800 rounded-2xl p-6 text-blue-800">
        <h2 className="text-xl font-bold mb-1">
          خوش آمدید، {user?.fullname ?? user?.username ?? "کاربر"} 👋
        </h2>
        <p className="text-gray-600 text-sm leading-6">
          از پنل کاربری خود می‌توانید سفارش‌ها، آدرس‌ها و اطلاعات حساب خود را مدیریت کنید.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <div className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-sm hover:border-blue-200 transition-all duration-200 cursor-pointer h-full ${stat.color.split(" ")[1]}`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>سفارش‌های اخیر</SectionTitle>
          <Link
            to="/profile/orders"
            className="flex items-center gap-1 text-xs font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            مشاهده همه
            <IconChevronLeft size={13} />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {RECENT_ORDERS.map((order) => {
            const s = STATUS_STYLES[order.status] ?? STATUS_STYLES["در حال پردازش"];
            const StatusIcon = s.icon;
            return (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-blue-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <IconShoppingBag size={16} className="text-blue-800" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">سفارش {order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date} • {order.items} محصول</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="text-sm font-semibold text-blue-800 hidden sm:block">
                    {formatPrice(order.total)} تومان
                  </p>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${s.class}`}>
                    <StatusIcon size={12} />
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promo banner */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <SectionTitle>پیشنهاد ویژه برای شما</SectionTitle>
        <div className="mt-4 bg-gradient-to-l from-blue-800 to-blue-600 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IconSparkles size={16} className="text-amber-300" />
              <span className="text-xs font-medium text-blue-200">پیشنهاد محدود</span>
            </div>
            <h3 className="font-bold text-white text-base mb-1">تخفیف ویژه محصولات سلامت</h3>
            <p className="text-blue-200 text-sm">تا ۳۰٪ تخفیف روی محصولات منتخب بهداشت و سلامت</p>
          </div>
          <Link
            to="/products"
            className="flex-shrink-0 bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>

    </div>
  );
}