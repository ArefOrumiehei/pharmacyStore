import { useParams, useNavigate, Link } from "react-router";
import {
  IconArrowRight,
  IconPackage,
  IconTruck,
  IconCircleCheck,
  IconClockHour4,
  IconX,
  IconDownload,
  IconMapPin,
  IconUser,
  IconPhone,
  IconCalendar,
  IconReceipt,
  IconPill,
} from "@tabler/icons-react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);

// ── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  discount?: number;
  shipping?: number;
  items: OrderItem[];
  receiver: { fullName: string; mobile: string; address: string; zipCode: string };
  payMethod: "online" | "card";
  trackingCode?: string;
}

// ── Mock data (replace with store/API) ───────────────────────────────────────

const MOCK_ORDERS: Record<string, Order> = {
  "ORD-1002": {
    id: "ORD-1002",
    date: "۱۴۰۳/۰۲/۰۱",
    status: "در حال ارسال",
    total: 450000,
    discount: 30000,
    shipping: 20000,
    trackingCode: "RH۱۲۳۴۵۶۷",
    payMethod: "online",
    receiver: {
      fullName: "علی رضایی",
      mobile: "۰۹۱۲۳۴۵۶۷۸۹",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲",
      zipCode: "۱۴۳۵۹۸۷۶۵۴",
    },
    items: [
      { id: "p1", name: "قرص سیتالوپرام ۲۰mg", category: "داروهای روان‌پزشکی", qty: 2, unitPrice: 145000 },
      { id: "p2", name: "شربت بروفن ۱۰۰ml",      category: "مسکن‌ها",             qty: 1, unitPrice: 98000  },
      { id: "p3", name: "ویتامین C 1000mg",       category: "مکمل‌ها",             qty: 1, unitPrice: 137000 },
    ],
  },
  "ORD-1001": {
    id: "ORD-1001",
    date: "۱۴۰۳/۰۱/۲۸",
    status: "تحویل شده",
    total: 280000,
    shipping: 0,
    payMethod: "card",
    receiver: {
      fullName: "علی رضایی",
      mobile: "۰۹۱۲۳۴۵۶۷۸۹",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲",
      zipCode: "۱۴۳۵۹۸۷۶۵۴",
    },
    items: [
      { id: "p4", name: "کرم ضدآفتاب SPF50", category: "مراقبت پوست", qty: 1, unitPrice: 185000 },
      { id: "p5", name: "ژل دست ضدعفونی",    category: "بهداشت",      qty: 2, unitPrice: 47500  },
    ],
  },
};

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; cardClass: string; badgeClass: string; icon: typeof IconTruck }> = {
  "در حال ارسال":   { label: "در حال ارسال",   cardClass: "bg-blue-50 border-blue-200",   badgeClass: "bg-blue-50 border-blue-200 text-blue-800",   icon: IconTruck         },
  "تحویل شده":      { label: "تحویل شده",      cardClass: "bg-green-50 border-green-200", badgeClass: "bg-green-50 border-green-200 text-green-700", icon: IconCircleCheck   },
  "در حال پردازش": { label: "در حال پردازش", cardClass: "bg-amber-50 border-amber-200",  badgeClass: "bg-amber-50 border-amber-200 text-amber-700", icon: IconClockHour4    },
  "لغو شده":        { label: "لغو شده",        cardClass: "bg-rose-50 border-rose-200",   badgeClass: "bg-rose-50 border-rose-200 text-rose-600",   icon: IconX             },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-blue-50">
        <span className="w-1 h-5 bg-blue-800 rounded-full flex-shrink-0" />
        <h2 className="text-sm font-bold text-blue-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof IconUser; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-blue-800" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // Replace with: const order = useOrderStore(s => s.getById(orderId))
  const order = orderId ? MOCK_ORDERS[orderId] : undefined;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <IconPackage size={28} className="text-blue-300" />
        </div>
        <p className="text-sm font-medium text-gray-500">سفارش مورد نظر یافت نشد</p>
        <button
          onClick={() => navigate("/profile/orders")}
          className="text-sm font-semibold text-blue-800 underline underline-offset-2"
        >
          بازگشت به سفارش‌ها
        </button>
      </div>
    );
  }

  const s = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["در حال پردازش"];
  const StatusIcon = s.icon;
  const subtotal = order.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);

  return (
    <div className="flex flex-col gap-5" dir="rtl">

      {/* Back + header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile/orders")}
            className="w-9 h-9 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-colors duration-150"
          >
            <IconArrowRight size={17} className="text-blue-800" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-blue-800">سفارش {order.id}</h1>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <IconCalendar size={12} />
              {order.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${s.badgeClass}`}>
            <StatusIcon size={13} />
            {s.label}
          </span>
          <button className="flex items-center gap-1.5 text-xs font-medium text-blue-800 bg-white hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all duration-150">
            <IconDownload size={13} />
            فاکتور
          </button>
        </div>
      </div>

      {/* Status banner (only for active shipment) */}
      {order.status === "در حال ارسال" && order.trackingCode && (
        <div className={`flex items-center justify-between gap-3 border rounded-2xl px-5 py-4 flex-wrap ${s.cardClass}`}>
          <div className="flex items-center gap-3">
            <IconTruck size={20} className="text-blue-800 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-800">مرسوله در راه است</p>
              <p className="text-xs text-blue-600 mt-0.5">کد رهگیری: {order.trackingCode}</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-blue-800 bg-white border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors duration-150">
            پیگیری مرسوله
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Items */}
          <SectionCard title="اقلام سفارش">
            <div className="flex flex-col divide-y divide-blue-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <IconPill size={18} className="text-blue-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                  </div>
                  <div className="text-left flex flex-col items-end gap-0.5 flex-shrink-0">
                    <p className="text-sm font-bold text-blue-800">{formatPrice(item.qty * item.unitPrice)} تومان</p>
                    <p className="text-xs text-gray-400">{item.qty} × {formatPrice(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Receiver info */}
          <SectionCard title="اطلاعات گیرنده">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={IconUser}    label="نام گیرنده"  value={order.receiver.fullName} />
              <InfoRow icon={IconPhone}   label="موبایل"      value={order.receiver.mobile}   />
              <InfoRow icon={IconMapPin}  label="کد پستی"     value={order.receiver.zipCode}  />
              <InfoRow icon={IconReceipt} label="روش پرداخت"  value={order.payMethod === "online" ? "پرداخت آنلاین" : "کارت به کارت"} />
            </div>
            <div className="mt-4 pt-4 border-t border-blue-50">
              <InfoRow icon={IconMapPin} label="آدرس تحویل" value={order.receiver.address} />
            </div>
          </SectionCard>
        </div>

        {/* Right column — price summary */}
        <div className="flex flex-col gap-5">
          <SectionCard title="خلاصه مالی">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>جمع اقلام</span>
                <span className="font-medium text-gray-800">{formatPrice(subtotal)} تومان</span>
              </div>
              {order.discount != null && order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>تخفیف</span>
                  <span className="font-medium">− {formatPrice(order.discount)} تومان</span>
                </div>
              )}
              {order.shipping != null && (
                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span className="font-medium text-gray-800">
                    {order.shipping === 0 ? "رایگان" : `${formatPrice(order.shipping)} تومان`}
                  </span>
                </div>
              )}
              <div className="h-px bg-blue-50 my-1" />
              <div className="flex justify-between text-blue-800 font-bold text-base">
                <span>مبلغ پرداخت شده</span>
                <span>{formatPrice(order.total)} تومان</span>
              </div>
            </div>
          </SectionCard>

          {/* Quick actions */}
          <div className="flex flex-col gap-2">
            <Link
              to="/tickets/new"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 text-blue-800 text-sm font-semibold transition-all duration-150"
            >
              مشکلی دارید؟ تیکت بزنید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}