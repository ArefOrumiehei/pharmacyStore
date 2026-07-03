import { useNavigate } from "react-router";
import {
  IconPackage,
  IconEye,
  IconTruck,
  IconCircleCheck,
  IconX,
  IconShoppingBag,
  IconChevronLeft,
  IconLoader2,
  IconArrowBack,
  IconArrowBackUp,
  IconRotateClockwise,
  IconHomeCheck,
  IconClockDollar,
  IconCreditCard,
  IconReceipt,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useAccountStore";
import type { IOrder } from "@/services/accountServices/accountServices";
import { toPersianDigits } from "smart-persian-tools";

// ─── Status config — keyed on statusTitle from API ───────────────────────────

const STATUS_CONFIG: Record<
  number,
  {
    label: string;
    class: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
  }
> = {
  1: {
    label: "ثبت شده، پرداخت نشده",
    class: "bg-gray-50 border-gray-100 text-gray-700",
    icon: IconReceipt,
  },

  2: {
    label: "در انتظار پرداخت درگاه",
    class: "bg-yellow-50 border-yellow-100 text-yellow-700",
    icon: IconCreditCard,
  },

  3: {
    label: "در انتظار تایید کارت به کارت",
    class: "bg-amber-50 border-amber-100 text-amber-700",
    icon: IconClockDollar,
  },

  4: {
    label: "پرداخت موفق",
    class: "bg-emerald-50 border-emerald-100 text-emerald-700",
    icon: IconCircleCheck,
  },

  5: {
    label: "در حال آماده سازی",
    class: "bg-orange-50 border-orange-100 text-orange-700",
    icon: IconPackage,
  },

  6: {
    label: "ارسال شده",
    class: "bg-blue-50 border-blue-100 text-blue-800",
    icon: IconTruck,
  },

  7: {
    label: "تحویل داده شده",
    class: "bg-green-50 border-green-100 text-green-700",
    icon: IconHomeCheck,
  },

  8: {
    label: "نیازمند بازگشت وجه",
    class: "bg-purple-50 border-purple-100 text-purple-700",
    icon: IconRotateClockwise,
  },

  9: {
    label: "لغو شده",
    class: "bg-rose-50 border-rose-100 text-rose-600",
    icon: IconX,
  },

  10: {
    label: "مرجوع شده",
    class: "bg-red-50 border-red-100 text-red-700",
    icon: IconArrowBackUp,
  },

  11: {
    label: "درخواست مرجوعی",
    class: "bg-indigo-50 border-indigo-100 text-indigo-700",
    icon: IconArrowBack,
  },
};

const FALLBACK_STATUS = STATUS_CONFIG[5];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-blue-50 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 animate-pulse flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-28 bg-blue-50 animate-pulse rounded" />
              <div className="h-3 w-20 bg-blue-50 animate-pulse rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 bg-blue-50 animate-pulse rounded" />
            <div className="h-6 w-24 bg-blue-50 animate-pulse rounded-full" />
            <div className="h-7 w-16 bg-blue-50 animate-pulse rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filterStatus }: { filterStatus: string }) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        <IconShoppingBag size={28} className="text-blue-300" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">
          {filterStatus === "همه" ? "هنوز سفارشی ثبت نکرده‌اید" : `سفارشی با وضعیت «${filterStatus}» یافت نشد`}
        </p>
        {filterStatus === "همه" && (
          <p className="text-xs text-gray-400 mt-1">پس از ثبت سفارش، اینجا نمایش داده می‌شود</p>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: IOrder }) {
  const navigate   = useNavigate();
  const s          = STATUS_CONFIG[order.status] ?? FALLBACK_STATUS;
  const StatusIcon = s.icon;

  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between gap-4 p-5 flex-wrap">

        {/* Order info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <IconPackage size={18} className="text-blue-800" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">سفارش {toPersianDigits(order.id)}#</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {toPersianDigits(order.creationDateDisplay)} • {toPersianDigits(order.itemsCount)} محصول
            </p>
          </div>
        </div>

        {/* Price + status + action */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Amounts */}
          <div className="flex flex-col items-end">
            {order.discountAmount > 0 && (
              <span className="text-[11px] text-gray-400 line-through">
                {toPersianDigits(order.totalAmountDisplay)}
              </span>
            )}
            <p className="text-sm font-bold text-blue-800">{toPersianDigits(order.payAmountDisplay)}</p>
          </div>

          {/* Status badge */}
          <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${s.class}`}>
            <StatusIcon size={12} />
            {s.label}
          </span>

          {/* Tracking number */}
          {order.postTrackingNumber && (
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-xl">
              رهگیری: {toPersianDigits(order.postTrackingNumber)}
            </span>
          )}

          {/* Detail button */}
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

      {/* Items preview strip */}
      {/* {order.items > 0 && (
        <div className="border-t border-blue-50 px-5 py-3 flex items-center gap-2 overflow-x-auto">
          {order.items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-blue-50/60 border border-blue-100 rounded-xl px-2.5 py-1.5 flex-shrink-0"
            >
              <img
                src={item.productFullPath || item.productPicture}
                alt={item.productName}
                className="w-6 h-6 object-contain rounded flex-shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span className="text-xs text-gray-600 max-w-[100px] truncate">{item.productName}</span>
              <span className="text-xs font-semibold text-blue-800 flex-shrink-0">×{item.qty}</span>
            </div>
          ))}
          {orderItems.length > 4 && (
            <span className="text-xs text-gray-400 flex-shrink-0">+{orderItems.length - 4} مورد دیگر</span>
          )}
        </div>
      )} */}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState<string>("همه");
  const { userOrders, fetchUserOrders, loading } = useUserStore();

  useEffect(() => {
    fetchUserOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const orders: IOrder[] = userOrders ?? [];

  const statuses = ["همه", ...Array.from(new Set(orders.map((o) => o.statusTitle)))];
  const filtered = filterStatus === "همه"
    ? orders
    : orders.filter((o) => o.statusTitle === filterStatus);

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">سفارش‌های من</h1>
          {!loading.orders && (
            <p className="text-sm text-gray-400 mt-0.5">{toPersianDigits(orders?.length)} سفارش ثبت شده</p>
          )}
        </div>
        {loading.orders && (
          <IconLoader2 size={18} className="text-blue-400 animate-spin" />
        )}
      </div>

      {/* Filter tabs — only shown once loaded */}
      {!loading.orders && orders?.length > 0 && (
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

      {/* Content */}
      {loading.orders ? (
        <OrderSkeleton />
      ) : filtered?.length === 0 ? (
        <EmptyState filterStatus={filterStatus} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}