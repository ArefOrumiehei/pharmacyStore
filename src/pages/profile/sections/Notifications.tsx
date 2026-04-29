import { useState } from "react";
import {
  IconBell,
  IconPackage,
  IconTag,
  IconInfoCircle,
  IconCheck,
  IconTrash,
  IconChecks,
} from "@tabler/icons-react";

interface Notification {
  id: number;
  type: "order" | "offer" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL: Notification[] = [
  { id: 1, type: "order", title: "سفارش شما ارسال شد",        message: "سفارش ORD-1002 از انبار خارج شد و در مسیر تحویل است.",   time: "۲ ساعت پیش",  read: false },
  { id: 2, type: "offer", title: "تخفیف ویژه امروز",           message: "۲۰٪ تخفیف برای تمام محصولات بهداشتی تا پایان امروز.",    time: "۵ ساعت پیش",  read: false },
  { id: 3, type: "order", title: "سفارش شما تحویل داده شد",    message: "سفارش ORD-1001 با موفقیت تحویل داده شد.",               time: "۱ روز پیش",   read: true  },
  { id: 4, type: "info",  title: "به‌روزرسانی سیاست حریم خصوصی", message: "سیاست حریم خصوصی فارماپلاس به‌روزرسانی شد.",           time: "۳ روز پیش",   read: true  },
  { id: 5, type: "offer", title: "محصول موردعلاقه‌ات موجود شد", message: "قرص استامینوفن ۵۰۰ میلی‌گرم مجدداً موجود شد.",           time: "۵ روز پیش",   read: true  },
];

const TYPE_CONFIG = {
  order: { icon: IconPackage, bg: "bg-blue-50 border-blue-100", iconColor: "text-blue-800" },
  offer: { icon: IconTag,     bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-600" },
  info:  { icon: IconInfoCircle, bg: "bg-gray-50 border-gray-100", iconColor: "text-gray-500" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const remove = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">اعلان‌ها</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده` : "همه اعلان‌ها خوانده شده‌اند"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm font-medium text-blue-800 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconChecks size={15} />
            همه را خوانده‌ام
          </button>
        )}
      </div>

      {/* Empty */}
      {notifications.length === 0 && (
        <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <IconBell size={28} className="text-blue-300" />
          </div>
          <p className="text-sm text-gray-500">اعلانی وجود ندارد</p>
        </div>
      )}

      {/* Unread */}
      {notifications.some((n) => !n.read) && (
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-blue-50 bg-blue-50/50">
            <SectionTitle>خوانده نشده</SectionTitle>
          </div>
          <div className="divide-y divide-blue-50">
            {notifications.filter((n) => !n.read).map((notif) => {
              const cfg = TYPE_CONFIG[notif.type];
              const Icon = cfg.icon;
              return (
                <div key={notif.id} className="flex items-start gap-4 px-5 py-4 bg-blue-50/20 hover:bg-blue-50/40 transition-colors duration-150">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon size={16} className={cfg.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-5">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => markRead(notif.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-blue-800 hover:bg-blue-100 transition-colors"
                      title="علامت خوانده‌شده">
                      <IconCheck size={14} />
                    </button>
                    <button onClick={() => remove(notif.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="حذف">
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Read */}
      {notifications.some((n) => n.read) && (
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-blue-50">
            <SectionTitle>قبلاً خوانده شده</SectionTitle>
          </div>
          <div className="divide-y divide-blue-50">
            {notifications.filter((n) => n.read).map((notif) => {
              const cfg = TYPE_CONFIG[notif.type];
              const Icon = cfg.icon;
              return (
                <div key={notif.id} className="flex items-start gap-4 px-5 py-4 opacity-60 hover:opacity-80 transition-opacity duration-150">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon size={16} className={cfg.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">{notif.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-5">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                  <button onClick={() => remove(notif.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors flex-shrink-0"
                    title="حذف">
                    <IconTrash size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}