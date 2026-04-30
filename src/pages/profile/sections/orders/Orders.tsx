import { useNavigate } from "react-router";
import {
  IconPackage,
  IconEye,
  IconTruck,
  IconCircleCheck,
  IconClockHour4,
  IconX,
  IconShoppingBag,
  IconChevronLeft,
} from "@tabler/icons-react";
import { useState } from "react";

const formatPrice = (price: string | number) =>
  new Intl.NumberFormat("fa-IR").format(Number(price));

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: typeof IconTruck }> = {
  "در حال ارسال":   { label: "در حال ارسال",   class: "bg-blue-50 border-blue-100 text-blue-800",    icon: IconTruck       },
  "تحویل شده":      { label: "تحویل شده",      class: "bg-green-50 border-green-100 text-green-700", icon: IconCircleCheck },
  "در حال پردازش": { label: "در حال پردازش", class: "bg-amber-50 border-amber-100 text-amber-700",  icon: IconClockHour4  },
  "لغو شده":        { label: "لغو شده",        class: "bg-rose-50 border-rose-100 text-rose-600",    icon: IconX           },
};

const MOCK_ORDERS = [
  { id: "ORD-1002", date: "۱۴۰۳/۰۲/۰۱", status: "در حال ارسال", total: 450000, items: 3 },
  { id: "ORD-1001", date: "۱۴۰۳/۰۱/۲۸", status: "تحویل شده",    total: 280000, items: 2 },
  { id: "ORD-1000", date: "۱۴۰۳/۰۱/۱۵", status: "تحویل شده",    total: 175000, items: 1 },
];

export default function Orders() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("همه");

  // Replace with: const { orders } = useOrderStore();
  const orders = MOCK_ORDERS;

  const statuses = ["همه", ...Array.from(new Set(orders.map((o) => o.status)))];
  const filtered = filterStatus === "همه"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-blue-800">سفارش‌های من</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders.length} سفارش ثبت شده</p>
      </div>

      {/* Filter tabs */}
      {orders.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                filterStatus === s
                  ? "bg-blue-800 text-white border-blue-800"
                  : "bg-white text-gray-500 border-blue-100 hover:border-blue-300 hover:text-blue-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <IconShoppingBag size={28} className="text-blue-300" />
          </div>
          <p className="text-sm text-gray-500">
            {filterStatus === "همه"
              ? "هنوز سفارشی ثبت نکرده‌اید"
              : `سفارشی با وضعیت «${filterStatus}» یافت نشد`}
          </p>
        </div>
      )}

      {/* Order list */}
      <div className="flex flex-col gap-3">
        {filtered.map((order) => {
          const s = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["در حال پردازش"];
          const StatusIcon = s.icon;

          return (
            <div
              key={order.id}
              className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4 p-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <IconPackage size={18} className="text-blue-800" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">سفارش {order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.date} • {order.items} محصول
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-sm font-bold text-blue-800">
                    {formatPrice(order.total)} تومان
                  </p>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${s.class}`}>
                    <StatusIcon size={12} />
                    {s.label}
                  </span>
                  <button
                    onClick={() => navigate(`/profile/orders/${order.id}`)}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-800 hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-200"
                  >
                    <IconEye size={13} />
                    جزئیات
                    <IconChevronLeft size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}